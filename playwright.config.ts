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
  timeout: 30000,

  // Expect timeout for assertions
  expect: {
    // Timeout for expect() calls
    timeout: 10000,
  },

  // Test execution configuration
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : 4,

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
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Project configuration for multiple browsers
  projects: [
    // Global setup project
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup',
    },

    // Global cleanup project
    {
      name: 'cleanup',
      testMatch: /global\.teardown\.ts/,
    },

    // Desktop Chrome - Primary testing browser
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Additional Chrome-specific settings
        channel: 'chrome',
      },
      dependencies: ['setup'],
    },

    // Desktop Firefox - Cross-browser compatibility
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    // Desktop Safari - WebKit engine testing
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // Mobile Chrome - Mobile responsiveness
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },

    // Mobile Safari - iOS compatibility
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },

    // Tablet testing
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
      dependencies: ['setup'],
    },
  ],

  // Web server configuration for Next.js
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
    env: {
      NODE_ENV: 'test',
      // Disable Next.js telemetry in tests
      NEXT_TELEMETRY_DISABLED: '1',
      // Force specific port
      PORT: '3000',
    },
  },

  // Output directory for test artifacts
  outputDir: 'playwright-results',

  // Global setup and teardown
  globalSetup: './e2e/global.setup.ts',
  globalTeardown: './e2e/global.teardown.ts',
});
