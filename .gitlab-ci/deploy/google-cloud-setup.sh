apk update && apk add --no-cache curl bash python3 py3-pip

if ! command -v gcloud >/dev/null 2>&1; then
  curl -sSL https://sdk.cloud.google.com | bash
  . /root/google-cloud-sdk/path.bash.inc
  export PATH=$PATH:/root/google-cloud-sdk/bin
fi

echo "Logging in to Google Cloud using GitLab OIDC"
printf '%s' "$GITLAB_OIDC_TOKEN" > "${CI_PROJECT_DIR}/gitlab-oidc-token"
gcloud iam workload-identity-pools create-cred-config "$GCP_WIF_PROVIDER" \
  --service-account="$GCP_SERVICE_ACCOUNT_EMAIL" \
  --credential-source-file="${CI_PROJECT_DIR}/gitlab-oidc-token" \
  --output-file="${CI_PROJECT_DIR}/gcp-wif-credentials.json"
gcloud auth login --cred-file="${CI_PROJECT_DIR}/gcp-wif-credentials.json"

gcloud config set project "$GCP_PROJECT_ID"
gcloud auth configure-docker "${GCP_REGION}-docker.pkg.dev" --quiet

gcloud components install gke-gcloud-auth-plugin --quiet
echo "Checking if gke-gcloud-auth-plugin is installed..."
which gke-gcloud-auth-plugin

curl -LO "https://dl.k8s.io/release/v1.26.0/bin/linux/amd64/kubectl"
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl
