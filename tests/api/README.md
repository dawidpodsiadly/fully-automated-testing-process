# API Tests

`50` API tests written in `Jest + Supertest`.

## Scope

The API test suite covers:

- authentication
- user CRUD operations
- input validation
- role-based access
- negative scenarios

## GitLab CI/CD

API tests run automatically for merge requests in GitLab.

If you want to run them manually in the pipeline, set the variable:

- `RUN_API_TESTS=true`

## Test Data and Cleanup

Test data is generated automatically during execution.

Users created by the API tests use the `api_` prefix and are removed after the test run by the cleanup service.

## Folder Structure

- `src/tests` - API test cases
- `src/factories` - request body factories and test data builders
- `src/services` - helper services used by tests
- `src/utils` - shared utility functions

### Artifacts

After the GitLab job, the following artifact is stored:

- `tests/api/test-report.json`

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
