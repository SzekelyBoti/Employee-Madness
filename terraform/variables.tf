variable "aws_region" {
  default = "eu-north-1"
}

variable "cluster_name" {
  default = "employee-madness-cluster"
}

variable "node_instance_type" {
  default = "t3.medium"
}

variable "desired_node_count" {
  default = 1
}

variable "min_node_count" {
  default = 1
}

variable "max_node_count" {
  default = 1
}
