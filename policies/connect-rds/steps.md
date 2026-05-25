step 1 :
get cluster SG and group name and id
aws ec2 describe-instances --region ap-southeast-2 --query "Reservations[*].Instances[*].SecurityGroups[*].[GroupId,GroupName]"


step 2:check vpc of rds and eks cluster
aws eks describe-cluster --region ap-southeast-2 --name careercrafter-cluster --query "cluster.resourcesVpcConfig.vpcId"

aws rds describe-db-instances --region ap-southeast-2 --query "DBInstances[*].[DBInstanceIdentifier,DBSubnetGroup.VpcId]" --output table


so create new rds instance inside EKS VPC
step 3:
verify subnets
aws ec2 describe-subnets --region ap-southeast-2 --filters Name=vpc-id,Values=vpc-0e6f6d849854da354 --query "Subnets[*].[SubnetId,AvailabilityZone]" --output table ->3 Availability Zones × 2 subnet types = 6 subnets(based on availability zone)

step 4:Create the DB subnet group:

aws rds create-db-subnet-group --region ap-southeast-2 --db-subnet-group-name careercrafter-db-subnet --db-subnet-group-description "RDS subnet for EKS" --subnet-ids (subnet-06b4b4f9a82b5deef subnet-030148fd4c64766d8)replace
(subnet id should be from different A-Z zones)RDS requires at least two subnets in different AZs.

step 5:create RDS SG:
aws ec2 create-security-group --region ap-southeast-2 --group-name careercrafter-rds-sg --description "RDS access from EKS" --vpc-id vpc-0e6f6d849854da354(eks vpc)
this returns rds SG group id("GroupId": "sg-0814abf3413d3ece7") copy that 

step 6:allow your EKS worker/cluster security group to connect to MySQL:
aws ec2 authorize-security-group-ingress --region ap-southeast-2 --group-id sg-0814abf3413d3ece7 --protocol tcp --port 3306 --source-group sg-02293856b7d0f91dc

step 7:create RDS instance
aws rds create-db-instance --region ap-southeast-2 --db-instance-identifier careercrafter-db --db-instance-class db.t3.micro --engine mysql --master-username admin --master-user-password YourStrongPassword123 --allocated-storage 20 --storage-type gp2 --vpc-security-group-ids sg-0814abf3413d3ece7 --db-subnet-group-name careercrafter-db-subnet --backup-retention-period 0 --no-multi-az --publicly-accessible

aws rds describe-db-instances --region ap-southeast-2 --query "DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus]" --output table    => to check whether db is created or not,normally it takes time to create db.when it is available run next command

step 8:get the rds endpoint 
aws rds describe-db-instances --region ap-southeast-2 --query "DBInstances[*].Endpoint.Address" --output text
careercrafter-db.cba86w080orf.ap-southeast-2.rds.amazonaws.com

step 8:change configMaps and application.properties or .envs

step 9: create database inside rds instance by creating temporary pod which acts as client and send sql queries to rds instance

kubectl run mysql-client --rm -it --image=mysql:8 -- bash
mysql -h rds endpoint -u admin -p
create database name

step 2:
RDS
→ Databases
→ Select your database
→ Connectivity & security
→ Security Groups
→ Click the security group
→ Edit inbound rules