# Playwright E2E Testing Setup

This document describes the Playwright end-to-end testing configuration for the CPA Analytics Dashboard.

## Overview

Playwright is configured to provide comprehensive E2E testing across multiple browsers and devices. The setup includes:

- **Multi-browser testing**: Chrome, Firefox, Safari (WebKit)
- **Mobile and tablet testing**: iOS Safari, Android Chrome, iPad Pro
- **Global setup/teardown**: Application readiness checks and cleanup
- **Comprehensive reporting**: HTML reports locally, JUnit + Blob for CI
- **Development integration**: Automatic dev server startup

## Configuration

### playwright.config.ts

The main configuration file includes:

- **Test directory**: `./e2e` 
- **Timeout settings**: 30s for tests, 10s for assertions
- **Parallel execution**: Enabled for faster test runs
- **Retry strategy**: 2 retries on CI, 0 locally
- **Reporter setup**: Environment-specific reporting
- **Browser projects**: Desktop and mobile configurations
- **Dev server integration**: Automatic Next.js startup

### Global Setup/Teardown

- **global.setup.ts**: Verifies application availability and readiness
- **global.teardown.ts**: Cleanup tasks after test completion

## Test Structure

```
e2e/
├── global.setup.ts          # Global setup tasks
├── global.teardown.ts       # Global cleanup tasks
├── app.spec.ts             # Core application tests
├── environment-test.spec.ts # Environment page tests
├── utils/
│   └── test-utils.ts       # Page objects and utilities
└── fixtures/               # Test data and fixtures
```

## Available Scripts

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (visual test runner)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# View test reports
npm run test:e2e:report

# Install/update browsers
npm run test:e2e:install
```

### Test Options

```bash
# Run specific test file
npx playwright test app.spec.ts

# Run specific browser
npx playwright test --project=chromium

# Run with specific tag
npx playwright test --grep="@smoke"

# Run in specific environment
PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test
```

## Test Categories

### Core Application Tests (app.spec.ts)

- Homepage loading and navigation
- Page metadata verification
- Responsive design testing
- Accessibility checks
- Error handling (404 pages)

### Environment Test Page (environment-test.spec.ts)

- Component rendering verification
- Button interaction testing
- Console output validation
- Cross-browser compatibility
- Mobile responsiveness

## Page Object Model

The test suite uses Page Object Model pattern for maintainability:

### DashboardPage
- Navigation methods
- Loading state verification
- Content validation

### EnvironmentTestPage
- Component interaction methods
- Button click handling
- Alert dialog management

### TestUtils
- Screenshot utilities
- Console monitoring
- Network request waiting
- Error verification

## CI/CD Integration

### GitHub Actions

The Playwright configuration is optimized for CI environments:

```yaml
- name: Run Playwright tests
  run: npm run test:e2e
  env:
    CI: true
```

### Reporting

- **Local Development**: HTML reports with interactive features
- **CI Environment**: JUnit XML + Blob reports for merging

## Environment Variables

```bash
# Application URL for testing
PLAYWRIGHT_BASE_URL=http://localhost:3000

# Browser installation path
PLAYWRIGHT_BROWSERS_PATH=/path/to/browsers

# Skip browser downloads
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
```

## Best Practices

### Test Organization

1. **Group related tests** using `test.describe()`
2. **Use meaningful test names** that describe the expected behavior
3. **Setup and cleanup** with `beforeEach` and `afterEach`
4. **Page object pattern** for reusable components

### Assertions

```typescript
// Good: Specific and meaningful assertions
await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();

// Better: Use page object methods
await dashboardPage.verifyPageLoaded();
```

### Waiting and Timing

```typescript
// Good: Wait for specific conditions
await page.waitForLoadState('networkidle');

// Better: Wait for specific elements
await page.locator('[data-testid="content"]').waitFor();
```

### Screenshots and Debugging

```typescript
// Take screenshots for debugging
await TestUtils.takeScreenshot(page, 'debug-screenshot');

// Monitor console for errors
const errors = TestUtils.setupConsoleMonitoring(page);
```

## Troubleshooting

### Common Issues

1. **Timeout errors**: Increase timeouts or wait for specific conditions
2. **Element not found**: Verify selectors and wait for elements
3. **Browser installation**: Run `npm run test:e2e:install`
4. **Port conflicts**: Change port in playwright.config.ts

### Debugging

```bash
# Run in debug mode
npm run test:e2e:debug

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode to see browser
npm run test:e2e:headed
```

## Performance Considerations

- **Parallel execution**: Tests run in parallel by default
- **Browser reuse**: Browsers are reused across tests
- **Selective testing**: Use `--grep` to run specific tests
- **CI optimization**: Single worker on CI to avoid resource issues

## Security Considerations

- **No sensitive data** in test files
- **Environment variables** for configuration
- **Secure test data** in fixtures directory
- **Clean up** after tests to avoid data leaks

## Future Enhancements

- **Visual regression testing** with screenshots
- **API testing** integration
- **Performance testing** with web vitals
- **Accessibility testing** with axe-core
- **Database seeding** for complex scenarios
