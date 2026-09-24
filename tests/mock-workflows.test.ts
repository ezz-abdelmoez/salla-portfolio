import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "../src/lib/api/client/api-client";
import { createMockTransport, resetMockDatabase } from "../src/lib/api/mock/mock-transport";
import { createHomeEndpoints } from "../src/lib/api/modules/home/endpoint";
import { createCategoryEndpoints } from "../src/lib/api/modules/categories/endpoint";
import { createThemeEndpoints } from "../src/lib/api/modules/themes/endpoint";
import { createOrderEndpoints } from "../src/lib/api/modules/orders/endpoint";
import { createDemoOrderSchema, themeDetailSchema } from "../src/lib/api/schemas/store";
import { ApiError } from "../src/lib/api/transport/errors";
import { addToCart, clearCart, getCart, removeFromCart } from "../src/lib/store-state/cart-repository";
import { getFavoriteIds, toggleFavorite } from "../src/lib/store-state/favorites-repository";

function makeClient() {
  return createApiClient(createMockTransport(), "storefront");
}

function stubLocalStorage(seed: Record<string, string> = {}) {
  const data = new Map(Object.entries(seed));
  const localStorage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, String(value)); },
    removeItem: (key: string) => { data.delete(key); },
    clear: () => data.clear(),
  };
  vi.stubGlobal("window", { localStorage });
  return data;
}

beforeEach(() => {
  resetMockDatabase();
  vi.unstubAllGlobals();
});

describe("mock-first store workflows", () => {
  it("loads Arabic home content and real fixture references", async () => {
    const home = await createHomeEndpoints(makeClient()).getContent();
    expect(home.title).toContain("متجرك");
    expect(home.benefits.length).toBeGreaterThanOrEqual(4);
    expect(home.featuredThemeIds).toContain("theme-leen");
  });

  it("returns categories with counts computed from the published theme fixtures", async () => {
    const categories = await createCategoryEndpoints(makeClient()).list();
    expect(categories.length).toBe(6);
    expect(categories[0].order).toBe(1);
    expect(categories.find((category) => category.slug === "fashion")?.themeCount).toBe(2);
    expect(categories.reduce((sum, category) => sum + category.themeCount, 0)).toBe(10);
  });

  it("searches and filters the theme catalogue with pagination metadata", async () => {
    const api = createThemeEndpoints(makeClient());
    const all = await api.list({ page: 1, pageSize: 20 });
    expect(all.meta.total).toBe(10);
    expect(all.items).toHaveLength(10);

    const arabicSearch = await api.list({ search: "عبايات", pageSize: 12 });
    expect(arabicSearch.items.map((theme) => theme.slug)).toContain("leen");

    const fashion = await api.list({ category: "fashion", pageSize: 12 });
    expect(fashion.items.map((theme) => theme.slug).sort()).toEqual(["leen", "tibr"]);

    const free = await api.list({ priceType: "free", pageSize: 12 });
    expect(free.items.map((theme) => theme.slug).sort()).toEqual(["nada", "qahwa"]);

    const lowPrice = await api.list({ maxPrice: 250, sort: "price-asc", page: 1, pageSize: 1 });
    expect(lowPrice.items).toHaveLength(1);
    expect(lowPrice.meta.total).toBe(4);
    expect(lowPrice.meta.totalPages).toBe(4);
    expect(lowPrice.items[0].price).toBe(0);
  });

  it("loads a theme detail and returns a structured 404 for an unknown slug", async () => {
    const api = createThemeEndpoints(makeClient());
    const theme = await api.get("leen");
    expect(theme.name).toBe("لِين");
    expect(theme.license.terms.length).toBeGreaterThan(0);

    const wameed = await api.get("wameed");
    expect(wameed.name).toBe("وَميض");
    expect(wameed.description).toContain("مسودة");
    expect(wameed.compatibilityNote).toContain("غير مرتبطة بحساب شريك سلة");

    await expect(api.get("not-a-theme")).rejects.toMatchObject({ status: 404, code: "NOT_FOUND" });
  });

  it("derives rating and review count from the demo review fixtures", async () => {
    const theme = await createThemeEndpoints(makeClient()).get("mada");
    expect(theme.rating).toBe(4.5);
    expect(theme.reviewCount).toBe(2);
    const page = await createThemeEndpoints(makeClient()).reviews("mada");
    expect(page.items.every((review) => review.isDemo)).toBe(true);
  });

  it("uses local-only image paths for categories and theme gallery images", async () => {
    const [categories, themes] = await Promise.all([
      createCategoryEndpoints(makeClient()).list(),
      createThemeEndpoints(makeClient()).list({ pageSize: 48 }),
    ]);
    expect(categories.every((item) => item.image.startsWith("/themes/"))).toBe(true);
    expect(themes.items.every((item) => item.coverImage.startsWith("/themes/") && item.gallery.every((image) => image.src.startsWith("/themes/")))).toBe(true);
  });

  it("adds, deduplicates, removes, clears, and restores cart state from localStorage", async () => {
    stubLocalStorage();
    const theme = (await createThemeEndpoints(makeClient()).get("leen"));
    const first = addToCart(theme);
    expect(first.items).toHaveLength(1);
    expect(first.subtotal).toBe(theme.price);
    expect(addToCart(theme).items).toHaveLength(1);
    expect(getCart().itemCount).toBe(1);
    expect(removeFromCart(theme.id).items).toHaveLength(0);
    addToCart(theme);
    expect(clearCart().subtotal).toBe(0);
  });

  it("toggles favorites and safely resets corrupted local state", () => {
    const data = stubLocalStorage({ "nasaq-favorites-v1": "not-json" });
    expect(getFavoriteIds()).toEqual([]);
    expect(data.has("nasaq-favorites-v1")).toBe(false);
    expect(toggleFavorite("theme-leen")).toEqual(["theme-leen"]);
    expect(toggleFavorite("theme-leen")).toEqual([]);
  });

  it("creates a clearly demo-only order without payment or personal data fields", async () => {
    const api = createOrderEndpoints(makeClient());
    const order = await api.createDemo({ themeIds: ["theme-leen", "theme-nada"], acceptedDemoNotice: true });
    expect(order.status).toBe("demo-only");
    expect(order.subtotal).toBe(279);
    expect(order.notice).toContain("لم يتم تحصيل");
    expect(order).not.toHaveProperty("paymentToken");
    expect(order).not.toHaveProperty("customerEmail");
    expect(await api.getDemo(order.id)).toEqual(order);
  });

  it("rejects invalid requests and response-contract violations", async () => {
    const api = makeClient();
    await expect(api.post("/v1/orders/demo", { themeIds: [], acceptedDemoNotice: true }, { requestSchema: createDemoOrderSchema })).rejects.toMatchObject({ code: "INVALID_API_REQUEST", status: 422 });

    const brokenClient = createApiClient({ request: async () => ({} as never) });
    await expect(brokenClient.get("/v1/themes/leen", { responseSchema: themeDetailSchema })).rejects.toMatchObject({ code: "INVALID_API_RESPONSE", status: 502 });
  });

  it("returns an empty result for an unmatched search", async () => {
    const result = await createThemeEndpoints(makeClient()).list({ search: "كلمة غير موجودة", pageSize: 9 });
    expect(result.items).toEqual([]);
    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
  });

  it("rejects an unapproved demo checkout", async () => {
    const api = createOrderEndpoints(makeClient());
    await expect(api.createDemo({ themeIds: ["theme-leen"], acceptedDemoNotice: false } as never)).rejects.toBeInstanceOf(ApiError);
  });
});
