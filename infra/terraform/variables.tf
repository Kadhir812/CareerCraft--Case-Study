variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used in tags and resource names."
  type        = string
  default     = "careercrafter"
}

variable "environment" {
  description = "Environment name used in tags and resource names."
  type        = string
  default     = "demo"
}

variable "ec2_instance_type" {
  description = "EC2 instance type. t3.small is a good short demo default; t3.medium is safer."
  type        = string
  default     = "t3.small"
}

variable "ec2_key_name" {
  description = "Existing AWS EC2 key pair name for SSH access."
  type        = string
}

variable "ec2_root_volume_size" {
  description = "EC2 root EBS volume size in GB."
  type        = number
  default     = 30
}

variable "ssh_cidr" {
  description = "CIDR allowed to SSH into EC2. Use your public IP with /32."
  type        = string
}

variable "expose_backend_directly" {
  description = "Temporarily expose backend port 8084. Prefer false when Nginx proxies API traffic."
  type        = bool
  default     = false
}

variable "backend_cidr" {
  description = "CIDR allowed to access backend port 8084 when expose_backend_directly is true."
  type        = string
  default     = "0.0.0.0/0"
}

variable "rds_instance_class" {
  description = "RDS instance class. db.t3.micro is enough for a short demo."
  type        = string
  default     = "db.t3.micro"
}

variable "mysql_engine_version" {
  description = "MySQL engine version for RDS. Leave null to let AWS choose the current default."
  type        = string
  default     = null
}

variable "rds_allocated_storage" {
  description = "Initial RDS storage in GB."
  type        = number
  default     = 20
}

variable "rds_max_allocated_storage" {
  description = "Maximum autoscaled RDS storage in GB."
  type        = number
  default     = 50
}

variable "rds_backup_retention_days" {
  description = "RDS automated backup retention in days. Use 0 for lowest-cost demo."
  type        = number
  default     = 0
}

variable "rds_deletion_protection" {
  description = "Protect RDS from accidental deletion. For demos this is usually false."
  type        = bool
  default     = false
}

variable "rds_skip_final_snapshot" {
  description = "Skip final snapshot when destroying RDS. For demos this is usually true."
  type        = bool
  default     = true
}

variable "db_name" {
  description = "Application database name."
  type        = string
  default     = "career"
}

variable "db_username" {
  description = "RDS master username."
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "RDS master password. Put this in terraform.tfvars, not in git."
  type        = string
  sensitive   = true
}

variable "s3_bucket_name" {
  description = "Globally unique S3 bucket name for resume uploads."
  type        = string
}

variable "s3_force_destroy" {
  description = "Allow Terraform to delete bucket contents during destroy. Useful for demos."
  type        = bool
  default     = true
}

variable "enable_s3_versioning" {
  description = "Enable S3 versioning for resume objects."
  type        = bool
  default     = false
}