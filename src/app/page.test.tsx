import { describe, it, expect } from 'vitest';

import Home from '@/app/page';

import { render, screen } from '../../tests/helpers/test-utils';

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Environment Variables Test');
  });

  it('has proper semantic structure', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
