import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Set NODE_ENV for tests (using env assignment for testing environment)
Object.assign(process.env, { NODE_ENV: 'test' });
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Mock environment variables for tests
Object.defineProperty(window, 'ENV', {
  value: 'test',
  writable: true,
});

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    pop: vi.fn(),
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
  }),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Global test utilities
declare global {
  const testUtils: {
    createMockProps: (overrides?: any) => any;
  };
}

global.testUtils = {
  // Add any global test utilities here
  createMockProps: (overrides = {}) => ({
    ...overrides,
  }),
};

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
