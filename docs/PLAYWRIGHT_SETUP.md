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
- Common dashboard interactions

### EnvironmentTestPage
- Environment test page interactions
- Button click handling
- Component verification

### TestUtils
- Screenshot utilities
- Console monitoring
- Network request waiting
- Common test helpers

## Best Practices

### Test Writing Guidelines

1. **Use Page Objects**: Encapsulate page interactions in page object classes
2. **Wait Strategies**: Use proper waiting strategies for dynamic content
3. **Assertions**: Use meaningful assertions with descriptive error messages
4. **Screenshots**: Take screenshots at key points for visual verification
5. **Console Monitoring**: Monitor for JavaScript errors during tests

### Performance Considerations

1. **Parallel Execution**: Tests run in parallel for faster completion
2. **Network Idle**: Wait for network idle state before assertions
3. **Selective Browser Testing**: Use appropriate browsers for each test type
4. **Resource Cleanup**: Proper cleanup in teardown methods

## CI/CD Integration

### GitHub Actions Configuration

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload test results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

### Environment Variables

- `CI`: Enables CI-specific configuration
- `PLAYWRIGHT_BASE_URL`: Override default base URL
- `PLAYWRIGHT_HEADLESS`: Force headless mode
- `PLAYWRIGHT_BROWSERS_PATH`: Custom browser installation path

## Debugging Tests

### Local Debugging

```bash
# Run with browser visible
npm run test:e2e:headed

# Debug mode with step-through
npm run test:e2e:debug

# Run specific test with debug
npx playwright test --debug app.spec.ts
```

### Debugging Options

1. **Browser DevTools**: Access via `--headed` mode
2. **Playwright Inspector**: Step through tests with `--debug`
3. **Screenshots**: Automatic screenshots on failure
4. **Videos**: Video recording for failed tests
5. **Traces**: Detailed execution traces on retry

## Common Patterns

### Waiting for Elements

```typescript
// Wait for element to be visible
await expect(locator).toBeVisible();

// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for specific request
await TestUtils.waitForNetworkRequest(page, '/api/data');
```

### Handling Dynamic Content

```typescript
// Wait for loading states
await page.waitForFunction(() => 
  !document.querySelector('[data-testid="loading"]')
);

// Wait for text content
await expect(locator).toContainText('Expected text');
```

### Cross-Browser Testing

```typescript
test('should work across browsers', async ({ page, browserName }) => {
  // Browser-specific logic
  if (browserName === 'webkit') {
    // Safari-specific handling
  }
  
  await TestUtils.takeScreenshot(page, `test-${browserName}`);
});
```

## Reporting

### Local Reports

- **HTML Report**: Interactive report with test details
- **Screenshots**: Full-page screenshots on failure
- **Videos**: Test execution videos for failed tests
- **Traces**: Detailed execution traces

### CI Reports

- **JUnit XML**: For test result integration
- **Blob Reports**: Mergeable reports for parallel execution
- **Artifacts**: Screenshots, videos, and traces uploaded

## Troubleshooting

### Common Issues

1. **Timeouts**: Increase timeout values for slow operations
2. **Flaky Tests**: Add proper wait conditions
3. **Browser Issues**: Update browsers with `npm run test:e2e:install`
4. **Port Conflicts**: Ensure development server is available

### Debug Commands

```bash
# Check Playwright version
npx playwright --version

# List available browsers
npx playwright install --dry-run

# Test configuration
npx playwright test --list

# Show test report
npx playwright show-report
```

## Future Enhancements

### Planned Features

1. **Visual Regression Testing**: Screenshot comparison tests
2. **API Testing**: Integration with Playwright's API testing features
3. **Performance Testing**: Core Web Vitals measurement
4. **Accessibility Testing**: Automated a11y testing integration
5. **Component Testing**: Playwright component testing setup

### Advanced Configurations

1. **Docker Integration**: Containerized test execution
2. **Parallel Sharding**: Multi-machine test distribution
3. **Custom Fixtures**: Reusable test setup patterns
4. **Mock APIs**: Network request mocking capabilities
