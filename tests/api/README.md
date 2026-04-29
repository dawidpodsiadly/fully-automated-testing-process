# API Tests

`50` API tests written in `Jest + Supertest`.

## Local Run

```bash
cd tests/api
npm install
npm run test:all
```

## Format / lint

```bash
npm run test:format-and-lint
```

## GitLab CI/CD

API tests run automatically for merge requests in GitLab.

If you want to run them manually in the pipeline, set the variable:

- `RUN_API_TESTS=true`

### Artifacts

After the GitLab job, the following artifact is stored:

- `tests/api/test-report.json`
