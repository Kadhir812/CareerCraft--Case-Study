1.first create repo in ecr 

aws ecr create-repository --repository-name careercrafter-frontend --region ap-southeast-2
aws ecr create-repository --repository-name careercrafter-backend -- region ap-southeast-2

2.Step - 1 : Create GitHub OIDC provider (one-time setup)

aws iam create-open-id-connect-provider `
--url https://token.actions.githubusercontent.com `
--client-id-list sts.amazonaws.com `
--thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

3. step - 2 : check 

aws iam list-open-id-connect-providers 



4.Step 3 — Create role

aws iam create-role --role-name GitHubECRRole --assume-role-policy-document file://github-trust(ECR).json




5.Step 4 — Attach permissions

For your pipeline you are not only pushing to ECR. You will later create/update EKS resources too. AmazonEC2ContainerRegistryFullAccess alone is insufficient.

Start with:

aws iam attach-role-policy --role-name GitHubECRRole --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

and also:

aws iam attach-role-policy `
--role-name GitHubECRRole `
--policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy


6.get arn which is used in pipeline

aws iam get-role --role-name GitHubECRRole

role-to-assume: arn:aws:iam::123456789012:role/GitHubECRRole


