AWS VPC
│
├── Public Subnet
│      │
│      ├── ALB
│      │
│      └── Worker Node EC2
│              │
│              ├── default namespace
│              │      ├── frontend pod
│              │      └── backend pod
│              │
│              └── argocd namespace
│                     ├── argocd-server
│                     ├── argocd-repo-server
│                     ├── argocd-application-controller
│                     ├── argocd-dex
│                     ├── argocd-redis
│                     └── notifications-controller
│
├── Private Subnet
│      │
│      └── RDS MySQL
│
└── S3
       │
       └── accessed through IRSA