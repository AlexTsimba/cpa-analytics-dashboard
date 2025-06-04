import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../helpers/test-utils';
import {
  mockApiServer,
  mockDependencies,
  mockStorage,
} from '../helpers/mock-helpers';
import { waitForCondition } from '../helpers/async-test-helpers';
import React, { useState, useEffect } from 'react';

describe('Integration Tests - Enhanced Testing Environment', () => {
  beforeEach(() => {
    mockApiServer.reset();
  });

  describe('Browser API Mocking', () => {
    it('should work with mocked localStorage', () => {
      // Test localStorage functionality
      mockStorage.localStorage.setItem('test-key', 'test-value');
      const value = mockStorage.localStorage.getItem('test-key');

      expect(value).toBe('test-value');
      expect(mockStorage.localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        'test-value'
      );
    });

    it('should work with mocked fetch', () => {
      const { mockFetch } = mockDependencies;
      const fetchMock = mockFetch();

      fetchMock.mockResolvedValue({ test: 'data' });

      expect(global.fetch).toBeDefined();
      expect(fetchMock.mock).toBe(global.fetch);
    });
  });

  describe('React 19 Compatibility', () => {
    it('should handle async components properly', async () => {
      function AsyncComponent() {
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
          setMounted(true);
        }, []);

        return React.createElement(
          'div',
          { 'data-testid': 'async-component' },
          mounted ? 'Mounted' : 'Loading'
        );
      }

      render(React.createElement(AsyncComponent));

      await waitForCondition(
        () => screen.getByTestId('async-component').textContent === 'Mounted'
      );

      expect(screen.getByTestId('async-component')).toHaveTextContent(
        'Mounted'
      );
    });
  });
});
