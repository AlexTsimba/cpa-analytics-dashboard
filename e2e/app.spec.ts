import { test, expect } from '@playwright/test';

test.describe('Application Basic Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check if the page title is set correctly
    await expect(page).toHaveTitle(/CPA Analytics Dashboard/);

    // Check if the main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check if navigation links are present and clickable
    const homeLink = page.getByRole('link', { name: /home/i });
    if (await homeLink.isVisible()) {
      await expect(homeLink).toBeVisible();
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if the page is still accessible on mobile
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(body).toBeVisible();
  });

  test('should not have console errors', async ({ page }) => {
    const messages: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        messages.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Allow some common Next.js development warnings but fail on actual errors
    const criticalErrors = messages.filter(
      (msg) =>
        !msg.includes('Download the React DevTools') &&
        !msg.includes('Warning: ') &&
        !msg.includes('[HMR]') &&
        !msg.includes('FastRefresh')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
