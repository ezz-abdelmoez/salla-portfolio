export function safeRead<T>(key: string, schema: { safeParse: (value: unknown) => { success: boolean; data?: T } }, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success || parsed.data === undefined) {
      window.localStorage.removeItem(key);
      return fallback;
    }
    return parsed.data;
  } catch {
    try { window.localStorage.removeItem(key); } catch {}
    return fallback;
  }
}

export function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
