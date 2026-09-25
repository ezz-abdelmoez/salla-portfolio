"use client";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { storefrontApi } from "../../browser-client";
import type { CreateDemoOrderInput } from "../../contracts/order";
import { createOrderEndpoints } from "./endpoint";
import { orderKeys } from "./keys";

const orderApi = createOrderEndpoints(storefrontApi);
export function useCreateDemoOrder() {
  return useMutation({ mutationFn: (input: CreateDemoOrderInput) => orderApi.createDemo(input) });
}
export function useDemoOrder(orderId: string) {
  return useQuery(queryOptions({ queryKey: orderKeys.demo(orderId), queryFn: () => orderApi.getDemo(orderId), enabled: Boolean(orderId), retry: false }));
}
