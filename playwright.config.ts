import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for CPA Analytics Dashboard
 *
 * This configuration follows Playwright best practices for Next.js applications
 * and integrates with our existing CI/CD pipeline.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory configuration
  testDir: './e2e',

  // Global timeout for test execution
  timeout: 60000,

  // Expect timeout for assertions
  expect: {
    // Timeout for expect() calls
    timeout: 15000,
  },

  // Test execution configuration
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 3 : 1,
  workers: process.env['CI'] ? 1 : 2,

  // Reporter configuration - optimized for CI/CD
  reporter: process.env['CI']
    ? [
        ['junit', { outputFile: 'playwright-report/junit-results.xml' }],
        ['blob'],
      ]
    : [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list', { printSteps: true }],
      ],

  // Global test configuration
  use: {
    // Base URL for navigation
    baseURL: process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000',

    // Browser context options
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Network and timing
    actionTimeout: 30000,
    navigationTimeout: 60000,

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Project configuration optimized for CI
  projects: process.env['CI']
    ? [
        // CI: Only run essential tests in Chromium
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        // Local: Full browser matrix
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
      ],

  // Web server configuration for Next.js (only for local development)
  ...(process.env['CI']
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          url: 'http://localhost:3000',
          reuseExistingServer: true,
          timeout: 120000,
          env: {
            NODE_ENV: 'test',
            NEXT_TELEMETRY_DISABLED: '1',
            PORT: '3000',
          },
        },
      }),

  // Output directory for test artifacts
  outputDir: 'playwright-results',
});
