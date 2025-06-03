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
  timeout: process.env['CI'] ? 30000 : 60000, // Reduced timeout for CI

  // Expect timeout for assertions
  expect: {
    // Timeout for expect() calls
    timeout: process.env['CI'] ? 5000 : 15000, // Reduced for CI
  },

  // Test execution configuration
  fullyParallel: false, // Disable parallel tests in CI
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0, // Reduced retries
  workers: 1, // Single worker to avoid resource issues

  // Reporter configuration - optimized for CI/CD
  reporter: process.env['CI']
    ? [['list', { printSteps: false }]] // Simple list reporter for CI
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
    actionTimeout: process.env['CI'] ? 10000 : 30000, // Reduced for CI
    navigationTimeout: process.env['CI'] ? 30000 : 60000, // Reduced for CI

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
