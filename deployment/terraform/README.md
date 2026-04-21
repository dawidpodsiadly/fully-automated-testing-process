# Terraform Setup (GCP + GitLab OIDC)

This folder manages infrastructure for this project:
- Artifact Registry repository (`apps`)
- service account for GitLab CI (`gitlab-ci`)
- Workload Identity Pool + OIDC provider for GitLab
- IAM bindings needed for build/deploy

## Files
- `variables.tf` - input variables
- `main.tf` - resources
- `outputs.tf` - values to copy into CI variables

## 1) Initialize
```bash
cd deployment/terraform
terraform init
terraform fmt
terraform validate
```

## 2) Plan / Apply
```bash
terraform plan \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="region=YOUR_REGION" \
  -var="gitlab_project_path=YOUR_GITLAB_NAMESPACE/YOUR_GITLAB_REPO"
```

```bash
terraform apply \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="region=YOUR_REGION" \
  -var="gitlab_project_path=YOUR_GITLAB_NAMESPACE/YOUR_GITLAB_REPO"
```

## 3) If resources already exist (import first)
If you already created resources manually, import them before `apply`.

Example for current project:

```bash
gcloud projects describe project-5c8acae4-cb3c-44bb-8a5 --format='value(projectNumber)'
```

Then run imports (replace values if your names differ):

```bash
terraform import -var="project_id=project-5c8acae4-cb3c-44bb-8a5" google_artifact_registry_repository.apps projects/project-5c8acae4-cb3c-44bb-8a5/locations/europe-central2/repositories/apps
```

```bash
terraform import -var="project_id=project-5c8acae4-cb3c-44bb-8a5" google_service_account.gitlab_ci projects/project-5c8acae4-cb3c-44bb-8a5/serviceAccounts/gitlab-ci@project-5c8acae4-cb3c-44bb-8a5.iam.gserviceaccount.com
```

```bash
terraform import -var="project_id=project-5c8acae4-cb3c-44bb-8a5" google_iam_workload_identity_pool.gitlab projects/704516073438/locations/global/workloadIdentityPools/gitlab-pool
```

```bash
terraform import -var="project_id=project-5c8acae4-cb3c-44bb-8a5" google_iam_workload_identity_pool_provider.gitlab projects/704516073438/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider
```

After imports:
```bash
terraform plan -var="project_id=project-5c8acae4-cb3c-44bb-8a5" -var="region=europe-central2" -var="gitlab_project_path=automated-testing-group1/automated-testing-project"
```

## 4) Outputs for GitLab CI/CD
After successful apply:
```bash
terraform output
```

Key outputs:
- `gcp_wif_provider` -> use as `GCP_WIF_PROVIDER`
- `gcp_service_account_email` -> use as `GCP_SERVICE_ACCOUNT_EMAIL`

## 5) Current CI compatibility
Current `.gitlab-ci.yml` already uses:
- `GCP_WIF_PROVIDER`
- `GCP_SERVICE_ACCOUNT_EMAIL`
- `GUI_LOAD_BALANCER_IP`
- `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_ZONE`, `GCP_CLUSTER_NAME`

`GUI_LOAD_BALANCER_IP` stays outside Terraform in current setup (as requested minimal scope).
