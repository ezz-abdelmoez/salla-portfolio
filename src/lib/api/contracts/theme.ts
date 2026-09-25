import type { CurrencyCode, ListFilter } from "./common";

export type ThemeSort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";
export type ThemePriceType = "free" | "paid";
export type ThemeBadge = "جديد" | "مميز";
export type ThemeImageKind = "cover" | "desktop" | "mobile" | "detail";
export type ThemeStatus = "published" | "draft";

export interface ThemeImageDto {
  src: string;
  alt: string;
  kind: ThemeImageKind;
}

export interface ThemePaletteDto {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
}

export interface ThemeSummaryDto {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categoryId: string;
  categoryName: string;
  industries: string[];
  styleTags: string[];
  price: number;
  currency: CurrencyCode;
  priceType: ThemePriceType;
  compareAtPrice?: number;
  coverImage: string;
  gallery: ThemeImageDto[];
  badges: ThemeBadge[];
  rating: number;
  reviewCount: number;
  features: string[];
  supportsRTL: boolean;
  responsive: boolean;
  lastUpdated: string;
  demoPreviewPath?: string;
  status: ThemeStatus;
  previewPalette: ThemePaletteDto;
  previewStoreName: string;
  previewHeadline: string;
}

export interface ThemeDetailDto extends ThemeSummaryDto {
  longDescription: string;
  featureGroups: { title: string; items: string[] }[];
  requirements: string[];
  compatibilityNote: string;
  license: { title: string; summary: string; terms: string[] };
  changelog: { version: string; date: string; notes: string[] }[];
  faq: { question: string; answer: string }[];
}

export interface ThemeFilter extends ListFilter {
  category?: string;
  industry?: string;
  priceType?: ThemePriceType;
  minPrice?: number;
  maxPrice?: number;
  sort?: ThemeSort;
  status?: ThemeStatus;
}
