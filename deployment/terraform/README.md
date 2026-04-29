# Terraform

This folder contains the Terraform configuration responsible for the supporting infrastructure used by CI/CD and project deployment in Google Cloud.

## What Terraform Does

Terraform prepares the supporting infrastructure for CI/CD and deployment in Google Cloud. It includes:
- `Artifact Registry` repository `apps`
- service account for `GitLab CI`
- `Workload Identity Pool`
- `Workload Identity Provider` for `GitLab OIDC`
- required IAM roles and bindings


## Files
- `main.tf` - main resource definition
- `variables.tf` - input variables
- `outputs.tf` - values to be used in CI/CD

## Initialization
```bash
cd deployment/terraform
terraform init
terraform fmt
terraform validate
```

## Plan
```bash
terraform plan \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="region=YOUR_REGION" \
  -var="gitlab_project_path=YOUR_GITLAB_NAMESPACE/YOUR_GITLAB_REPO"
```

## Apply
```bash
terraform apply \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="region=YOUR_REGION" \
  -var="gitlab_project_path=YOUR_GITLAB_NAMESPACE/YOUR_GITLAB_REPO"
```

If some resources already exist, import them into the Terraform state before running `apply`.
