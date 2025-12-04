resource "aws_eks_node_group" "node_group" {
  cluster_name    = aws_eks_cluster.my_cluster.name
  node_group_name = "${var.cluster_name}-nodes"
  node_role_arn   = aws_iam_role.node_role.arn

  subnet_ids = [
    aws_subnet.eks_subnet_public_a.id,
    aws_subnet.eks_subnet_public_b.id
  ]

  instance_types = [var.node_instance_type]
  ami_type       = "AL2_x86_64"

  scaling_config {
    desired_size = var.desired_node_count
    max_size     = var.max_node_count
    min_size     = var.min_node_count
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_policy_attach,
    aws_iam_role_policy_attachment.cni_policy_attach,
    aws_iam_role_policy_attachment.ssm_policy_attach,
    aws_iam_role_policy_attachment.cloudwatch_policy_attach
  ]
}

