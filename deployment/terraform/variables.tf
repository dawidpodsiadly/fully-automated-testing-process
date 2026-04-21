variable "project_id" {
  description = "GCP project ID."
  type        = string
}

variable "region" {
  description = "Primary GCP region."
  type        = string
  default     = "europe-central2"
}

variable "artifact_registry_repository_id" {
  description = "Artifact Registry repository ID for Docker images."
  type        = string
  default     = "apps"
}

variable "gitlab_service_account_id" {
  description = "Service account ID used by GitLab CI via OIDC."
  type        = string
  default     = "gitlab-ci"
}

variable "wif_pool_id" {
  description = "Workload Identity Pool ID."
  type        = string
  default     = "gitlab-pool"
}

variable "wif_provider_id" {
  description = "Workload Identity Pool Provider ID."
  type        = string
  default     = "gitlab-provider"
}

variable "gitlab_project_path" {
  description = "GitLab project path in format group/project."
  type        = string
  default     = "automated-testing-group1/automated-testing-project"
}
