export function loadRequiredBoolean(envKeyName: string): boolean {
  const data = process.env[envKeyName];
  if (!data) {
    throw new Error(`${envKeyName} env var is missing`);
  }
  return data.trim() === "true";
}

export function loadOptionalBoolean(
  envKeyName: string,
  defaultValue: boolean
): boolean {
  const data = process.env[envKeyName];
  if (!data) {
    return defaultValue;
  }
  return data.trim() === "true";
}

export function loadRequiredInt(envKeyName: string): number {
  const data = process.env[envKeyName];
  if (!data) {
    throw new Error(`${envKeyName} env var is missing`);
  }
  const num = parseInt(data.trim());
  if (isNaN(num)) {
    throw new Error(`${envKeyName} env var is not a valid integer`);
  }
  return num;
}

export function loadOptionalInt(
  envKeyName: string,
  defaultValue: number
): number {
  const data = process.env[envKeyName];
  if (!data) {
    return defaultValue;
  }
  const num = parseInt(data.trim());
  if (isNaN(num)) {
    throw new Error(`${envKeyName} env var is not a valid integer`);
  }
  return num;
}

export function loadRequiredString(envKeyName: string): string {
  const data = process.env[envKeyName];
  if (!data) {
    throw new Error(`${envKeyName} env var is missing`);
  }
  return data;
}

export function loadOptionalString(
  envKeyName: string,
  defaultValue: string
): string {
  const data = process.env[envKeyName];
  if (!data) {
    return defaultValue;
  }
  return data;
}
