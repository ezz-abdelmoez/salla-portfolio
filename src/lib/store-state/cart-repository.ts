import { z } from "zod";
import type { CartDto, CartLineDto } from "../api/contracts/order";
import type { ThemeSummaryDto } from "../api/contracts/theme";
import { cartSchema } from "../api/schemas/store";
import { safeRead, safeWrite } from "./storage";

const CART_KEY = "nasaq-cart-v1";
const emptyCart: CartDto = { items: [], itemCount: 0, subtotal: 0, currency: "SAR" };
const storedCartSchema = z.object({ items: z.array(cartSchema.shape.items.element) });

function buildCart(items: CartLineDto[]): CartDto {
  return { items, itemCount: items.length, subtotal: items.reduce((sum, item) => sum + item.price, 0), currency: "SAR" };
}

export function getCart(): CartDto {
  const saved = safeRead(CART_KEY, storedCartSchema, { items: [] });
  return cartSchema.parse(buildCart(saved.items));
}

export function addToCart(theme: ThemeSummaryDto): CartDto {
  const current = getCart();
  if (current.items.some((item) => item.themeId === theme.id)) return current;
  const item: CartLineDto = { themeId: theme.id, slug: theme.slug, name: theme.name, coverImage: theme.coverImage, price: theme.price, currency: "SAR" };
  const next = buildCart([...current.items, item]);
  safeWrite(CART_KEY, { items: next.items });
  return next;
}

export function removeFromCart(themeId: string): CartDto {
  const next = buildCart(getCart().items.filter((item) => item.themeId !== themeId));
  safeWrite(CART_KEY, { items: next.items });
  return next;
}

export function clearCart(): CartDto {
  safeWrite(CART_KEY, { items: [] });
  return emptyCart;
}
