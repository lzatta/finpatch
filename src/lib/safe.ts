// src/lib/safe.ts
export function toArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "function") {
    try {
      const v = (value as () => unknown)();
      return typeof v === "number" && Number.isFinite(v) ? v : fallback;
    } catch {
      return fallback;
    }
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Garante shape { data, error } mesmo se o retorno vier undefined. */
export function ensureResult<T = unknown>(res: any): { data: T | null; error: any | null } {
  if (res && typeof res === "object") {
    const { data = null, error = null } = res as any;
    return { data, error };
  }
  return { data: null, error: null };
}
