// Badly formatted file to test pre-commit hook
const badlyFormatted = {
  message: 'this should be reformatted',
  array: [1, 2, 3],
  object: { nested: { value: 'test' } },
};

function poorlyFormattedFunction(param1: string, param2: number): string {
  return param1 + param2;
}

export { badlyFormatted, poorlyFormattedFunction };
