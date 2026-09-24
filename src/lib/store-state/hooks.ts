"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ThemeSummaryDto } from "../api/contracts/theme";
import { cartKeys, favoritesKeys } from "./keys";
import { addToCart, clearCart, getCart, removeFromCart } from "./cart-repository";
import { getFavoriteIds, toggleFavorite } from "./favorites-repository";

export function useCart() {
  return useQuery({ queryKey: cartKeys.root(), queryFn: getCart, staleTime: 0, refetchOnWindowFocus: true });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (theme: ThemeSummaryDto) => addToCart(theme),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.root(), cart),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (themeId: string) => removeFromCart(themeId),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.root(), cart),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => clearCart(),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.root(), cart),
  });
}

export function useFavorites() {
  return useQuery({ queryKey: favoritesKeys.root(), queryFn: getFavoriteIds, staleTime: 0, refetchOnWindowFocus: true });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (themeId: string) => toggleFavorite(themeId),
    onSuccess: (ids) => queryClient.setQueryData(favoritesKeys.root(), ids),
  });
}
