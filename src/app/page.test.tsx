import { describe, expect, it } from 'vitest';

import Home from '@/app/page';

import { render, screen } from '../../tests/helpers/test-utils';

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays the main content sections', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Traffic Overview');
  });

  it('has proper semantic structure', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
