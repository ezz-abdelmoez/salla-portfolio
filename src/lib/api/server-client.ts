import "server-only";
import { apiConfig } from "./config";
import { createApiClient } from "./client/api-client";
import { createFetchTransport } from "./transport/fetch-transport";
import { createMockTransport } from "./mock/mock-transport";

export function createServerApiClient() {
  const transport = apiConfig.mode === "mock"
    ? createMockTransport()
    : createFetchTransport({ baseUrl: apiConfig.serverOrigin || apiConfig.browserBasePath, timeoutMs: apiConfig.timeoutMs });
  return createApiClient(transport, "storefront");
}
