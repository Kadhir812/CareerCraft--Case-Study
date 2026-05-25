eks cluster and update config

step 1

eksctl create cluster --name careercrafter-cluster --region ap-southeast-2 --nodegroup-name workers --node-type c7i-flex.large --nodes 1

A few minute concepts to add:

eksctl creates a CloudFormation stack behind the scenes. EKS creation is actually CloudFormation orchestrating:
VPC
Subnets
Security groups
IAM roles
EKS control plane
Auto Scaling group
EC2 worker nodes
Control Plane is AWS-managed:
API Server
etcd
Scheduler
Controller Manager

You don't see EC2 instances for these because AWS runs them for you.

--nodes 1

Approx:

2 vCPU
4 GiB RAM

For a learning project with:

frontend pod
backend pod
ingress controller
metrics components
ArgoCD

it works, but if many components are added later (Prometheus/Grafana/Jenkins), you may outgrow it.




step 2: 
Then after cluster creation:

aws eks update-kubeconfig --region ap-southeast-2 --name careercrafter-cluster

Verify:

kubectl get nodes
kubectl get pods -A

Expected:

NAME                         STATUS
ip-xxx.xxx.xxx.xxx           Ready
ip-yyy.yyy.yyy.yyy           Ready
coredns
aws-node
kube-proxy



step 3:
Now we move to the next important step: IRSA (IAM Roles for Service Accounts) so your backend pod can access S3 without storing AWS keys.

First associate OIDC with your cluster:

eksctl utils associate-iam-oidc-provider --region ap-southeast-2 --cluster careercrafter-cluster --approve

verify whether it is associated or not
aws eks describe-cluster --region ap-southeast-2 --name careercrafter-cluster --query "cluster.identity.oidc.issuer"