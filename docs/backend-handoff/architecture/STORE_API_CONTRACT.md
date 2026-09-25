# عقد API — نَسَق

جميع المسارات أدناه مستقبلية ما لم يذكر أنها mock-only. واجهة المستخدم تتعامل مع endpoint factories وZod schemas، لا مع fixtures أو transport مباشرة.

| Method | Path | Request | Response | حالة v1 |
|---|---|---|---|---|
| GET | `/v1/home/content` | — | `HomeContentDto` | mock + قابل لـHTTP |
| GET | `/v1/categories` | — | `CategoryDto[]` | mock + قابل لـHTTP |
| GET | `/v1/categories/:slug` | — | `CategoryDetailDto` | mock + قابل لـHTTP |
| GET | `/v1/themes` | `search, category, industry, priceType, minPrice, maxPrice, sort, page, pageSize` | `PageResult<ThemeSummaryDto>` | mock + قابل لـHTTP |
| GET | `/v1/themes/:slug` | — | `ThemeDetailDto` | mock + قابل لـHTTP |
| GET | `/v1/themes/:slug/reviews` | `page, pageSize` | `PageResult<ReviewDto>` | mock + قابل لـHTTP؛ reviews تجريبية |
| GET | `/v1/themes/:slug/related` | `limit` | `ThemeSummaryDto[]` | mock + قابل لـHTTP |
| POST | `/v1/orders/demo` | `CreateDemoOrderInput` | `DemoOrderDto` | mock-only؛ لا دفع |
| GET | `/v1/orders/demo/:id` | — | `DemoOrderDto` | mock-only؛ بيانات الجلسة الحالية |

## أمثلة أنواع أساسية

```ts
type CurrencyCode = "SAR";
type ThemePriceType = "free" | "paid";
type ThemeSort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

type PageMeta = { page: number; pageSize: number; total: number; totalPages: number };
type PageResult<T> = { items: T[]; meta: PageMeta };

type CreateDemoOrderInput = { themeIds: string[]; acceptedDemoNotice: true };
type DemoOrderDto = {
  id: string;
  status: "demo-only";
  items: CartLineDto[];
  subtotal: number;
  currency: "SAR";
  createdAt: string;
  notice: string;
};
```

لكل DTO schema مطابق في `src/lib/api/schemas/store.ts`. الطلب التجريبي لا يقبل بيانات شخصية أو معلومات دفع. عند ظهور checkout حقيقي يجب إنشاء عقد جديد موثق وتفعيله على الخادم فقط بعد مراجعة الأمان.
