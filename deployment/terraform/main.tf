terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

data "google_project" "current" {
  project_id = var.project_id
}

resource "google_artifact_registry_repository" "apps" {
  location      = var.region
  repository_id = var.artifact_registry_repository_id
  description   = "Docker images for app"
  format        = "DOCKER"
}

resource "google_service_account" "gitlab_ci" {
  account_id   = var.gitlab_service_account_id
  display_name = "GitLab CI"
}

resource "google_project_iam_member" "gitlab_ci_artifact_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.gitlab_ci.email}"
}

resource "google_project_iam_member" "gitlab_ci_container_admin" {
  project = var.project_id
  role    = "roles/container.admin"
  member  = "serviceAccount:${google_service_account.gitlab_ci.email}"
}

resource "google_iam_workload_identity_pool" "gitlab" {
  workload_identity_pool_id = var.wif_pool_id
  display_name              = "GitLab Pool"
}

resource "google_iam_workload_identity_pool_provider" "gitlab" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.gitlab.workload_identity_pool_id
  workload_identity_pool_provider_id = var.wif_provider_id
  display_name                       = "GitLab OIDC"
  attribute_mapping = {
    "google.subject"         = "assertion.sub"
    "attribute.project_path" = "assertion.project_path"
  }
  attribute_condition = "assertion.project_path=='${var.gitlab_project_path}'"
  oidc {
    issuer_uri        = "https://gitlab.com"
    allowed_audiences = ["https://gitlab.com"]
  }
}

resource "google_service_account_iam_member" "gitlab_wif_user" {
  service_account_id = google_service_account.gitlab_ci.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/projects/${data.google_project.current.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.gitlab.workload_identity_pool_id}/attribute.project_path/${var.gitlab_project_path}"
}
