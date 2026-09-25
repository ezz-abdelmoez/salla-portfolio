import type { CurrencyCode } from "./common";

export interface CartLineDto {
  themeId: string;
  slug: string;
  name: string;
  coverImage: string;
  price: number;
  currency: CurrencyCode;
}

export interface CartDto {
  items: CartLineDto[];
  itemCount: number;
  subtotal: number;
  currency: CurrencyCode;
}

export interface CreateDemoOrderInput {
  themeIds: string[];
  acceptedDemoNotice: true;
}

export interface DemoOrderDto {
  id: string;
  status: "demo-only";
  items: CartLineDto[];
  subtotal: number;
  currency: CurrencyCode;
  createdAt: string;
  notice: string;
}
