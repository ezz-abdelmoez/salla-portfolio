"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 2,
        retryDelay: (attempt) => Math.min(800 * 2 ** attempt, 10_000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
        throwOnError: false,
      },
      mutations: {
        retry: 0,
        throwOnError: false,
        onError: (error) => console.error("Store mutation error:", error),
      },
    },
  }));
  return <QueryClientProvider client={client}>{children}<ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider>;
}
