import { z } from "zod";
import { safeRead, safeWrite } from "./storage";

const FAVORITES_KEY = "nasaq-favorites-v1";
const favoritesSchema = z.array(z.string()).max(1000);

export function getFavoriteIds() {
  return safeRead(FAVORITES_KEY, favoritesSchema, [] as string[]);
}

export function toggleFavorite(themeId: string) {
  const current = getFavoriteIds();
  const next = current.includes(themeId) ? current.filter((id) => id !== themeId) : [...current, themeId];
  safeWrite(FAVORITES_KEY, next);
  return next;
}

export function removeFavorite(themeId: string) {
  const next = getFavoriteIds().filter((id) => id !== themeId);
  safeWrite(FAVORITES_KEY, next);
  return next;
}
