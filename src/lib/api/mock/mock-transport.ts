import type { ApiTransport, RequestOptions } from "../transport/types";
import { ApiError } from "../transport/errors";
import { categoryDetailSchema, demoOrderSchema, homeContentSchema, pageResultSchema, reviewSchema, themeDetailSchema, themeSummarySchema } from "../schemas/store";
import { getCategoryDtos, getMockDatabase, getPublishedThemes, resetMockDatabase, themeWithStats } from "./mock-store";
import { categorySchema as categoryItemSchema } from "../schemas/store";
import { createDemoOrderSchema } from "../schemas/store";
import type { CartLineDto, CreateDemoOrderInput, DemoOrderDto } from "../contracts/order";
import type { ThemeFilter } from "../contracts/theme";
import { findDemoOrder, saveDemoOrder } from "../../store-state/mock-order-storage";

const delay = (ms = 90) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value: string) => value.toLocaleLowerCase("ar-SA").normalize("NFKC").trim();

function notFound(path: string): never {
  throw new ApiError({ status: 404, code: "NOT_FOUND", title: "العنصر غير موجود", detail: `No mock resource matches ${path}` });
}

function toPage<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), meta: { page, pageSize, total, totalPages } };
}

function parseFilter(searchParams: URLSearchParams): ThemeFilter {
  const numberOrUndefined = (key: string) => {
    const value = searchParams.get(key);
    return value === null || value === "" ? undefined : Number(value);
  };
  return {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    industry: searchParams.get("industry") || undefined,
    priceType: (searchParams.get("priceType") as ThemeFilter["priceType"]) || undefined,
    minPrice: numberOrUndefined("minPrice"),
    maxPrice: numberOrUndefined("maxPrice"),
    sort: (searchParams.get("sort") as ThemeFilter["sort"]) || "featured",
    status: (searchParams.get("status") as ThemeFilter["status"]) || "published",
    page: numberOrUndefined("page") || 1,
    pageSize: numberOrUndefined("pageSize") || 12,
  };
}

function cartLineFromTheme(theme: ReturnType<typeof getPublishedThemes>[number]): CartLineDto {
  return {
    themeId: theme.id,
    slug: theme.slug,
    name: theme.name,
    coverImage: theme.coverImage,
    price: theme.price,
    currency: "SAR",
  };
}

export function createMockTransport(): ApiTransport {
  return {
    async request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>): Promise<TResponse> {
      await delay();
      const url = new URL(request.path, "http://nasaq.local");
      const path = url.pathname.replace(/\/$/, "") || "/";
      const db = getMockDatabase();

      if (request.method === "GET" && path === "/v1/home/content") {
        return homeContentSchema.parse(db.home) as TResponse;
      }

      if (request.method === "GET" && path === "/v1/categories") {
        return categoryItemSchema.array().parse(getCategoryDtos()) as TResponse;
      }

      const categoryMatch = path.match(/^\/v1\/categories\/([^/]+)$/);
      if (request.method === "GET" && categoryMatch) {
        const category = getCategoryDtos().find((item) => item.slug === decodeURIComponent(categoryMatch[1]));
        if (!category) notFound(path);
        const themes = getPublishedThemes().filter((theme) => theme.categoryId === category.id);
        return categoryDetailSchema.parse({ ...category, themes }) as TResponse;
      }

      if (request.method === "GET" && path === "/v1/themes") {
        const filter = parseFilter(url.searchParams);
        let themes = getPublishedThemes();
        if (filter.search) {
          const q = normalize(filter.search);
          themes = themes.filter((theme) => normalize([
            theme.name, theme.tagline, theme.description, theme.categoryName,
            ...theme.industries, ...theme.styleTags,
          ].join(" ")).includes(q));
        }
        if (filter.category) {
          themes = themes.filter((theme) => theme.categoryId === filter.category || theme.categoryId.endsWith(filter.category!) || theme.slug === filter.category);
        }
        if (filter.industry) {
          const industry = normalize(filter.industry);
          themes = themes.filter((theme) => theme.industries.some((item) => normalize(item).includes(industry)));
        }
        if (filter.priceType) themes = themes.filter((theme) => theme.priceType === filter.priceType);
        if (filter.minPrice !== undefined) themes = themes.filter((theme) => theme.price >= filter.minPrice!);
        if (filter.maxPrice !== undefined) themes = themes.filter((theme) => theme.price <= filter.maxPrice!);

        switch (filter.sort) {
          case "newest": themes.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)); break;
          case "price-asc": themes.sort((a, b) => a.price - b.price); break;
          case "price-desc": themes.sort((a, b) => b.price - a.price); break;
          case "rating": themes.sort((a, b) => b.rating - a.rating); break;
          default: themes.sort((a, b) => Number(b.badges.includes("مميز")) - Number(a.badges.includes("مميز")) || b.lastUpdated.localeCompare(a.lastUpdated));
        }
        const result = toPage(themes, Math.max(1, filter.page || 1), Math.min(48, Math.max(1, filter.pageSize || 12)));
        return pageResultSchema(themeSummarySchema).parse(result) as TResponse;
      }

      const reviewMatch = path.match(/^\/v1\/themes\/([^/]+)\/reviews$/);
      if (request.method === "GET" && reviewMatch) {
        const theme = db.themes.find((item) => item.slug === decodeURIComponent(reviewMatch[1]));
        if (!theme) notFound(path);
        const page = Math.max(1, Number(url.searchParams.get("page") || 1));
        const pageSize = Math.min(20, Math.max(1, Number(url.searchParams.get("pageSize") || 10)));
        const reviews = db.reviews.filter((review) => review.themeId === theme.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return pageResultSchema(reviewSchema).parse(toPage(reviews, page, pageSize)) as TResponse;
      }

      const relatedMatch = path.match(/^\/v1\/themes\/([^/]+)\/related$/);
      if (request.method === "GET" && relatedMatch) {
        const theme = db.themes.find((item) => item.slug === decodeURIComponent(relatedMatch[1]));
        if (!theme) notFound(path);
        const limit = Math.min(8, Math.max(1, Number(url.searchParams.get("limit") || 4)));
        const related = getPublishedThemes().filter((item) => item.id !== theme.id && item.categoryId === theme.categoryId).slice(0, limit);
        return themeSummarySchema.array().parse(related) as TResponse;
      }

      const themeMatch = path.match(/^\/v1\/themes\/([^/]+)$/);
      if (request.method === "GET" && themeMatch) {
        const theme = db.themes.find((item) => item.slug === decodeURIComponent(themeMatch[1]) && item.status === "published");
        if (!theme) notFound(path);
        return themeDetailSchema.parse(themeWithStats(theme)) as TResponse;
      }

      if (request.method === "POST" && path === "/v1/orders/demo") {
        const input = createDemoOrderSchema.parse(request.body) as CreateDemoOrderInput;
        if (!input.acceptedDemoNotice) {
          throw new ApiError({ status: 422, code: "INVALID_API_REQUEST", title: "يلزم تأكيد أن الطلب تجريبي" });
        }
        const themes = getPublishedThemes();
        const selected = [...new Set(input.themeIds)].map((id) => themes.find((theme) => theme.id === id)).filter(Boolean);
        if (selected.length !== new Set(input.themeIds).size) {
          throw new ApiError({ status: 422, code: "INVALID_API_REQUEST", title: "تعذر العثور على أحد الثيمات" });
        }
        if (!selected.length) throw new ApiError({ status: 422, code: "INVALID_API_REQUEST", title: "السلة فارغة" });
        const items = selected.map((theme) => cartLineFromTheme(theme!));
        const order: DemoOrderDto = demoOrderSchema.parse({
          id: `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          status: "demo-only",
          items,
          subtotal: items.reduce((sum, item) => sum + item.price, 0),
          currency: "SAR",
          createdAt: new Date().toISOString(),
          notice: "طلب تجريبي فقط — لم يتم تحصيل أي مبلغ أو تفعيل/تنزيل ثيم.",
        });
        db.orders.set(order.id, order);
        saveDemoOrder(order);
        return order as TResponse;
      }

      const orderMatch = path.match(/^\/v1\/orders\/demo\/([^/]+)$/);
      if (request.method === "GET" && orderMatch) {
        const orderId = decodeURIComponent(orderMatch[1]);
        const order = db.orders.get(orderId) ?? findDemoOrder(orderId);
        if (!order) notFound(path);
        return demoOrderSchema.parse(order) as TResponse;
      }

      notFound(path);
    },
  };
}

export { resetMockDatabase };
