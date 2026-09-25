"use client";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { storefrontApi } from "../../browser-client";
import type { ThemeFilter } from "../../contracts/theme";
import { createThemeEndpoints } from "./endpoint";
import { themeKeys } from "./keys";

const themeApi = createThemeEndpoints(storefrontApi);
export const themeQueries = {
  list: (filter: ThemeFilter = {}) => queryOptions({ queryKey: themeKeys.list(filter), queryFn: () => themeApi.list(filter), placeholderData: keepPreviousData, staleTime: 60_000 }),
  detail: (slug: string) => queryOptions({ queryKey: themeKeys.detail(slug), queryFn: () => themeApi.get(slug), enabled: Boolean(slug), staleTime: 60_000 }),
  reviews: (slug: string, page = 1) => queryOptions({ queryKey: themeKeys.reviews(slug, page), queryFn: () => themeApi.reviews(slug, page), enabled: Boolean(slug), staleTime: 60_000 }),
  related: (slug: string) => queryOptions({ queryKey: themeKeys.related(slug), queryFn: () => themeApi.related(slug), enabled: Boolean(slug), staleTime: 60_000 }),
};
export function useThemes(filter: ThemeFilter = {}, initialData?: import("../../contracts/common").PageResult<import("../../contracts/theme").ThemeSummaryDto>) { return useQuery({ ...themeQueries.list(filter), initialData }); }
export function useTheme(slug: string, initialData?: import("../../contracts/theme").ThemeDetailDto) { return useQuery({ ...themeQueries.detail(slug), initialData }); }
export function useThemeReviews(slug: string, page = 1) { return useQuery(themeQueries.reviews(slug, page)); }
export function useRelatedThemes(slug: string) { return useQuery(themeQueries.related(slug)); }
