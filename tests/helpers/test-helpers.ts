import { vi } from 'vitest';

/**
 * Mock factory for creating Next.js router mock
 */
export const createMockRouter = (overrides = {}) => ({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
  ...overrides,
});

/**
 * Mock factory for environment variables
 */
export const createMockEnv = (overrides = {}) => ({
  NODE_ENV: 'test',
  ...overrides,
});

/**
 * Helper to wait for async operations to complete
 */
export const waitForNextTick = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Helper to create mock component props
 */
export const createMockProps = <T extends Record<string, any>>(
  defaultProps: T,
  overrides: Partial<T> = {}
): T => ({
  ...defaultProps,
  ...overrides,
});

/**
 * Mock console methods for testing
 */
export const mockConsole = () => {
  const originalConsole = { ...console };

  const restore = () => {
    Object.assign(console, originalConsole);
  };

  const mock = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  };

  Object.assign(console, mock);

  return { mock, restore };
};
