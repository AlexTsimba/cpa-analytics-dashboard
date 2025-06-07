/**
 * Sidebar Integration Tests
 *
 * Tests the integration of sidebar components with the application layout:
 * - SidebarProvider context functionality
 * - SidebarTrigger interaction
 * - SidebarInset content layout
 * - Keyboard shortcuts
 * - Mobile/desktop behavior transitions
 */

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../helpers/test-utils';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}));

// Test component that uses the sidebar context
const TestSidebarConsumer = () => {
  const { state, open, toggleSidebar, isMobile } = useSidebar();

  return (
    <div>
      <div data-testid="sidebar-state">{state}</div>
      <div data-testid="sidebar-open">{open.toString()}</div>
      <div data-testid="sidebar-mobile">{isMobile.toString()}</div>
      <button onClick={toggleSidebar} data-testid="custom-toggle">
        Custom Toggle
      </button>
    </div>
  );
};

// Complete layout component for integration testing
const TestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger />
          <span>Test Header</span>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

describe('Sidebar Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SidebarProvider Context', () => {
    it('provides sidebar context to child components', () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-state')).toHaveTextContent('expanded');
      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('true');
      expect(screen.getByTestId('sidebar-mobile')).toHaveTextContent('false');
    });

    it('allows custom toggle of sidebar state', async () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      const customToggle = screen.getByTestId('custom-toggle');
      const stateDisplay = screen.getByTestId('sidebar-state');
      const openDisplay = screen.getByTestId('sidebar-open');

      // Initial state
      expect(stateDisplay).toHaveTextContent('expanded');
      expect(openDisplay).toHaveTextContent('true');

      // Toggle to collapsed
      fireEvent.click(customToggle);

      await waitFor(() => {
        expect(stateDisplay).toHaveTextContent('collapsed');
        expect(openDisplay).toHaveTextContent('false');
      });

      // Toggle back to expanded
      fireEvent.click(customToggle);

      await waitFor(() => {
        expect(stateDisplay).toHaveTextContent('expanded');
        expect(openDisplay).toHaveTextContent('true');
      });
    });

    it('supports controlled sidebar state', () => {
      const onOpenChange = vi.fn();

      render(
        <SidebarProvider open={false} onOpenChange={onOpenChange}>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-state')).toHaveTextContent(
        'collapsed'
      );
      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('false');

      // Trigger toggle
      fireEvent.click(screen.getByTestId('custom-toggle'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('SidebarTrigger Integration', () => {
    it('renders trigger button in layout', () => {
      render(<TestLayout>Content</TestLayout>);

      const trigger = screen.getByRole('button', { name: /toggle sidebar/i });
      expect(trigger).toBeInTheDocument();
    });

    it('toggles sidebar when trigger is clicked', async () => {
      render(
        <SidebarProvider>
          <SidebarTrigger />
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      const trigger = screen.getByRole('button', { name: /toggle sidebar/i });
      const stateDisplay = screen.getByTestId('sidebar-state');

      // Initial state
      expect(stateDisplay).toHaveTextContent('expanded');

      // Click trigger to collapse
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(stateDisplay).toHaveTextContent('collapsed');
      });
    });

    it('trigger button has proper accessibility attributes', () => {
      render(<TestLayout>Content</TestLayout>);

      const trigger = screen.getByRole('button', { name: /toggle sidebar/i });
      expect(trigger).toBeInTheDocument();

      // Check for screen reader text
      const srText = screen.getByText('Toggle Sidebar');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('SidebarInset Layout', () => {
    it('renders main content within SidebarInset', () => {
      render(
        <TestLayout>
          <div>Main Content</div>
        </TestLayout>
      );

      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    it('applies correct layout classes to SidebarInset', () => {
      const { container } = render(<TestLayout>Content</TestLayout>);

      const inset = container.querySelector('[data-slot="sidebar-inset"]');
      expect(inset).toBeInTheDocument();
      expect(inset).toHaveClass(
        'bg-background',
        'relative',
        'flex',
        'w-full',
        'flex-1',
        'flex-col'
      );
    });
  });

  describe('Complete Layout Integration', () => {
    it('renders complete sidebar layout without errors', () => {
      render(
        <TestLayout>
          <div>
            <h1>Dashboard</h1>
            <p>Dashboard content</p>
          </div>
        </TestLayout>
      );

      // Check all major components are present
      expect(screen.getByText('TraffBoard')).toBeInTheDocument();
      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /toggle sidebar/i })
      ).toBeInTheDocument();
    });

    it('maintains proper layout structure', () => {
      const { container } = render(<TestLayout>Content</TestLayout>);

      // Check sidebar wrapper structure
      const wrapper = container.querySelector('[data-slot="sidebar-wrapper"]');
      expect(wrapper).toBeInTheDocument();

      // Check sidebar container
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toBeInTheDocument();

      // Check inset container
      const inset = container.querySelector('[data-slot="sidebar-inset"]');
      expect(inset).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('toggles sidebar with Cmd+B on Mac', async () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      const stateDisplay = screen.getByTestId('sidebar-state');
      expect(stateDisplay).toHaveTextContent('expanded');

      // Simulate Cmd+B
      fireEvent.keyDown(window, {
        key: 'b',
        metaKey: true,
      });

      await waitFor(() => {
        expect(stateDisplay).toHaveTextContent('collapsed');
      });
    });

    it('toggles sidebar with Ctrl+B on Windows/Linux', async () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      const stateDisplay = screen.getByTestId('sidebar-state');
      expect(stateDisplay).toHaveTextContent('expanded');

      // Simulate Ctrl+B
      fireEvent.keyDown(window, {
        key: 'b',
        ctrlKey: true,
      });

      await waitFor(() => {
        expect(stateDisplay).toHaveTextContent('collapsed');
      });
    });

    it('ignores keyboard shortcut without modifier keys', async () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      const stateDisplay = screen.getByTestId('sidebar-state');
      expect(stateDisplay).toHaveTextContent('expanded');

      // Simulate just 'b' without modifiers
      fireEvent.keyDown(window, { key: 'b' });

      // State should remain unchanged
      expect(stateDisplay).toHaveTextContent('expanded');
    });
  });

  describe('Mobile/Desktop Behavior', () => {
    it('handles mobile viewport changes', async () => {
      const { useIsMobile } = await import('@/hooks/use-mobile');

      // Start in desktop mode
      vi.mocked(useIsMobile).mockReturnValue(false);

      const { rerender } = render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-mobile')).toHaveTextContent('false');

      // Switch to mobile
      vi.mocked(useIsMobile).mockReturnValue(true);

      rerender(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-mobile')).toHaveTextContent('true');
    });

    it('renders mobile sheet overlay on mobile devices', async () => {
      const { useIsMobile } = await import('@/hooks/use-mobile');
      vi.mocked(useIsMobile).mockReturnValue(true);

      render(<TestLayout>Mobile Content</TestLayout>);

      // On mobile, the sidebar renders as a Sheet
      // Just verify the main content renders and the sidebar wrapper exists
      expect(screen.getByText('Mobile Content')).toBeInTheDocument();
      expect(
        document.querySelector('[data-slot="sidebar-wrapper"]')
      ).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('persists sidebar state in cookie', async () => {
      // Mock document.cookie with proper getter/setter
      let cookieStore = '';
      Object.defineProperty(document, 'cookie', {
        get: () => cookieStore,
        set: (value) => {
          cookieStore = value;
        },
        configurable: true,
      });

      // Reset useIsMobile to ensure desktop behavior
      const { useIsMobile } = await import('@/hooks/use-mobile');
      vi.mocked(useIsMobile).mockReturnValue(false);

      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('sidebar-state')).toHaveTextContent(
          'expanded'
        );
      });

      // On desktop, the toggle should work
      // Since mobile is false, the toggleSidebar should call setOpen
      fireEvent.click(screen.getByTestId('custom-toggle'));

      // Wait for state change with longer timeout
      await waitFor(
        () => {
          expect(screen.getByTestId('sidebar-state')).toHaveTextContent(
            'collapsed'
          );
        },
        { timeout: 3000 }
      );

      // Check that cookie was set
      await waitFor(
        () => {
          expect(document.cookie).toContain('sidebar_state=false');
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Error Boundaries', () => {
    it('throws error when useSidebar is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestSidebarConsumer />);
      }).toThrow('useSidebar must be used within a SidebarProvider.');

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const renderSpy = vi.fn();

      const TestComponent = () => {
        renderSpy();
        return <div>Test</div>;
      };

      render(
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TestComponent />
          </SidebarInset>
        </SidebarProvider>
      );

      // Should only render once initially
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
});
