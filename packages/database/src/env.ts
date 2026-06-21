export function requireEnv(name: string, errorMessage: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
}
