import { describe, it, expect } from 'vitest';
import {
  validateData,
  normalizeCSVHeaders,
  transformRowData,
} from '@/lib/validation';

describe('Validation', () => {
  it('validates data correctly', () => {
    expect(validateData('test')).toBe(true);
    expect(validateData(null)).toBe(false);
  });

  it('normalizes headers', () => {
    expect(normalizeCSVHeaders(['Test Header'])).toEqual(['test_header']);
  });

  it('transforms row data', () => {
    const row = { test: 'value' };
    expect(transformRowData(row)).toEqual(row);
  });
});
