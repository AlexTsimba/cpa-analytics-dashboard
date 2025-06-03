import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
  within,
  getByRole,
  getByText,
  getByLabelText,
  getByPlaceholderText,
  getByTestId,
  getByDisplayValue,
  getByAltText,
  getByTitle,
  getAllByRole,
  getAllByText,
  getAllByLabelText,
  getAllByPlaceholderText,
  getAllByTestId,
  getAllByDisplayValue,
  getAllByAltText,
  getAllByTitle,
  queryByRole,
  queryByText,
  queryByLabelText,
  queryByPlaceholderText,
  queryByTestId,
  queryByDisplayValue,
  queryByAltText,
  queryByTitle,
  queryAllByRole,
  queryAllByText,
  queryAllByLabelText,
  queryAllByPlaceholderText,
  queryAllByTestId,
  queryAllByDisplayValue,
  queryAllByAltText,
  queryAllByTitle,
  findByRole,
  findByText,
  findByLabelText,
  findByPlaceholderText,
  findByTestId,
  findByDisplayValue,
  findByAltText,
  findByTitle,
  findAllByRole,
  findAllByText,
  findAllByLabelText,
  findAllByPlaceholderText,
  findAllByTestId,
  findAllByDisplayValue,
  findAllByAltText,
  findAllByTitle,
  prettyDOM,
  logDOM,
  configure,
  getDefaultNormalizer,
  buildQueries,
  createEvent,
  type RenderOptions,
  type RenderResult,
  type Queries,
} from '@testing-library/react';
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
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from React Testing Library explicitly
export {
  // Main render function
  customRender as render,

  // Screen object - the primary API
  screen,

  // Event utilities
  fireEvent,

  // Async utilities
  waitFor,
  act,

  // Cleanup
  cleanup,

  // Container utilities
  within,

  // Getters (throw error if not found)
  getByRole,
  getByText,
  getByLabelText,
  getByPlaceholderText,
  getByTestId,
  getByDisplayValue,
  getByAltText,
  getByTitle,
  getAllByRole,
  getAllByText,
  getAllByLabelText,
  getAllByPlaceholderText,
  getAllByTestId,
  getAllByDisplayValue,
  getAllByAltText,
  getAllByTitle,

  // Queries (return null if not found)
  queryByRole,
  queryByText,
  queryByLabelText,
  queryByPlaceholderText,
  queryByTestId,
  queryByDisplayValue,
  queryByAltText,
  queryByTitle,
  queryAllByRole,
  queryAllByText,
  queryAllByLabelText,
  queryAllByPlaceholderText,
  queryAllByTestId,
  queryAllByDisplayValue,
  queryAllByAltText,
  queryAllByTitle,

  // Finders (async, return promise)
  findByRole,
  findByText,
  findByLabelText,
  findByPlaceholderText,
  findByTestId,
  findByDisplayValue,
  findByAltText,
  findByTitle,
  findAllByRole,
  findAllByText,
  findAllByLabelText,
  findAllByPlaceholderText,
  findAllByTestId,
  findAllByDisplayValue,
  findAllByAltText,
  findAllByTitle,

  // Debug utilities
  prettyDOM,
  logDOM,

  // Configuration
  configure,
  getDefaultNormalizer,

  // Advanced utilities
  buildQueries,
  createEvent,

  // Types
  type RenderOptions,
  type RenderResult,
  type Queries,
};
