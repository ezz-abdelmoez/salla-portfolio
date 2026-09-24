export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string[]>;
  detail?: string;

  constructor(params: { status: number; code: string; title: string; detail?: string; fields?: Record<string, string[]> }) {
    super(params.title);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.detail = params.detail;
    this.fields = params.fields;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
