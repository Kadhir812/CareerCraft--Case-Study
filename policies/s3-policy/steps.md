step 1:
aws iam create-policy --policy-name CareerCrafterS3Policy --policy-document file://s3-policy.json

arn:
arn:aws:iam::666607745270:policy/CareerCrafterS3Policy

step 2:Create Kubernetes Service Account

eksctl create iamserviceaccount --cluster=careercrafter-cluster --region=ap-southeast-2 --namespace=default --name=backend-sa --attach-policy-arn=arn:aws:iam::666607745270:policy/CareerCrafterS3Policy --override-existing-serviceaccounts --approve

step 3:Then verify:

kubectl get sa


Then:

kubectl describe sa backend-sa

Look for:

Annotations:
eks.amazonaws.com/role-arn:
arn:aws:iam::666607745270:role/...

Minute concept:

Spring Boot backend pod
        ↓
backend-sa
        ↓
IAM Role (IRSA)
        ↓
CareerCrafterS3Policy
        ↓
S3 bucket