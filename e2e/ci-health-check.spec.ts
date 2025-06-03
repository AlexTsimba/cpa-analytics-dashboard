import { test, expect } from '@playwright/test';

test.describe('CI Health Check', () => {
  test('should load the application', async ({ page }) => {
    // Set shorter timeout for CI
    test.setTimeout(10000);

    // Try to navigate to homepage
    const response = await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 5000,
    });

    // Basic check that page loaded
    expect(response?.status()).toBeLessThan(400);

    // Check that page has content
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('should have no critical errors', async ({ page }) => {
    test.setTimeout(10000);

    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 5000 });

    // Only fail on critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('ResizeObserver') &&
        !error.includes('Non-Error') &&
        !error.includes('ChunkLoadError')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
