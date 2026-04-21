output "gcp_service_account_email" {
  description = "Value for GitLab CI variable GCP_SERVICE_ACCOUNT_EMAIL."
  value       = google_service_account.gitlab_ci.email
}

output "gcp_wif_provider" {
  description = "Value for GitLab CI variable GCP_WIF_PROVIDER."
  value       = google_iam_workload_identity_pool_provider.gitlab.name
}

output "artifact_registry_repository_url" {
  description = "Docker repository base URL."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.apps.repository_id}"
}
