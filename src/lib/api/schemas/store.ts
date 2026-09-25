import { z } from "zod";

export const pageMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export const pageResultSchema = <T extends z.ZodTypeAny>(item: T) => z.object({ items: z.array(item), meta: pageMetaSchema });

export const themeImageSchema = z.object({ src: z.string().startsWith("/themes/"), alt: z.string().min(1), kind: z.enum(["cover", "desktop", "mobile", "detail"]) });
export const themePaletteSchema = z.object({
  background: z.string(), surface: z.string(), primary: z.string(), accent: z.string(), text: z.string(),
});

export const themeSummarySchema = z.object({
  id: z.string(), slug: z.string(), name: z.string(), tagline: z.string(), description: z.string(),
  categoryId: z.string(), categoryName: z.string(), industries: z.array(z.string()), styleTags: z.array(z.string()),
  price: z.number().int().nonnegative(), currency: z.literal("SAR"), priceType: z.enum(["free", "paid"]),
  compareAtPrice: z.number().int().positive().optional(), coverImage: z.string().startsWith("/themes/"),
  gallery: z.array(themeImageSchema).min(1), badges: z.array(z.enum(["جديد", "مميز"])),
  rating: z.number().min(0).max(5), reviewCount: z.number().int().nonnegative(), features: z.array(z.string()),
  supportsRTL: z.boolean(), responsive: z.boolean(), lastUpdated: z.string(), demoPreviewPath: z.string().optional(),
  status: z.enum(["published", "draft"]), previewPalette: themePaletteSchema,
  previewStoreName: z.string(), previewHeadline: z.string(),
});

export const themeDetailSchema = themeSummarySchema.extend({
  longDescription: z.string(),
  featureGroups: z.array(z.object({ title: z.string(), items: z.array(z.string()) })),
  requirements: z.array(z.string()), compatibilityNote: z.string(),
  license: z.object({ title: z.string(), summary: z.string(), terms: z.array(z.string()) }),
  changelog: z.array(z.object({ version: z.string(), date: z.string(), notes: z.array(z.string()) })),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export const categorySchema = z.object({
  id: z.string(), slug: z.string(), name: z.string(), description: z.string(), icon: z.string(),
  image: z.string().startsWith("/themes/"), order: z.number().int(), themeCount: z.number().int().nonnegative(),
});
export const categoryDetailSchema = categorySchema.extend({ themes: z.array(themeSummarySchema) });
export const reviewSchema = z.object({
  id: z.string(), themeId: z.string(), authorName: z.string(), rating: z.number().int().min(1).max(5),
  title: z.string(), body: z.string(), createdAt: z.string(), isDemo: z.boolean(),
});
export const homeContentSchema = z.object({
  eyebrow: z.string(), title: z.string(), subtitle: z.string(),
  primaryCta: z.object({ label: z.string(), href: z.string() }),
  secondaryCta: z.object({ label: z.string(), href: z.string() }),
  benefits: z.array(z.object({ title: z.string(), description: z.string(), icon: z.string() })),
  howItWorks: z.array(z.object({ step: z.number().int(), title: z.string(), description: z.string() })),
  featuredThemeIds: z.array(z.string()), categoryIds: z.array(z.string()),
});
export const cartLineSchema = z.object({
  themeId: z.string(), slug: z.string(), name: z.string(), coverImage: z.string().startsWith("/themes/"),
  price: z.number().int().nonnegative(), currency: z.literal("SAR"),
});
export const cartSchema = z.object({
  items: z.array(cartLineSchema), itemCount: z.number().int().nonnegative(), subtotal: z.number().int().nonnegative(), currency: z.literal("SAR"),
});
export const createDemoOrderSchema = z.object({
  themeIds: z.array(z.string()).min(1), acceptedDemoNotice: z.literal(true),
});
export const demoOrderSchema = z.object({
  id: z.string(), status: z.literal("demo-only"), items: z.array(cartLineSchema).min(1), subtotal: z.number().int().nonnegative(),
  currency: z.literal("SAR"), createdAt: z.string(), notice: z.string(),
});

export type ThemeSummary = z.infer<typeof themeSummarySchema>;
export type ThemeDetail = z.infer<typeof themeDetailSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Review = z.infer<typeof reviewSchema>;
