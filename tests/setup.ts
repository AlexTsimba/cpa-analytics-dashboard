import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { mockLifecycle, mockApiServer } from './helpers/mock-helpers';
import { environmentSetup } from './helpers/environment-helpers';

// Set NODE_ENV for tests
Object.assign(process.env, { NODE_ENV: 'test' });
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Mock environment variables for tests
Object.defineProperty(window, 'ENV', {
  value: 'test',
  writable: true,
});

// Enhanced Next.js router mock with better type safety
const createMockRouter = () => ({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: vi.fn().mockResolvedValue(true),
  pop: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn().mockResolvedValue(undefined),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
  domainLocales: [],
  defaultLocale: 'en',
  locale: 'en',
  locales: ['en'],
});

// Mock Next.js router (Pages Router)
vi.mock('next/router', () => ({
  useRouter: () => createMockRouter(),
}));

// Enhanced App Router mock
const createMockAppRouter = () => ({
  push: vi.fn().mockResolvedValue(undefined),
  replace: vi.fn().mockResolvedValue(undefined),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn().mockResolvedValue(undefined),
});

// Mock Next.js App Router navigation
vi.mock('next/navigation', () => ({
  useRouter: () => createMockAppRouter(),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return React.createElement('img', { src, alt, ...props });
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return React.createElement('a', { href, ...props }, children);
  },
}));

// Mock Next.js dynamic imports
vi.mock('next/dynamic', () => ({
  default: (fn: any, options?: any) => {
    const Component = fn();
    if (options?.loading) {
      const DynamicComponent = (props: any) => {
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
          const timer = setTimeout(() => setIsLoading(false), 0);
          return () => clearTimeout(timer);
        }, []);

        if (isLoading && options.loading) {
          return options.loading();
        }

        return React.createElement(Component, props);
      };
      DynamicComponent.displayName = 'DynamicComponent';
      return DynamicComponent;
    }
    return Component;
  },
}));

// Global test utilities with enhanced capabilities
declare global {
  const testUtils: {
    createMockProps: (overrides?: any) => any;
    waitFor: typeof import('./helpers/async-test-helpers').waitForCondition;
    mockApi: typeof mockApiServer;
    env: typeof environmentSetup;
  };
}

// Setup global test utilities
(globalThis as any).testUtils = {
  createMockProps: (overrides = {}) => ({
    'data-testid': 'test-component',
    ...overrides,
  }),
  waitFor: async (condition: () => any, options?: any) => {
    const { waitForCondition } = await import('./helpers/async-test-helpers');
    return waitForCondition(condition, options);
  },
  mockApi: mockApiServer,
  env: environmentSetup,
};

// Global setup - runs once before all tests
beforeAll(async () => {
  // Setup comprehensive mocking environment
  mockLifecycle.setupAll();

  // Setup DOM environment
  environmentSetup.setup();

  // Setup global fetch mock
  global.fetch = vi.fn();

  // Setup ResizeObserver mock
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Setup MutationObserver mock if not available
  if (!global.MutationObserver) {
    global.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn(),
    }));
  }

  // Mock window.matchMedia for responsive design tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock localStorage and sessionStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
});

// Setup before each test
beforeEach(() => {
  // Reset environment
  environmentSetup.reset();

  // Clear all mocks
  vi.clearAllMocks();

  // Reset API server
  mockApiServer.reset();
});

// Cleanup after each test
afterEach(() => {
  // Cleanup React Testing Library
  cleanup();

  // Clear all timers
  vi.clearAllTimers();

  // Reset any DOM state
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

// Global teardown - runs once after all tests
afterAll(() => {
  // Comprehensive cleanup
  mockLifecycle.teardownAll();
  environmentSetup.teardown();

  // Restore original implementations
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// Enhanced error handling for async operations
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Suppress console warnings for tests unless explicitly needed
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router Future Flag Warning') ||
      args[0].includes('validateDOMNesting'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};
