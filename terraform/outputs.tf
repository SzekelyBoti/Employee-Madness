output "eks_cluster_name" {
  value = aws_eks_cluster.my_cluster.name
}

output "eks_kubeconfig_command" {
  value = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.my_cluster.name}"
}

output "ecr_frontend_uri" {
  value = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_uri" {
  value = aws_ecr_repository.backend.repository_url
}

output "ecr_populate_uri" {
  value = aws_ecr_repository.populate.repository_url
}