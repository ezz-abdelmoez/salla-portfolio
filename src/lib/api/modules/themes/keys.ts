import type { ThemeFilter } from "../../contracts/theme";
import { normalizedFilter } from "./endpoint";

export const themeKeys = {
  all: ["themes"] as const,
  lists: () => [...themeKeys.all, "list"] as const,
  list: (filter: ThemeFilter = {}) => [...themeKeys.lists(), normalizedFilter(filter)] as const,
  detail: (slug: string) => [...themeKeys.all, "detail", slug] as const,
  reviews: (slug: string, page = 1) => [...themeKeys.detail(slug), "reviews", page] as const,
  related: (slug: string) => [...themeKeys.detail(slug), "related"] as const,
};
