import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

/**
 * Enhanced mocking utilities for external dependencies and APIs
 * Provides comprehensive mocking capabilities for happy-dom testing
 */

export interface MockApiResponse {
  status?: number;
  data?: any;
  headers?: Record<string, string>;
  delay?: number;
}

export interface MockApiError {
  status: number;
  message: string;
  code?: string;
}

/**
 * API mocking server using MSW for comprehensive request/response testing
 */
class ApiMockServer {
  private server: ReturnType<typeof setupServer>;
  private handlers: any[] = [];

  constructor() {
    this.server = setupServer();
  }

  /**
   * Start the mock server
   */
  start() {
    this.server.listen({ onUnhandledRequest: 'warn' });
  }

  /**
   * Stop the mock server
   */
  stop() {
    this.server.close();
  }

  /**
   * Reset all handlers
   */
  reset() {
    this.server.resetHandlers();
    this.handlers = [];
  }

  /**
   * Mock GET request
   */
  mockGet(url: string, response: MockApiResponse | MockApiError) {
    const handler = http.get(url, async () => {
      if ('delay' in response && response.delay) {
        await new Promise((resolve) => setTimeout(resolve, response.delay));
      }

      if ('message' in response) {
        return HttpResponse.json(
          { error: response.message, code: response.code },
          { status: response.status }
        );
      }

      const init: any = {
        status: response.status || 200,
      };
      if (response.headers) {
        init.headers = response.headers;
      }
      return HttpResponse.json(response.data, init);
    });

    this.handlers.push(handler);
    this.server.use(handler);
    return handler;
  }

  /**
   * Mock POST request
   */
  mockPost(url: string, response: MockApiResponse | MockApiError) {
    const handler = http.post(url, async () => {
      if ('delay' in response && response.delay) {
        await new Promise((resolve) => setTimeout(resolve, response.delay));
      }

      if ('message' in response) {
        return HttpResponse.json(
          { error: response.message, code: response.code },
          { status: response.status }
        );
      }

      const init: any = {
        status: response.status || 201,
      };
      if (response.headers) {
        init.headers = response.headers;
      }
      return HttpResponse.json(response.data, init);
    });

    this.handlers.push(handler);
    this.server.use(handler);
    return handler;
  }

  /**
   * Mock any HTTP method
   */
  mockRequest(
    method: string,
    url: string,
    response: MockApiResponse | MockApiError
  ) {
    const handler = http[method.toLowerCase() as 'get'](url, async () => {
      if ('delay' in response && response.delay) {
        await new Promise((resolve) => setTimeout(resolve, response.delay));
      }

      if ('message' in response) {
        return HttpResponse.json(
          { error: response.message, code: response.code },
          { status: response.status }
        );
      }

      const init: any = {
        status: response.status || 200,
      };
      if (response.headers) {
        init.headers = response.headers;
      }
      return HttpResponse.json(response.data, init);
    });

    this.handlers.push(handler);
    this.server.use(handler);
    return handler;
  }
}

// Global mock server instance
export const mockApiServer = new ApiMockServer();

/**
 * Enhanced Next.js mocking utilities
 */
export const mockNextJs = {
  /**
   * Mock Next.js Image component
   */
  mockNextImage() {
    vi.mock('next/image', () => ({
      default: ({ src, alt, ...props }: any) => {
        return React.createElement('img', { src, alt, ...props });
      },
    }));
  },

  /**
   * Mock Next.js Link component
   */
  mockNextLink() {
    vi.mock('next/link', () => ({
      default: ({ children, href, ...props }: any) => {
        return React.createElement('a', { href, ...props }, children);
      },
    }));
  },

  /**
   * Mock Next.js dynamic imports
   */
  mockDynamic() {
    vi.mock('next/dynamic', () => ({
      default: (fn: any) => {
        const Component = fn();
        return Component;
      },
    }));
  },

  /**
   * Mock Next.js App Router hooks
   */
  mockAppRouter() {
    const mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    };

    vi.mock('next/navigation', () => ({
      useRouter: () => mockRouter,
      useSearchParams: () => new URLSearchParams(),
      usePathname: () => '/',
      useParams: () => ({}),
    }));

    return mockRouter;
  },
};

/**
 * Local Storage mocking utilities
 */
export const mockStorage = {
  localStorage: (() => {
    let store: Record<string, string> = {};

    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      get store() {
        return store;
      },
      reset() {
        store = {};
      },
    };
  })(),

  sessionStorage: (() => {
    let store: Record<string, string> = {};

    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      get store() {
        return store;
      },
      reset() {
        store = {};
      },
    };
  })(),
};

/**
 * Mock external dependencies
 */
export const mockDependencies = {
  /**
   * Mock fetch API with customizable responses
   */
  mockFetch() {
    const mockFetch = vi.fn();

    global.fetch = mockFetch;

    return {
      mockResolvedValue: (response: any) => {
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(response),
          text: () => Promise.resolve(JSON.stringify(response)),
        });
      },
      mockRejectedValue: (error: any) => {
        mockFetch.mockRejectedValue(error);
      },
      mockImplementation: (implementation: any) => {
        mockFetch.mockImplementation(implementation);
      },
      mock: mockFetch,
    };
  },

  /**
   * Mock console methods
   */
  mockConsole() {
    const originalConsole = { ...console };

    return {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      restore: () => {
        Object.assign(console, originalConsole);
      },
    };
  },

  /**
   * Mock window location
   */
  mockLocation(mockLocation: Partial<Location>) {
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        ...mockLocation,
      },
      writable: true,
    });

    return () => {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    };
  },

  /**
   * Mock window.matchMedia
   */
  mockMatchMedia() {
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
  },

  /**
   * Mock IntersectionObserver
   */
  mockIntersectionObserver() {
    const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    }));

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: mockIntersectionObserver,
    });

    return mockIntersectionObserver;
  },
};

/**
 * Create mock function with enhanced tracking
 */
export function createMockFunction<T extends (...args: any[]) => any>(
  implementation?: T
): ReturnType<typeof vi.fn> & {
  getCallHistory: () => Array<{
    args: Parameters<T>;
    result: ReturnType<T>;
    timestamp: number;
  }>;
  getCallCount: () => number;
  getLastCall: () =>
    | { args: Parameters<T>; result: ReturnType<T>; timestamp: number }
    | undefined;
} {
  const callHistory: Array<{
    args: Parameters<T>;
    result: ReturnType<T>;
    timestamp: number;
  }> = [];

  const mockFn = vi.fn((...args: Parameters<T>) => {
    const result = implementation ? implementation(...args) : undefined;
    callHistory.push({
      args,
      result,
      timestamp: Date.now(),
    });
    return result;
  });

  return Object.assign(mockFn, {
    getCallHistory: () => callHistory,
    getCallCount: () => callHistory.length,
    getLastCall: () => callHistory[callHistory.length - 1],
  });
}

/**
 * Setup and teardown utilities
 */
export const mockLifecycle = {
  /**
   * Setup all common mocks
   */
  setupAll() {
    mockDependencies.mockMatchMedia();
    mockNextJs.mockNextImage();
    mockNextJs.mockNextLink();
    mockApiServer.start();
  },

  /**
   * Cleanup all mocks
   */
  teardownAll() {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    mockStorage.localStorage.reset();
    mockStorage.sessionStorage.reset();
    mockApiServer.reset();
    mockApiServer.stop();
  },
};
