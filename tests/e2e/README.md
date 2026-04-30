# E2E Tests

`17` E2E tests written in `Playwright`.

## Test Architecture

The E2E suite is based on:

- Page Object Model
- Playwright fixtures
- separated logic for services or utilities
- API helpers for test data setup

This structure keeps the tests easier to maintain and separates page interactions from test logic.

## GitLab CI/CD

E2E tests run automatically for merge requests in GitLab.

If you want to run them manually in the pipeline, set the variable:

- `RUN_E2E_TESTS=true`

## Test Data and Cleanup

Test data is generated automatically during execution.

Users created by the E2E suite use the `e2e_` prefix and are removed after the test run by the cleanup service.

## Folder Structure

- `src/tests` - E2E test suites
- `src/models` - page objects and UI models
- `src/models/components` - reusable UI components used by page objects
- `src/fixtures` - Playwright fixtures for injecting page objects into tests
- `src/factories` - generated test data for UI flows
- `src/api` - API clients used for test setup
- `src/services` - shared services used by tests
- `src/types` - TypeScript types and enums
- `src/utils` - utility functions used across the suite

### Artifacts

After the GitLab job, the following artifacts are stored:

- `tests/e2e/playwright-report/` - test report
- `tests/e2e/test-results/` - screenshots after failures

## Local Run

```bash
cd tests/e2e
npm install
npx playwright install chromium
npm run test:all
```

## How to Run a Single Suite

Run a single suite:

```bash
npx playwright test src/tests/login-page
npx playwright test src/tests/user-creator
npx playwright test src/tests/user-table
```

Run tests by name:

```bash
npx playwright test -g "Login with Correct Credentials"
```

## Format / lint

```bash
npm run test:format-and-lint
```
