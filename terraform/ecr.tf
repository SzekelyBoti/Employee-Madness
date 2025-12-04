resource "aws_ecr_repository" "frontend" {
  name = "employee-madness-frontend"
}

resource "aws_ecr_repository" "backend" {
  name = "employee-madness-backend"
}

resource "aws_ecr_repository" "populate" {
  name = "employee-madness-populate"
}

output "ecr_frontend_uri" { value = aws_ecr_repository.frontend.repository_url }
output "ecr_backend_uri"  { value = aws_ecr_repository.backend.repository_url }
output "ecr_populate_uri" { value = aws_ecr_repository.populate.repository_url }
