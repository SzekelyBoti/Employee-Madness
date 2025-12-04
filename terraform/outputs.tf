output "eks_cluster_name" {
  value = aws_eks_cluster.my_cluster.name
}

output "eks_kubeconfig_command" {
  value = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.my_cluster.name}"
}
