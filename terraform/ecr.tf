resource "aws_ecr_repository" "frontend" {
  name = "employee-madness-frontend"
}

resource "aws_ecr_repository" "backend" {
  name = "employee-madness-backend"
}

resource "aws_ecr_repository" "populate" {
  name = "employee-madness-populate"
}
