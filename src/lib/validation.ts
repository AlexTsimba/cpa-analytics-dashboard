// Minimal validation functions
export function validateData(data: any): boolean {
  return data !== null && data !== undefined;
}

export function normalizeCSVHeaders(headers: string[]): string[] {
  return headers.map((header) => header.toLowerCase().replace(/\s+/g, '_'));
}

export function transformRowData(
  row: Record<string, any>
): Record<string, any> {
  return row;
}
