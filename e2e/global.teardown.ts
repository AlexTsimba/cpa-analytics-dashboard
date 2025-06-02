import { FullConfig } from '@playwright/test';

/**
 * Global Teardown for Playwright Tests
 *
 * This file runs once after all tests to:
 * - Clean up any created resources
 * - Generate final reports
 * - Perform cleanup tasks
 */
async function globalTeardown(_config: FullConfig) {
  console.log('🧹 Starting global teardown for Playwright tests...');

  try {
    // Clean up any global state
    delete process.env.PLAYWRIGHT_SETUP_COMPLETE;
    delete process.env.PLAYWRIGHT_APP_TITLE;

    // Perform any necessary cleanup
    // This is where you would add database cleanup, file cleanup, etc.

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here to avoid masking test failures
  }
}

export default globalTeardown;
