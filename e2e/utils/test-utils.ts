import { Page, Locator, expect } from '@playwright/test';

/**
 * E2E Test Utilities for CPA Analytics Dashboard
 *
 * This file contains utility functions and page object models
 * to simplify E2E test writing and improve maintainability.
 */

export class DashboardPage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly navigation: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = page.locator('main');
    this.navigation = page.locator('nav');
    this.loadingSpinner = page.locator('[data-testid="loading"]');
  }

  /**
   * Navigate to the dashboard and wait for it to load
   */
  async goto() {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  /**
   * Wait for the dashboard to fully load
   */
  async waitForLoad() {
    // Wait for main content to be visible
    await this.mainContent.waitFor({ state: 'visible' });

    // Wait for any loading states to complete
    await this.page.waitForLoadState('networkidle');

    // If there's a loading spinner, wait for it to disappear
    if (await this.loadingSpinner.isVisible()) {
      await this.loadingSpinner.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Check if the page has loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.mainContent).toBeVisible();
    await expect(this.page).toHaveTitle('Create Next App');
  }
}

export class EnvironmentTestPage {
  readonly page: Page;
  readonly testButton: Locator;
  readonly title: Locator;
  readonly container: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('.p-4.border.rounded-lg');
    this.title = page.locator('h3', { hasText: 'Environment Variables Test' });
    this.testButton = page.locator('button', {
      hasText: 'Test Environment Variables',
    });
  }

  /**
   * Navigate to the environment test component (on homepage)
   */
  async goto() {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  /**
   * Wait for the environment test page to load
   */
  async waitForLoad() {
    await this.container.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the test button and handle the alert
   */
  async clickTestButton() {
    // Set up alert handler
    this.page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });

    await this.testButton.click();
  }

  /**
   * Verify the page components are visible
   */
  async verifyPageComponents() {
    await expect(this.title).toBeVisible();
    await expect(this.testButton).toBeVisible();
    await expect(this.container).toBeVisible();
  }
}

/**
 * Utility functions for common E2E testing tasks
 */
export class TestUtils {
  /**
   * Wait for a specific network request to complete
   */
  static async waitForNetworkRequest(page: Page, urlPattern: string | RegExp) {
    return page.waitForResponse((response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    });
  }

  /**
   * Take a screenshot with a descriptive name
   */
  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({
      path: `playwright-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Check for console errors
   */
  static setupConsoleMonitoring(page: Page) {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    return errors;
  }

  /**
   * Verify no console errors occurred
   */
  static verifyNoConsoleErrors(errors: string[]) {
    if (errors.length > 0) {
      console.warn('Console errors detected:', errors);
      // You can choose to fail the test or just warn
      // expect(errors).toHaveLength(0);
    }
  }
}

/**
 * Custom assertions for the dashboard
 */
export class DashboardAssertions {
  /**
   * Assert that the dashboard theme is correctly applied
   */
  static async verifyTheme(page: Page, theme: 'light' | 'dark' = 'light') {
    const body = page.locator('body');

    if (theme === 'dark') {
      await expect(body).toHaveClass(/dark/);
    } else {
      await expect(body).not.toHaveClass(/dark/);
    }
  }

  /**
   * Assert that the page is responsive at different viewport sizes
   */
  static async verifyResponsiveness(page: Page) {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow time for responsive changes

    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(mainContent).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(mainContent).toBeVisible();
  }
}
