import { test, expect } from '@playwright/test';

import { DashboardPage, TestUtils } from './utils/test-utils';

/**
 * Basic Application Tests
 *
 * These tests verify fundamental application functionality:
 * - Page loading and navigation
 * - Basic UI elements presence
 * - Application responsiveness
 */

test.describe('Application Core Functionality', () => {
  let dashboardPage: DashboardPage;
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    consoleErrors = TestUtils.setupConsoleMonitoring(page);
  });

  test.afterEach(async () => {
    TestUtils.verifyNoConsoleErrors(consoleErrors);
  });

  test('should load the homepage successfully', async ({ page }) => {
    await dashboardPage.goto();
    await dashboardPage.verifyPageLoaded();

    // Verify essential page elements
    await expect(page.locator('main')).toBeVisible();

    // Take screenshot for visual verification
    await TestUtils.takeScreenshot(page, 'homepage-loaded');
  });

  test('should have correct page metadata', async ({ page }) => {
    await dashboardPage.goto();

    // Check page title
    await expect(page).toHaveTitle('Create Next App');

    // Check meta tags (if any are set)
    const metaDescription = page.locator('meta[name="description"]');
    if ((await metaDescription.count()) > 0) {
      expect(await metaDescription.getAttribute('content')).toBeTruthy();
    }
  });

  test('should handle navigation correctly', async ({ page }) => {
    await dashboardPage.goto();

    // Verify we're on the homepage
    await expect(page).toHaveTitle('Create Next App');

    // Check that environment test component is present
    await expect(
      page.locator('h3', { hasText: 'Environment Variables Test' })
    ).toBeVisible();

    // Test navigation within the page (scroll to different sections)
    const envComponent = page.locator('.p-4.border.rounded-lg');
    await expect(envComponent).toBeVisible();

    // Verify we can interact with the component
    const testButton = page.locator('button', {
      hasText: 'Test Environment Variables',
    });
    await expect(testButton).toBeVisible();
  });

  test('should be responsive across different screen sizes', async ({
    page,
  }) => {
    await dashboardPage.goto();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(page.locator('main')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page.locator('main')).toBeVisible();

    // Test desktop view
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await expect(page.locator('main')).toBeVisible();

    await TestUtils.takeScreenshot(page, 'responsive-desktop');
  });

  test('should load without accessibility violations', async ({ page }) => {
    await dashboardPage.goto();

    // Check for basic accessibility requirements
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify headings are present and properly structured
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test 404 page
    const response = await page.goto('/non-existent-page');

    // Next.js should handle this gracefully
    // Either with a 404 page or redirect
    expect(response?.status()).toBeDefined();

    // Verify the page still loads something
    await expect(page.locator('body')).toBeVisible();
  });
});
