import { z } from "zod";
import type { ApiClient, ApiTransport, RequestOptions } from "../transport/types";
import { ApiError } from "../transport/errors";

function fieldsFromIssues(issues: z.ZodIssue[]) {
  return issues.reduce<Record<string, string[]>>((fields, issue) => {
    const key = issue.path.join(".") || "_root";
    fields[key] = [...(fields[key] || []), issue.message];
    return fields;
  }, {});
}

export function createApiClient(transport: ApiTransport, scope: "storefront" = "storefront"): ApiClient {
  const client: ApiClient = {
    scope,
    async request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>) {
      if (request.requestSchema && request.body !== undefined) {
        const parsedBody = request.requestSchema.safeParse(request.body);
        if (!parsedBody.success) {
          throw new ApiError({ status: 422, code: "INVALID_API_REQUEST", title: "بيانات الطلب غير صالحة", fields: fieldsFromIssues(parsedBody.error.issues) });
        }
      }
      const headers = new Headers(request.headers);
      headers.set("X-Client-Surface", scope);
      let result: unknown;
      try {
        result = await transport.request({ ...request, headers });
      } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError({ status: 500, code: "API_REQUEST_FAILED", title: "تعذر إكمال الطلب", detail: error instanceof Error ? error.message : "Unknown error" });
      }
      if (request.responseSchema) {
        const parsedResponse = request.responseSchema.safeParse(result);
        if (!parsedResponse.success) {
          throw new ApiError({ status: 502, code: "INVALID_API_RESPONSE", title: "البيانات المستلمة غير مطابقة للعقد", detail: parsedResponse.error.message });
        }
        return parsedResponse.data as TResponse;
      }
      return result as TResponse;
    },
    get<TResponse>(path: string, options = {}) {
      return client.request<TResponse>({ ...options, method: "GET", path });
    },
    post<TResponse, TBody>(path: string, body?: TBody, options = {}) {
      return client.request<TResponse, TBody>({ ...options, method: "POST", path, body });
    },
  };
  return client;
}
