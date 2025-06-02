import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup for Playwright Tests
 *
 * This file runs once before all tests to:
 * - Verify the application is running
 * - Set up any required global state
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Playwright tests...');

  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';

  // Skip setup in CI since we handle server startup differently
  if (process.env.CI) {
    console.log('ℹ️ Running in CI mode, skipping browser setup');
    return;
  }

  // Launch browser for setup tasks (local development only)
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Verify application is accessible
    console.log(`📡 Checking application availability at ${baseURL}`);
    await page.goto(baseURL, {
      timeout: 60000,
      waitUntil: 'networkidle',
    });

    // Wait for the application to be ready
    await page.waitForSelector('body', { timeout: 30000 });

    // Verify critical application elements
    const title = await page.title();
    console.log(`✅ Application is ready. Page title: "${title}"`);

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
