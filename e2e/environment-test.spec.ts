import { test, expect } from '@playwright/test';

import { EnvironmentTestPage, TestUtils } from './utils/test-utils';

/**
 * Environment Variables Test Component E2E Tests
 *
 * These tests verify the environment variables test component functionality
 * that is embedded in the homepage:
 * - Component rendering and styling
 * - Button interactions
 * - Console output verification
 */

test.describe('Environment Variables Test Component', () => {
  let envTestPage: EnvironmentTestPage;
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    envTestPage = new EnvironmentTestPage(page);
    consoleErrors = TestUtils.setupConsoleMonitoring(page);
  });

  test.afterEach(async () => {
    TestUtils.verifyNoConsoleErrors(consoleErrors);
  });

  test('should render environment test component correctly', async ({
    page,
  }) => {
    await envTestPage.goto();
    await envTestPage.verifyPageComponents();

    // Verify component is embedded in the main page
    await expect(page).toHaveTitle('Create Next App');
    await expect(page.locator('main')).toBeVisible();
    await expect(envTestPage.title).toHaveText('Environment Variables Test');
    await expect(envTestPage.testButton).toBeEnabled();

    // Verify the component is part of the homepage layout
    const nextLogo = page.locator('img[alt="Next.js logo"]');
    await expect(nextLogo).toBeVisible();

    await TestUtils.takeScreenshot(page, 'environment-component-homepage');
  });

  test('should handle test button click', async ({ page }) => {
    await envTestPage.goto();

    // Set up console log monitoring for env test output
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });

    // Click the test button
    await envTestPage.clickTestButton();

    // Verify console output was generated
    // Note: The actual env test function logs to console
    expect(consoleLogs.length).toBeGreaterThan(0);

    // Check for expected console messages
    const envTestMessage = consoleLogs.find((log) =>
      log.includes('Testing environment variables')
    );
    expect(envTestMessage).toBeTruthy();
  });

  test('should display proper styling and layout', async () => {
    await envTestPage.goto();

    // Verify container styling
    const container = envTestPage.container;
    await expect(container).toHaveClass(/p-4/);
    await expect(container).toHaveClass(/border/);
    await expect(container).toHaveClass(/rounded-lg/);

    // Verify button styling
    const button = envTestPage.testButton;
    await expect(button).toHaveClass(/px-4/);
    await expect(button).toHaveClass(/py-2/);
    await expect(button).toHaveClass(/bg-blue-500/);

    // Verify title styling
    const title = envTestPage.title;
    await expect(title).toHaveClass(/text-lg/);
    await expect(title).toHaveClass(/font-semibold/);
  });

  test('should be accessible', async ({ page }) => {
    await envTestPage.goto();

    // Verify button has proper accessibility attributes
    const button = envTestPage.testButton;

    // Check that button is focusable
    await button.focus();
    await expect(button).toBeFocused();

    // Verify keyboard navigation works
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Should trigger the same action as clicking
    // Note: We need to handle the alert dialog
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  });

  test('should work within the homepage context', async ({
    page,
    browserName,
  }) => {
    await envTestPage.goto();

    // Verify component works within the full homepage
    await expect(page).toHaveTitle('Create Next App');
    await envTestPage.verifyPageComponents();

    // Test that the component coexists with other homepage elements
    const deployButton = page.locator('a[href*="vercel.com"]').first();
    await expect(deployButton).toBeVisible();

    // Test component functionality - use simple button click without dialog handling
    // (the component dialog handler will take care of it)
    await envTestPage.testButton.click();

    await TestUtils.takeScreenshot(
      page,
      `environment-component-${browserName}`
    );
  });

  test('should handle responsive layout within homepage', async ({ page }) => {
    await envTestPage.goto();

    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1440, height: 900, name: 'desktop' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.waitForTimeout(300);

      // Verify component is still visible and functional in responsive layout
      await expect(envTestPage.container).toBeVisible();
      await expect(envTestPage.title).toBeVisible();
      await expect(envTestPage.testButton).toBeVisible();

      // Verify the overall page layout is responsive
      await expect(page.locator('main')).toBeVisible();

      await TestUtils.takeScreenshot(
        page,
        `environment-component-responsive-${viewport.name}`
      );
    }
  });
});
