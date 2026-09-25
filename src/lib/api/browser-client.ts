import { apiConfig } from "./config";
import { createApiClient } from "./client/api-client";
import { createFetchTransport } from "./transport/fetch-transport";
import { createMockTransport } from "./mock/mock-transport";

const transport = apiConfig.mode === "mock"
  ? createMockTransport()
  : createFetchTransport({ baseUrl: apiConfig.browserBasePath, timeoutMs: apiConfig.timeoutMs });

export const storefrontApi = createApiClient(transport, "storefront");
