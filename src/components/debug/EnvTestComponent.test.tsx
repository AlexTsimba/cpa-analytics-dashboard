import { describe, it, expect } from 'vitest';

import EnvTestComponent from '@/components/debug/EnvTestComponent';

import { render, screen } from '../../../tests/helpers/test-utils';

describe('EnvTestComponent', () => {
  it('renders environment variables section', () => {
    render(<EnvTestComponent />);
    expect(screen.getByText('Environment Variables Test')).toBeInTheDocument();
  });

  it('displays test button', () => {
    render(<EnvTestComponent />);
    expect(screen.getByText('Test Environment Variables')).toBeInTheDocument();
  });

  it('shows proper instructional text', () => {
    render(<EnvTestComponent />);
    expect(
      screen.getByText(/Click the button below to test/)
    ).toBeInTheDocument();
  });

  it('has proper structure with button', () => {
    render(<EnvTestComponent />);
    const button = screen.getByRole('button', {
      name: 'Test Environment Variables',
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('px-4');
  });
});
