step 1 : install argocd

kubectl create namespace argocd
kubectl apply --server-side --force-conflicts -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

step 2:Expose ArgoCD UI:

kubectl patch svc argocd-server -n argocd -p "{\"spec\":{\"type\":\"LoadBalancer\"}}"

Check:
kubectl get svc -n argocd

if u cannot access then describe the argocd-server svc : kubectl describe svc argocd-server -n argocd => look for events


//sts is used so your backend pod can get AWS credentials from the Kubernetes ServiceAccount.

You are using IRSA:

backend pod
  uses backend-sa
    backend-sa has IAM role annotation
      role allows S3 access
But the pod does not directly “become” that IAM role. It must ask AWS STS:

AssumeRoleWithWebIdentity
That call exchanges the Kubernetes web identity token for temporary AWS credentials.

So the AWS SDK needs this module:

<artifactId>sts</artifactId>
Without sts, the SDK cannot use the ServiceAccount role. Then it falls back to the EC2 node role, which is exactly what your error showed:

assumed-role/...NodeInstanceRole...
is not authorized to perform s3:PutObject
With sts, it should use:

assumed-role/eksctl-careercrafter-cluster-addon-iamservice-Role...
That role has your S3 policy, so resume upload can work.