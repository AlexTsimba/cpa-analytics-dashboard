/**
 * Sidebar End-to-End Tests
 *
 * Comprehensive e2e testing of sidebar functionality:
 * - Visual and interaction testing
 * - Navigation flow testing
 * - Mobile/desktop responsiveness
 * - Accessibility in real browsers
 * - Performance and loading tests
 */

import { test, expect, type Page } from '@playwright/test';

// Helper to wait for the application to load
const waitForAppLoad = async (page: Page) => {
  await page.waitForSelector('[data-slot="sidebar-wrapper"]', {
    timeout: 10000,
  });
  await page.waitForLoadState('networkidle');
};

// Helper to get sidebar state
const getSidebarState = async (page: Page) => {
  const sidebar = await page.locator('[data-slot="sidebar"]').first();
  return await sidebar.getAttribute('data-state');
};

test.describe('Sidebar E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);
  });

  test.describe('Visual and Layout', () => {
    test('displays sidebar with correct branding', async ({ page }) => {
      // Check TraffBoard branding
      await expect(page.getByText('TraffBoard')).toBeVisible();
      await expect(page.getByText('Affiliate Tracker')).toBeVisible();

      // Check brand icon is present
      const brandLink = page.getByRole('link', { name: /traffboard/i });
      await expect(brandLink).toBeVisible();
      await expect(brandLink).toHaveAttribute('href', '/');
    });

    test('shows all navigation items', async ({ page }) => {
      const navItems = [
        'Overview',
        'Conversions',
        'Quality',
        'Cohorts',
        'Settings',
      ];

      for (const item of navItems) {
        await expect(
          page.getByRole('link', { name: new RegExp(item, 'i') })
        ).toBeVisible();
      }
    });

    test('displays Live badge on Overview', async ({ page }) => {
      await expect(page.getByText('Live')).toBeVisible();
    });

    test('shows user dropdown in footer', async ({ page }) => {
      await expect(page.getByText('shadcn')).toBeVisible();
      await expect(page.getByText('m@example.com')).toBeVisible();
    });

    test('has proper layout structure', async ({ page }) => {
      // Check main layout components
      await expect(page.locator('[data-slot="sidebar-wrapper"]')).toBeVisible();
      await expect(page.locator('[data-slot="sidebar"]')).toBeVisible();
      await expect(page.locator('[data-slot="sidebar-inset"]')).toBeVisible();

      // Check header with trigger
      await expect(
        page.getByRole('button', { name: /toggle sidebar/i })
      ).toBeVisible();
    });
  });

  test.describe('Navigation Functionality', () => {
    test('navigates to different sections', async ({ page }) => {
      // Navigate to Conversions
      await page.getByRole('link', { name: /conversions/i }).click();
      await expect(page).toHaveURL('/conversions');

      // Navigate to Quality
      await page.getByRole('link', { name: /quality/i }).click();
      await expect(page).toHaveURL('/quality');

      // Navigate to Settings
      await page.getByRole('link', { name: /settings/i }).click();
      await expect(page).toHaveURL('/settings');

      // Navigate back to home
      await page.getByRole('link', { name: /overview/i }).click();
      await expect(page).toHaveURL('/');
    });

    test('shows active state for current page', async ({ page }) => {
      // Home page - Overview should be active
      const overviewLink = page.getByRole('link', { name: /overview/i });
      await expect(overviewLink).toHaveAttribute('data-active', 'true');

      // Navigate to conversions
      await page.getByRole('link', { name: /conversions/i }).click();
      await page.waitForURL('/conversions');

      // Conversions should now be active
      const conversionsLink = page.getByRole('link', { name: /conversions/i });
      await expect(conversionsLink).toHaveAttribute('data-active', 'true');

      // Overview should no longer be active
      await expect(overviewLink).toHaveAttribute('data-active', 'false');
    });

    test('handles nested routes correctly', async ({ page }) => {
      // Navigate to cohorts (nested under quality)
      await page.getByRole('link', { name: /cohorts/i }).click();
      await expect(page).toHaveURL('/quality/cohorts');

      // Cohorts should be active
      const cohortsLink = page.getByRole('link', { name: /cohorts/i });
      await expect(cohortsLink).toHaveAttribute('data-active', 'true');
    });
  });

  test.describe('Sidebar Toggle Functionality', () => {
    test('toggles sidebar with trigger button', async ({ page }) => {
      const trigger = page.getByRole('button', { name: /toggle sidebar/i });

      // Initial state should be expanded
      let state = await getSidebarState(page);
      expect(state).toBe('expanded');

      // Click to collapse
      await trigger.click();
      await page.waitForTimeout(300); // Wait for animation

      state = await getSidebarState(page);
      expect(state).toBe('collapsed');

      // Click to expand
      await trigger.click();
      await page.waitForTimeout(300);

      state = await getSidebarState(page);
      expect(state).toBe('expanded');
    });

    test('toggles with keyboard shortcut Cmd+B', async ({ page }) => {
      // Initial state should be expanded
      let state = await getSidebarState(page);
      expect(state).toBe('expanded');

      // Use Cmd+B (or Ctrl+B on non-Mac)
      await page.keyboard.press(
        process.platform === 'darwin' ? 'Meta+KeyB' : 'Control+KeyB'
      );
      await page.waitForTimeout(300);

      state = await getSidebarState(page);
      expect(state).toBe('collapsed');

      // Toggle back
      await page.keyboard.press(
        process.platform === 'darwin' ? 'Meta+KeyB' : 'Control+KeyB'
      );
      await page.waitForTimeout(300);

      state = await getSidebarState(page);
      expect(state).toBe('expanded');
    });

    test('shows tooltips in collapsed state', async ({ page }) => {
      const trigger = page.getByRole('button', { name: /toggle sidebar/i });

      // Collapse sidebar
      await trigger.click();
      await page.waitForTimeout(300);

      // Hover over a navigation item to see tooltip
      const overviewLink = page.getByRole('link', { name: /overview/i });
      await overviewLink.hover();

      // Wait for tooltip to appear
      await page.waitForTimeout(500);

      // Check if tooltip is visible (tooltip content may vary based on implementation)
      const tooltip = page.locator('[role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 1000 });
    });
  });

  test.describe('Dropdown Functionality', () => {
    test('opens and closes user dropdown', async ({ page }) => {
      const dropdownTrigger = page.getByRole('button', { name: /shadcn/i });

      // Click to open dropdown
      await dropdownTrigger.click();

      // Check dropdown items are visible
      await expect(page.getByText('Account')).toBeVisible();
      await expect(page.getByText('Settings')).toBeVisible();
      await expect(page.getByText('Sign out')).toBeVisible();

      // Click outside to close
      await page.click('body');

      // Dropdown should be closed
      await expect(page.getByText('Account')).not.toBeVisible();
    });

    test('closes dropdown with Escape key', async ({ page }) => {
      const dropdownTrigger = page.getByRole('button', { name: /shadcn/i });

      // Open dropdown
      await dropdownTrigger.click();
      await expect(page.getByText('Account')).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');

      // Dropdown should be closed
      await expect(page.getByText('Account')).not.toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('adapts to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await waitForAppLoad(page);

      // Sidebar should still be functional on mobile
      await expect(page.getByText('TraffBoard')).toBeVisible();
      await expect(
        page.getByRole('button', { name: /toggle sidebar/i })
      ).toBeVisible();

      // Navigation should work
      await page.getByRole('link', { name: /conversions/i }).click();
      await expect(page).toHaveURL('/conversions');
    });

    test('maintains functionality across different screen sizes', async ({
      page,
    }) => {
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 1024, height: 768 }, // Tablet
        { width: 768, height: 1024 }, // Tablet portrait
        { width: 375, height: 667 }, // Mobile
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.reload();
        await waitForAppLoad(page);

        // Basic functionality should work
        await expect(page.getByText('TraffBoard')).toBeVisible();
        await expect(
          page.getByRole('button', { name: /toggle sidebar/i })
        ).toBeVisible();

        // Navigation should work
        const trigger = page.getByRole('button', { name: /toggle sidebar/i });
        await trigger.click();
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('supports keyboard navigation', async ({ page }) => {
      // Tab through navigation elements
      await page.keyboard.press('Tab'); // Should focus on brand link

      let focused = await page.evaluate(
        () => document.activeElement?.textContent
      );
      expect(focused).toContain('TraffBoard');

      // Continue tabbing through navigation
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.textContent);
      expect(focused).toContain('Overview');

      // Enter should activate link
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/');
    });

    test('has proper ARIA attributes', async ({ page }) => {
      // Check navigation landmark
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check trigger button accessibility
      const trigger = page.getByRole('button', { name: /toggle sidebar/i });
      await expect(trigger).toHaveAttribute('aria-label', 'Toggle Sidebar');

      // Check that links have proper accessibility names
      const links = page.locator('a[href]');
      const linkCount = await links.count();

      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        const accessibleName =
          (await link.getAttribute('aria-label')) || (await link.textContent());
        expect(accessibleName).toBeTruthy();
      }
    });

    test('maintains focus visibility', async ({ page }) => {
      // Add CSS to check focus visibility
      await page.addStyleTag({
        content: `
          *:focus {
            outline: 2px solid red !important;
            outline-offset: 2px !important;
          }
        `,
      });

      // Tab to focus elements and check they're visible
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('loads sidebar quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await waitForAppLoad(page);

      const loadTime = Date.now() - startTime;

      // Sidebar should load within reasonable time
      expect(loadTime).toBeLessThan(3000);

      // All key elements should be visible
      await expect(page.getByText('TraffBoard')).toBeVisible();
      await expect(page.getByRole('link', { name: /overview/i })).toBeVisible();
    });

    test('animates smoothly when toggling', async ({ page }) => {
      const trigger = page.getByRole('button', { name: /toggle sidebar/i });

      // Measure animation performance
      await page.evaluate(() => {
        performance.mark('toggle-start');
      });

      await trigger.click();

      // Wait for animation to complete
      await page.waitForTimeout(300);

      await page.evaluate(() => {
        performance.mark('toggle-end');
        performance.measure('sidebar-toggle', 'toggle-start', 'toggle-end');
      });

      const measurement = await page.evaluate(() => {
        const measure = performance.getEntriesByName('sidebar-toggle')[0];
        return measure?.duration || 0;
      });

      // Animation should complete within reasonable time
      expect(measurement).toBeLessThan(500);
    });
  });

  test.describe('Visual Regression', () => {
    test('sidebar appears correctly in expanded state', async ({ page }) => {
      await expect(
        page.locator('[data-slot="sidebar-wrapper"]')
      ).toHaveScreenshot('sidebar-expanded.png');
    });

    test('sidebar appears correctly in collapsed state', async ({ page }) => {
      const trigger = page.getByRole('button', { name: /toggle sidebar/i });
      await trigger.click();
      await page.waitForTimeout(300);

      await expect(
        page.locator('[data-slot="sidebar-wrapper"]')
      ).toHaveScreenshot('sidebar-collapsed.png');
    });

    test('dropdown appears correctly when opened', async ({ page }) => {
      const dropdownTrigger = page.getByRole('button', { name: /shadcn/i });
      await dropdownTrigger.click();

      await expect(
        page.locator('[data-slot="sidebar-footer"]')
      ).toHaveScreenshot('sidebar-dropdown.png');
    });
  });

  test.describe('Cross-page Consistency', () => {
    test('maintains sidebar state across navigation', async ({ page }) => {
      const trigger = page.getByRole('button', { name: /toggle sidebar/i });

      // Collapse sidebar
      await trigger.click();
      await page.waitForTimeout(300);

      let state = await getSidebarState(page);
      expect(state).toBe('collapsed');

      // Navigate to different page
      await page.getByRole('link', { name: /conversions/i }).click();
      await page.waitForURL('/conversions');

      // Sidebar should remain collapsed
      state = await getSidebarState(page);
      expect(state).toBe('collapsed');
    });

    test('shows correct active states on different pages', async ({ page }) => {
      // Test on home page
      await expect(
        page.getByRole('link', { name: /overview/i })
      ).toHaveAttribute('data-active', 'true');

      // Navigate to conversions
      await page.getByRole('link', { name: /conversions/i }).click();
      await page.waitForURL('/conversions');

      await expect(
        page.getByRole('link', { name: /conversions/i })
      ).toHaveAttribute('data-active', 'true');
      await expect(
        page.getByRole('link', { name: /overview/i })
      ).toHaveAttribute('data-active', 'false');

      // Navigate to settings
      await page.getByRole('link', { name: /settings/i }).click();
      await page.waitForURL('/settings');

      await expect(
        page.getByRole('link', { name: /settings/i })
      ).toHaveAttribute('data-active', 'true');
      await expect(
        page.getByRole('link', { name: /conversions/i })
      ).toHaveAttribute('data-active', 'false');
    });
  });
});
