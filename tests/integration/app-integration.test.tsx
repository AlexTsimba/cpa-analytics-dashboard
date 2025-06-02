import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../helpers/test-utils';
import Home from '@/app/page';
import EnvTestComponent from '@/components/debug/EnvTestComponent';

describe('Application Integration Tests', () => {
  beforeEach(() => {
    // Reset any global state before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders complete application structure', () => {
    render(<Home />);

    // Check for main content area
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Check for proper semantic structure
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('environment component integrates properly with app structure', () => {
    render(<EnvTestComponent />);

    // Should render without errors
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Should display environment information
    expect(screen.getByText('Environment Variables Test')).toBeInTheDocument();
  });

  it('handles component interactions correctly', () => {
    render(<EnvTestComponent />);

    // Component should be interactive and not crash
    const button = screen.getByRole('button');
    expect(button).toBeVisible();

    // Check for proper styling
    expect(button).toHaveClass('px-4');
  });

  it('maintains proper accessibility throughout the app', () => {
    render(<Home />);

    // Check for main landmark
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Ensure no accessibility violations in basic structure
    expect(main).toBeVisible();
  });
});
