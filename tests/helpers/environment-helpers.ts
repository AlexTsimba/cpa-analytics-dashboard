import { vi } from 'vitest';

/**
 * Environment-specific testing utilities for happy-dom integration
 * Provides helpers for DOM manipulation, browser API simulation, and React 19 + Next.js 15 compatibility
 */

export interface DOMTestEnvironment {
  window: Window & typeof globalThis;
  document: Document;
  cleanup: () => void;
}

/**
 * DOM environment utilities
 */
export const domUtils = {
  /**
   * Create a clean DOM environment for testing
   */
  createCleanEnvironment(): DOMTestEnvironment {
    // Reset document body
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Reset global properties
    (window as any).scrollTo = vi.fn();
    (window as any).alert = vi.fn();
    (window as any).confirm = vi.fn(() => true);
    (window as any).prompt = vi.fn(() => '');

    return {
      window: window as Window & typeof globalThis,
      document,
      cleanup: () => {
        document.body.innerHTML = '';
        document.head.innerHTML = '';
      },
    };
  },

  /**
   * Simulate viewport dimensions
   */
  setViewport(width: number, height: number) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  },

  /**
   * Create DOM element with attributes
   */
  createElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    attributes: Record<string, string> = {},
    textContent?: string
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tagName);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  },
  /**
   * Wait for DOM mutations to complete
   */
  async waitForMutations(targetNode: Node = document.body): Promise<void> {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        resolve();
      });

      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      // Fallback timeout
      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 100);
    });
  },

  /**
   * Simulate user interactions
   */
  userInteractions: {
    click(element: HTMLElement) {
      element.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    },

    type(element: HTMLInputElement, text: string) {
      element.focus();
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    },

    keyPress(element: HTMLElement, key: string) {
      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        })
      );
      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key,
          bubbles: true,
          cancelable: true,
        })
      );
    },

    focus(element: HTMLElement) {
      element.focus();
      element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    },

    blur(element: HTMLElement) {
      element.blur();
      element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    },
  },
};

/**
 * Global environment setup and teardown
 */
export const environmentSetup = {
  /**
   * Setup complete testing environment
   */
  setup() {
    const env = domUtils.createCleanEnvironment();
    return env;
  },

  /**
   * Teardown testing environment
   */
  teardown() {
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Clear all timers
    vi.clearAllTimers();

    // Reset globals
    vi.unstubAllGlobals();
  },

  /**
   * Reset environment between tests
   */
  reset() {
    domUtils.createCleanEnvironment();
    vi.clearAllMocks();
  },
};

// Export everything for easy importing
export * from './async-test-helpers';
export * from './mock-helpers';
