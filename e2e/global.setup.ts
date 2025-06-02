import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup for Playwright Tests
 * 
 * This file runs once before all tests to:
 * - Verify the application is running
 * - Set up any required global state
 * - Create shared resources
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Playwright tests...');
  
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Verify application is accessible
    console.log(`📡 Checking application availability at ${baseURL}`);
    await page.goto(baseURL, { timeout: 60000 });
    
    // Wait for the application to be ready
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Verify critical application elements
    const title = await page.title();
    console.log(`✅ Application is ready. Page title: "${title}"`);
    
    // Set up any global state or authentication if needed
    // This is where you would add login steps, data seeding, etc.
    
    // Store global state for tests
    process.env.PLAYWRIGHT_SETUP_COMPLETE = 'true';
    process.env.PLAYWRIGHT_APP_TITLE = title;
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
