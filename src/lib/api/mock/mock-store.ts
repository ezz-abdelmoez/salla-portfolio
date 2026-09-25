import homeFixture from "./fixtures/home.json";
import categoriesFixture from "./fixtures/categories.json";
import themesFixture from "./fixtures/themes.json";
import reviewsFixture from "./fixtures/reviews.json";
import {
  categorySchema,
  demoOrderSchema,
  homeContentSchema,
  reviewSchema,
  themeDetailSchema,
  type ThemeDetail,
} from "../schemas/store";
import type { CategoryDto } from "../contracts/category";
import type { HomeContentDto } from "../contracts/home";
import type { ReviewDto } from "../contracts/review";
import type { DemoOrderDto } from "../contracts/order";

export type MockDatabase = {
  home: HomeContentDto;
  categories: CategoryDto[];
  themes: ThemeDetail[];
  reviews: ReviewDto[];
  orders: Map<string, DemoOrderDto>;
};

type MockGlobal = typeof globalThis & { __nasaqMockDatabase?: MockDatabase };

function seedDatabase(): MockDatabase {
  return {
    home: homeContentSchema.parse(homeFixture),
    categories: categoriesFixture.map((item) => categorySchema.parse(item)),
    themes: themesFixture.map((item) => themeDetailSchema.parse(item)),
    reviews: reviewsFixture.map((item) => reviewSchema.parse(item)),
    orders: new Map(),
  };
}

export function getMockDatabase() {
  const root = globalThis as MockGlobal;
  if (!root.__nasaqMockDatabase) root.__nasaqMockDatabase = seedDatabase();
  return root.__nasaqMockDatabase;
}

export function resetMockDatabase() {
  const root = globalThis as MockGlobal;
  root.__nasaqMockDatabase = seedDatabase();
}

export function themeWithStats(theme: ThemeDetail) {
  const reviews = getMockDatabase().reviews.filter((review) => review.themeId === theme.id);
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return { ...theme, rating: Math.round(average * 10) / 10, reviewCount: reviews.length };
}

export function getCategoryDtos() {
  const db = getMockDatabase();
  return db.categories
    .map((category) => ({
      ...category,
      themeCount: db.themes.filter((theme) => theme.categoryId === category.id && theme.status === "published").length,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getPublishedThemes() {
  return getMockDatabase().themes
    .filter((theme) => theme.status === "published")
    .map(themeWithStats);
}

export function parseDemoOrder(value: unknown) {
  return demoOrderSchema.parse(value);
}
