#!/usr/bin/env bash
set -euo pipefail

# bash F:/CodeCool/Employee-Madness/start-all.sh

echo "🌟 Starting Employee Madness stack in Kubernetes..."

# Namespaces
NAMESPACE_DEFAULT="default"
NAMESPACE_MONITOR="monitoring"

# -------------------------------
# Deploy MongoDB
# -------------------------------
echo "Deploying MongoDB..."
kubectl apply -f k8s/mongo.yaml

# -------------------------------
# Deploy Backend
# -------------------------------
echo "Deploying backend (server)..."
kubectl apply -f k8s/server.yaml

# -------------------------------
# Deploy Frontend
# -------------------------------
echo "Deploying frontend (client)..."
kubectl apply -f k8s/client.yaml

# -------------------------------
# Deploy Prometheus & Grafana via Helm
# -------------------------------
echo "Installing/upgrading Prometheus & Grafana via Helm..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts > /dev/null
helm repo update > /dev/null

helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace $NAMESPACE_MONITOR --create-namespace \
  --set grafana.adminPassword=admin \
  --wait

# -------------------------------
# Apply ServiceMonitor for backend metrics
# -------------------------------
echo "Applying ServiceMonitor for backend..."
kubectl apply -f k8s/server-monitor.yaml

# -------------------------------
# Deploy populate job
# -------------------------------
echo "Creating MongoDB populate job..."
kubectl delete job employees-populate -n default
kubectl apply -f k8s/populate-job.yaml
kubectl wait --for=condition=complete job/employees-populate -n default --timeout=120s

# -------------------------------
# Wait for backend & frontend pods
# -------------------------------
echo "Waiting for backend pod..."
kubectl wait --for=condition=ready pod -l app=server -n $NAMESPACE_DEFAULT --timeout=120s

echo "Waiting for frontend pod..."
kubectl wait --for=condition=ready pod -l app=client -n $NAMESPACE_DEFAULT --timeout=120s

echo "Waiting for monitoring pods..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=grafana -n monitoring --timeout=120s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=prometheus -n monitoring --timeout=120s

echo "✅ Employee Madness stack is fully up!"
echo "Frontend: http://localhost:80"
echo "Grafana: http://localhost:3000  (admin / admin)"
echo "Prometheus: http://localhost:9090"
echo "Port-forward Grafana if needed:"
echo "kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80"
echo "Port-forward Prometheus if needed:"
echo "kubectl -n monitoring port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090"
