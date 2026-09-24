"use client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { storefrontApi } from "../../browser-client";
import { createCategoryEndpoints } from "./endpoint";
import { categoryKeys } from "./keys";

const categoryApi = createCategoryEndpoints(storefrontApi);
export const categoryQueries = {
  list: () => queryOptions({ queryKey: categoryKeys.lists(), queryFn: categoryApi.list, staleTime: 60_000 }),
  detail: (slug: string) => queryOptions({ queryKey: categoryKeys.detail(slug), queryFn: () => categoryApi.get(slug), enabled: Boolean(slug), staleTime: 60_000 }),
};
export function useCategories(initialData?: import("../../contracts/category").CategoryDto[]) { return useQuery({ ...categoryQueries.list(), initialData }); }
export function useCategory(slug: string) { return useQuery(categoryQueries.detail(slug)); }
