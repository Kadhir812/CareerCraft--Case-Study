step 1 : install argocd

kubectl create namespace argocd
kubectl apply --server-side --force-conflicts -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

step 2:Expose ArgoCD UI:

kubectl patch svc argocd-server -n argocd -p "{\"spec\":{\"type\":\"LoadBalancer\"}}"

Check:
kubectl get svc -n argocd