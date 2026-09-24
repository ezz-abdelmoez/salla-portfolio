import type { ApiClient } from "../../transport/types";
import { pageResultSchema, reviewSchema, themeDetailSchema, themeSummarySchema } from "../../schemas/store";
import type { PageResult } from "../../contracts/common";
import type { ReviewDto } from "../../contracts/review";
import type { ThemeDetailDto, ThemeFilter, ThemeSummaryDto } from "../../contracts/theme";
import { withQuery } from "../../transport/query";

function filterQuery(filter: ThemeFilter = {}) {
  return {
    search: filter.search,
    category: filter.category,
    industry: filter.industry,
    priceType: filter.priceType,
    minPrice: filter.minPrice,
    maxPrice: filter.maxPrice,
    sort: filter.sort || "featured",
    page: filter.page || 1,
    pageSize: filter.pageSize || 12,
    status: filter.status || "published",
  };
}

export function createThemeEndpoints(client: ApiClient) {
  return {
    list: (filter: ThemeFilter = {}) => client.get<PageResult<ThemeSummaryDto>>(withQuery("/v1/themes", filterQuery(filter)), { responseSchema: pageResultSchema(themeSummarySchema) }),
    get: (slug: string) => client.get<ThemeDetailDto>(`/v1/themes/${encodeURIComponent(slug)}`, { responseSchema: themeDetailSchema }),
    reviews: (slug: string, page = 1, pageSize = 10) => client.get<PageResult<ReviewDto>>(withQuery(`/v1/themes/${encodeURIComponent(slug)}/reviews`, { page, pageSize }), { responseSchema: pageResultSchema(reviewSchema) }),
    related: (slug: string, limit = 4) => client.get<ThemeSummaryDto[]>(withQuery(`/v1/themes/${encodeURIComponent(slug)}/related`, { limit }), { responseSchema: themeSummarySchema.array() }),
  };
}

export function normalizedFilter(filter: ThemeFilter = {}) {
  return Object.fromEntries(Object.entries(filter).filter(([, value]) => value !== undefined && value !== "").sort(([a], [b]) => a.localeCompare(b)));
}
