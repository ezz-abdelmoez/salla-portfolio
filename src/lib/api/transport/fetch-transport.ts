import type { ApiTransport, RequestOptions } from "./types";
import { ApiError } from "./errors";
import { withQuery } from "./query";

export function createFetchTransport(options: { baseUrl: string; timeoutMs?: number }): ApiTransport {
  return {
    async request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>): Promise<TResponse> {
      const path = withQuery(request.path, request.query);
      const url = `${options.baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs || 15_000);
      const headers = new Headers(request.headers);
      headers.set("Accept", "application/json");
      if (request.body !== undefined) headers.set("Content-Type", "application/json");
      try {
        const response = await fetch(url, {
          method: request.method,
          headers,
          body: request.body === undefined ? undefined : JSON.stringify(request.body),
          credentials: "include",
          signal: request.signal || controller.signal,
          cache: request.cache,
          next: request.next,
        });
        const text = await response.text();
        let decoded: unknown = null;
        if (text) {
          try { decoded = JSON.parse(text); } catch { decoded = { detail: text }; }
        }
        if (!response.ok) {
          const problem = decoded && typeof decoded === "object" ? decoded as Record<string, unknown> : {};
          throw new ApiError({
            status: response.status,
            code: String(problem.code || "HTTP_ERROR"),
            title: String(problem.title || "تعذر إكمال الطلب"),
            detail: typeof problem.detail === "string" ? problem.detail : undefined,
            fields: problem.fields as Record<string, string[]> | undefined,
          });
        }
        return decoded && typeof decoded === "object" && "data" in decoded ? (decoded as { data: TResponse }).data : decoded as TResponse;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error instanceof Error && error.name === "AbortError") {
          throw new ApiError({ status: 408, code: "REQUEST_TIMEOUT", title: "استغرق الطلب وقتًا أطول من المتوقع" });
        }
        throw new ApiError({ status: 0, code: "NETWORK_ERROR", title: "تعذر الاتصال بالخدمة", detail: error instanceof Error ? error.message : undefined });
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
