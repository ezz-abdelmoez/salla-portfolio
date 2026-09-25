"use client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { storefrontApi } from "../../browser-client";
import { createHomeEndpoints } from "./endpoint";
import { homeKeys } from "./keys";

const homeApi = createHomeEndpoints(storefrontApi);
export const homeQueries = {
  content: () => queryOptions({ queryKey: homeKeys.content(), queryFn: homeApi.getContent, staleTime: 60_000 }),
};
export function useHomeContent(initialData?: import("../../contracts/home").HomeContentDto) { return useQuery({ ...homeQueries.content(), initialData }); }
