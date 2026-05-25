Application load balancer

step 1:Download IAM policy

PowerShell:

Invoke-WebRequest -Uri "https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json" -OutFile "iam_policy.json"

step 2:Create policy:

aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json

"Arn": "arn:aws:iam::666607745270:policy/AWSLoadBalancerControllerIAMPolicy"

step 3:Create IRSA service account

eksctl create iamserviceaccount --cluster careercrafter-cluster --region ap-southeast-2 --namespace kube-system --name aws-load-balancer-controller --attach-policy-arn arn:aws:iam::666607745270:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts --approve


step 4:Add repository

helm repo add eks https://aws.github.io/eks-charts
helm repo update

step 5:Get VPC ID

aws eks describe-cluster --region ap-southeast-2 --name careercrafter-cluster --query "cluster.resourcesVpcConfig.vpcId" --output text

Copy the vpc-xxxx result.

Install controller:

helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=careercrafter-cluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller --set region=ap-southeast-2 --set vpcId=vpc id

Verify:

kubectl get pods -n kube-system


The ALB Controller watches Kubernetes Ingress objects and creates AWS resources automatically. The Ingress itself does not create the ALB.