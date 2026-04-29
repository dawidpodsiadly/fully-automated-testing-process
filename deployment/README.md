# Deployment

This folder contains the shared deployment and infrastructure configuration for the entire project, including monitoring, the database and the test environment.

## What is here
- `charts/monitoring` - `Grafana + Prometheus` monitoring
- `charts/mongodb` - chart for MongoDB
- `helmfile/test-installation.yaml` - definition of the `test-installation` environment
- `terraform` - supporting infrastructure for GCP and GitLab OIDC

## Test Environment Deployment
```bash
helm dependency build deployment/charts/monitoring
CHART_VERSION=0.1.123 IMAGE_TAG=123 helmfile -f deployment/helmfile/test-installation.yaml sync
```

## Monitoring

After deployment, monitoring can be accessed by forwarding ports so everything is available in the browser:

Grafana:
```bash
kubectl port-forward -n test-installation svc/monitoring-grafana 3000:80
```

Prometheus:
```bash
kubectl port-forward -n test-installation svc/monitoring-kube-prometheus-prometheus 9090:9090
```