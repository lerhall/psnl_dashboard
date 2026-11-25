// Small helpers for reading values out of FormData inside server actions.

/** Trimmed string, or null if the field is missing/blank. */
export function optionalString(form: FormData, key: string): string | null {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Trimmed string that must be present; throws a readable error otherwise. */
export function requiredString(form: FormData, key: string): string {
  const value = optionalString(form, key);
  if (!value) throw new Error(`"${key}" is required`);
  return value;
}

/** Positive integer id from a hidden input. */
export function requiredId(form: FormData, key = "id"): number {
  const id = Number(form.get(key));
  if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid ${key}`);
  return id;
}

/** Only accept http(s) links so nothing odd ends up in an href. */
export function optionalUrl(form: FormData, key: string): string | null {
  const value = optionalString(form, key);
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Picks a value from an allowed list, falling back to a default. */
export function oneOf<T extends string>(form: FormData, key: string, allowed: readonly T[], fallback: T): T {
  const value = form.get(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** Reads a "true"/"false" hidden input (used to flip done/archived flags). */
export function booleanField(form: FormData, key: string): boolean {
  return form.get(key) === "true";
}
