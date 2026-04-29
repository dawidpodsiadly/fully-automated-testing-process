# E2E Tests

`17` E2E tests written in `Playwright`.

## Local Run

```bash
cd tests/e2e
npm install
npx playwright install chromium
npm run test:all
```

## Format / lint

```bash
npm run test:format-and-lint
```

## GitLab CI/CD

E2E tests run automatically for merge requests in GitLab.

If you want to run them manually in the pipeline, set the variable:

- `RUN_E2E_TESTS=true`

### Artifacts

After the GitLab job, the following artifacts are stored:

- `tests/e2e/playwright-report/` - test report
- `tests/e2e/test-results/` - screenshots after failures
