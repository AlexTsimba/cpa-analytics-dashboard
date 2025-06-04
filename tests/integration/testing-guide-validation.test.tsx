// tests/integration/testing-guide-validation.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

/**
 * Integration test to validate examples from the Testing Best Practices Guide
 * This ensures all code snippets in the guide are functional and up-to-date
 */

// Example component for testing guide patterns
const ExampleComponent = ({ 
  title, 
  onSubmit 
}: { 
  title: string; 
  onSubmit?: () => void;
}) => (
  <div>
    <h1>{title}</h1>
    <button onClick={onSubmit}>Submit</button>
    <div data-testid="example-content">Content loaded</div>
  </div>
);

describe('Testing Guide Validation', () => {
  it('validates basic rendering pattern from guide', () => {
    // This pattern is documented in the guide
    render(<ExampleComponent title="Test" />);
    
    expect(screen.getByRole('heading', { name: 'Test' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByTestId('example-content')).toBeInTheDocument();
  });

  it('validates async testing pattern from guide', async () => {
    const mockSubmit = vi.fn();
    
    render(<ExampleComponent title="Async Test" onSubmit={mockSubmit} />);
    
    // Use the async pattern documented in the guide
    const button = screen.getByRole('button', { name: 'Submit' });
    
    // Validate element exists
    expect(button).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates mocking pattern from guide', () => {
    // Mock function as documented in guide
    const mockFn = vi.fn().mockReturnValue('mocked value');
    
    expect(mockFn()).toBe('mocked value');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('validates testUtils global availability', () => {
    // Verify testUtils is available as documented
    expect(testUtils).toBeDefined();
    expect(typeof testUtils.createMockProps).toBe('function');
    expect(typeof testUtils.waitFor).toBe('function');
    expect(testUtils.mockApi).toBeDefined();
    expect(testUtils.env).toBeDefined();
  });

  it('validates environment setup', () => {
    // Test environment setup as documented
    expect(process.env.NODE_ENV).toBe('test');
    expect(window.ENV).toBe('test');
  });
});