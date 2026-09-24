export type ApiMode = "mock" | "http";
export type StoreStateMode = "local" | "api";

export const apiConfig = {
  mode: process.env.NEXT_PUBLIC_API_MODE === "http" ? ("http" as const) : ("mock" as const),
  browserBasePath: process.env.NEXT_PUBLIC_API_BASE_PATH || "/api",
  serverOrigin: process.env.API_INTERNAL_URL || "",
  timeoutMs: Number(process.env.API_TIMEOUT_MS || 15_000),
  storeStateMode: process.env.NEXT_PUBLIC_STORE_STATE_MODE === "api" ? ("api" as const) : ("local" as const),
  realCheckoutEnabled: process.env.NEXT_PUBLIC_ENABLE_REAL_CHECKOUT === "true",
} as const;
