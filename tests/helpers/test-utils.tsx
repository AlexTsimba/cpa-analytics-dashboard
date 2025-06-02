import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    // Add any global providers here (Theme, Router, etc.)
    <>{children}</>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
