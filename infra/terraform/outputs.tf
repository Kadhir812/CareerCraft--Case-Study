output "ec2_public_ip" {
  description = "Public IP of the EC2 instance."
  value       = aws_instance.app.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance."
  value       = aws_instance.app.public_dns
}

output "app_url" {
  description = "HTTP URL for the deployed app."
  value       = "http://${aws_instance.app.public_ip}"
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint."
  value       = aws_db_instance.mysql.endpoint
}

output "backend_db_url" {
  description = "Spring Boot JDBC URL for the backend."
  value       = "jdbc:mysql://${aws_db_instance.mysql.address}:3306/${var.db_name}"
}

output "s3_bucket_name" {
  description = "S3 bucket used for resume uploads."
  value       = aws_s3_bucket.resumes.bucket
}

output "ec2_security_group_id" {
  description = "EC2 security group ID."
  value       = aws_security_group.ec2.id
}

output "rds_security_group_id" {
  description = "RDS security group ID."
  value       = aws_security_group.rds.id
}