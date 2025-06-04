import { vi } from 'vitest';

/**
 * Async testing utilities for enhanced happy-dom testing scenarios
 * Provides helpers for waiting, polling, and handling async operations in tests
 */

export interface WaitForOptions {
  timeout?: number;
  interval?: number;
  onTimeout?: (lastError?: Error) => void;
}

export interface PollOptions extends WaitForOptions {
  maxAttempts?: number;
}

/**
 * Enhanced vi.waitFor wrapper with better error handling and timeout management
 */
export async function waitForCondition<T>(
  callback: () => T | Promise<T>,
  options: WaitForOptions = {}
): Promise<T> {
  const { timeout = 5000, interval = 50, onTimeout = () => {} } = options;

  return vi
    .waitFor(
      async () => {
        const result = await callback();
        if (!result) {
          throw new Error('Condition not met');
        }
        return result;
      },
      { timeout, interval }
    )
    .catch((error) => {
      onTimeout(error);
      throw error;
    });
}

/**
 * Wait for DOM element to appear with enhanced retry logic
 */
export async function waitForElement(
  selector: string,
  options: WaitForOptions = {}
): Promise<HTMLElement> {
  return waitForCondition(() => {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      throw new Error(`Element ${selector} not found`);
    }
    return element;
  }, options);
}

/**
 * Wait for element to have specific text content
 */
export async function waitForElementText(
  selector: string,
  expectedText: string,
  options: WaitForOptions = {}
): Promise<HTMLElement> {
  return waitForCondition(() => {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      throw new Error(`Element ${selector} not found`);
    }
    if (!element.textContent?.includes(expectedText)) {
      throw new Error(
        `Element ${selector} does not contain text: ${expectedText}`
      );
    }
    return element;
  }, options);
}

/**
 * Wait for element to be removed from DOM
 */
export async function waitForElementToBeRemoved(
  selector: string,
  options: WaitForOptions = {}
): Promise<void> {
  await waitForCondition(() => {
    const element = document.querySelector(selector);
    if (element) {
      throw new Error(`Element ${selector} is still present`);
    }
    return undefined;
  }, options);
}

/**
 * Advanced polling function for async operations
 */
export async function pollUntil<T>(
  callback: () => T | Promise<T>,
  predicate: (value: T) => boolean,
  options: PollOptions = {}
): Promise<T> {
  const {
    timeout = 5000,
    interval = 100,
    maxAttempts = Math.floor(timeout / interval),
    onTimeout = () => {},
  } = options;

  let attempts = 0;
  let lastResult: T;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      onTimeout();
      reject(
        new Error(
          `Polling timed out after ${timeout}ms. Last result: ${JSON.stringify(lastResult)}`
        )
      );
    }, timeout);

    const poll = async () => {
      try {
        attempts++;
        const result = await callback();
        lastResult = result;

        if (predicate(result)) {
          clearTimeout(timeoutId);
          resolve(result);
          return;
        }

        if (attempts >= maxAttempts) {
          clearTimeout(timeoutId);
          reject(
            new Error(
              `Max attempts reached (${maxAttempts}). Last result: ${JSON.stringify(lastResult)}`
            )
          );
          return;
        }

        setTimeout(poll, interval);
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearTimeout(timeoutId);
          reject(error);
          return;
        }
        setTimeout(poll, interval);
      }
    };

    poll();
  });
}

/**
 * Wait for async component to render and stabilize
 */
export async function waitForComponentStabilization(
  componentSelector: string,
  options: WaitForOptions = {}
): Promise<HTMLElement> {
  const { timeout = 3000, interval = 50 } = options;

  let previousHTML = '';
  let stableCount = 0;
  const requiredStableIterations = 3;

  return waitForCondition(
    () => {
      const element = document.querySelector(componentSelector) as HTMLElement;
      if (!element) {
        throw new Error(`Component ${componentSelector} not found`);
      }

      const currentHTML = element.innerHTML;
      if (currentHTML === previousHTML) {
        stableCount++;
      } else {
        stableCount = 0;
        previousHTML = currentHTML;
      }

      if (stableCount >= requiredStableIterations) {
        return element;
      }

      throw new Error('Component still updating');
    },
    { timeout, interval }
  );
}

/**
 * Wait for all pending microtasks and timers to complete
 */
export async function flushPromises(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await vi.runAllTimersAsync();
}

/**
 * Wait for Next.js router to be ready
 */
export async function waitForRouterReady(
  options: WaitForOptions = {}
): Promise<void> {
  return waitForCondition(() => {
    // Check if router is ready (mocked in setup.ts)
    const router = (globalThis as any).__NEXT_ROUTER__;
    if (!router?.isReady) {
      throw new Error('Router not ready');
    }
    return undefined;
  }, options);
}

/**
 * Wait for async hook to resolve with specific value
 */
export async function waitForHookValue<T>(
  hookGetter: () => T,
  expectedValue: T,
  options: WaitForOptions = {}
): Promise<T> {
  return waitForCondition(() => {
    const value = hookGetter();
    if (value !== expectedValue) {
      throw new Error(
        `Hook value is ${JSON.stringify(value)}, expected ${JSON.stringify(expectedValue)}`
      );
    }
    return value;
  }, options);
}

/**
 * Wait for state change in component
 */
export async function waitForStateChange<T>(
  getState: () => T,
  predicate: (state: T) => boolean,
  options: WaitForOptions = {}
): Promise<T> {
  return waitForCondition(() => {
    const state = getState();
    if (!predicate(state)) {
      throw new Error(`State condition not met: ${JSON.stringify(state)}`);
    }
    return state;
  }, options);
}

/**
 * Create a deferred promise for manual resolution in tests
 */
export function createDeferred<T = void>() {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve: resolve!, reject: reject! };
}

/**
 * Timeout helper for async operations
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage?: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              timeoutMessage || `Operation timed out after ${timeoutMs}ms`
            )
          ),
        timeoutMs
      )
    ),
  ]);
}
