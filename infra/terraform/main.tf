terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_security_group" "ec2" {
  name        = "${local.name_prefix}-ec2-sg"
  description = "Allow web traffic and restricted SSH for CareerCrafter EC2"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH from your IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-ec2-sg"
  })
}

resource "aws_security_group_rule" "backend_direct" {
  count = var.expose_backend_directly ? 1 : 0

  type              = "ingress"
  description       = "Direct backend access for temporary demo/debug"
  security_group_id = aws_security_group.ec2.id
  from_port         = 8084
  to_port           = 8084
  protocol          = "tcp"
  cidr_blocks       = [var.backend_cidr]
}

resource "aws_security_group" "rds" {
  name        = "${local.name_prefix}-rds-sg"
  description = "Allow MySQL only from CareerCrafter EC2"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "MySQL from EC2 security group"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-rds-sg"
  })
}

resource "aws_s3_bucket" "resumes" {
  bucket        = var.s3_bucket_name
  force_destroy = var.s3_force_destroy

  tags = merge(local.common_tags, {
    Name = var.s3_bucket_name
  })
}

resource "aws_s3_bucket_public_access_block" "resumes" {
  bucket = aws_s3_bucket.resumes.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "resumes" {
  bucket = aws_s3_bucket.resumes.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "resumes" {
  bucket = aws_s3_bucket.resumes.id

  versioning_configuration {
    status = var.enable_s3_versioning ? "Enabled" : "Suspended"
  }
}

resource "aws_iam_role" "ec2" {
  name = "${local.name_prefix}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_policy" "s3_resumes" {
  name        = "${local.name_prefix}-s3-resumes-policy"
  description = "Allow EC2 app to read and write resume objects"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.resumes.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.resumes.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "s3_resumes" {
  role       = aws_iam_role.ec2.name
  policy_arn = aws_iam_policy.s3_resumes.arn
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${local.name_prefix}-ec2-profile"
  role = aws_iam_role.ec2.name
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-db-subnet-group"
  })
}

resource "aws_db_instance" "mysql" {
  identifier = "${local.name_prefix}-mysql"

  engine         = "mysql"
  engine_version = var.mysql_engine_version
  instance_class = var.rds_instance_class

  allocated_storage     = var.rds_allocated_storage
  max_allocated_storage = var.rds_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = 3306

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false

  backup_retention_period = var.rds_backup_retention_days
  deletion_protection     = var.rds_deletion_protection
  skip_final_snapshot     = var.rds_skip_final_snapshot

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql"
  })
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.ec2_instance_type
  key_name               = var.ec2_key_name
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  root_block_device {
    volume_size           = var.ec2_root_volume_size
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/user-data.sh.tftpl", {
    aws_region     = var.aws_region
    s3_bucket_name = aws_s3_bucket.resumes.bucket
    db_endpoint    = aws_db_instance.mysql.address
    db_name        = var.db_name
  })

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-app"
  })

  depends_on = [
    aws_db_instance.mysql,
    aws_iam_role_policy_attachment.s3_resumes
  ]
}