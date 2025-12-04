#!/usr/bin/env bash
set -euo pipefail

# -------------------------------
# Variables
# -------------------------------
TERRAFORM_DIR="terraform"
AWS_REGION="eu-north-1"
NAMESPACE_DEFAULT="default"
NAMESPACE_MONITOR="monitoring"
ECR_FRONTEND="employee-madness-frontend"
ECR_BACKEND="employee-madness-backend"
ECR_POPULATE="employee-madness-populate"

# -------------------------------
# Step 1: Terraform - Provision AWS EKS Cluster & ECR
# -------------------------------
echo "🌟 Provisioning AWS resources with Terraform..."
pushd $TERRAFORM_DIR

terraform init
terraform apply -auto-approve

# Export outputs
export EKS_CLUSTER_NAME=$(terraform output -raw eks_cluster_name)
export ECR_FRONTEND_URI=$(terraform output -raw ecr_frontend_uri)
export ECR_BACKEND_URI=$(terraform output -raw ecr_backend_uri)
export ECR_POPULATE_URI=$(terraform output -raw ecr_populate_uri)

popd

# -------------------------------
# Step 2: Update kubeconfig
# -------------------------------
echo "Updating kubeconfig..."
aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME

# -------------------------------
# Step 3: Deploy backend
# -------------------------------
echo "Deploying backend (server) so LoadBalancer can be created..."
kubectl apply -f k8s/server.yaml

echo "Waiting for backend service LoadBalancer..."
sleep 10

BACKEND_HOST=""
while [ -z "$BACKEND_HOST" ]; do
  echo "⏳ Waiting for backend LoadBalancer hostname..."
  BACKEND_HOST=$(kubectl get svc server -n $NAMESPACE_DEFAULT -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' || true)
  sleep 5
done

API_URL="http://$BACKEND_HOST:8080"
echo "Backend LB detected: $BACKEND_HOST"
echo "Frontend will use API URL: $API_URL"

# -------------------------------
# Step 4: Docker login & build/push images
# -------------------------------
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_FRONTEND_URI

echo "Building and pushing frontend image..."
TAG=$(date +%s)
docker build --build-arg REACT_APP_API_URL="$API_URL" -t frontend:$TAG ./client
docker tag frontend:$TAG $ECR_FRONTEND_URI:$TAG
docker push $ECR_FRONTEND_URI:$TAG

echo "Building and pushing backend image..."
docker build -t backend ./server
docker tag backend:latest $ECR_BACKEND_URI:latest
docker push $ECR_BACKEND_URI:latest

# -------------------------------
# Step 5: Deploy MongoDB
# -------------------------------
echo "Deploying MongoDB..."
kubectl apply -f k8s/mongo.yaml

# -------------------------------
# Step 6: Deploy frontend
# -------------------------------
echo "Deploying frontend (client)..."
kubectl apply -f k8s/client.yaml
kubectl set image deployment/client client=$ECR_FRONTEND_URI:$TAG -n $NAMESPACE_DEFAULT
kubectl rollout status deployment/client -n $NAMESPACE_DEFAULT

# -------------------------------
# Step 7: Setup monitoring
# -------------------------------
echo "Installing/upgrading Prometheus & Grafana via Helm..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts > /dev/null
helm repo update > /dev/null

helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace $NAMESPACE_MONITOR --create-namespace \
  --set grafana.adminPassword=admin \
  --wait

echo "Applying ServiceMonitor for backend..."
kubectl apply -f k8s/server-monitor.yaml -n $NAMESPACE_MONITOR || true

# -------------------------------
# Step 8: Populate database
# -------------------------------
echo "Creating MongoDB populate job..."
kubectl delete job employees-populate -n $NAMESPACE_DEFAULT --ignore-not-found
kubectl apply -f k8s/populate-job.yaml
kubectl wait --for=condition=complete job/employees-populate -n $NAMESPACE_DEFAULT --timeout=120s

# -------------------------------
# Step 9: Wait for pods to be ready
# -------------------------------
echo "Waiting for backend pod..."
kubectl wait --for=condition=ready pod -l app=server -n $NAMESPACE_DEFAULT --timeout=180s

echo "Waiting for frontend pod..."
kubectl wait --for=condition=ready pod -l app=client -n $NAMESPACE_DEFAULT --timeout=180s

echo "Waiting for monitoring pods..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=grafana -n $NAMESPACE_MONITOR --timeout=300s

# -------------------------------
# Step 10: Done
# -------------------------------
echo "✅ Employee Madness stack is fully up!"
echo "Frontend URL: http://$(kubectl get svc client -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"
echo "Backend URL: http://$(kubectl get svc server -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"
echo "Grafana URL: kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring, http://localhost:3000 "
echo "Prometheus URL: kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring , http://localhost:9090"
