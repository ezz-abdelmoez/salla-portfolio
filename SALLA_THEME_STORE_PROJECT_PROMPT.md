# FULL PROJECT PROMPT — منصة نَسَق | متجر ثيمات لمنصة سلة السعودية

> **طريقة الاستخدام**  
> انسخ كل ما بعد هذا الفاصل إلى مساعد البرمجة الذي تستخدمه (Cursor / Windsurf / Claude Code / ChatGPT) باعتباره مواصفات المشروع كاملة. اقرأ الملف كله قبل كتابة الكود، ونفّذ المراحل بالترتيب. لا تتجاوز بوابة أي مرحلة قبل اجتيازها.
>
> هذا البرومبت يحافظ على معمارية **Mock-first API** الموجودة في المرجع، لكنه يستبدل منتج التعليم بالكامل بمتجر عربي لثيمات متاجر سلة.

---

# 1. الدور والمهمة

أنت تبني **«نَسَق»** — متجرًا عربيًا مستقلًا لعرض وبيع ثيمات متاجر التجارة الإلكترونية الموجّهة للتجّار في السعودية الذين يستخدمون منصة سلة.

**الشعار المقترح:** «ثيم يليق بمتجرك.»  
**الجمهور:** أصحاب المتاجر الصغيرة والمتوسطة، وروّاد الأعمال والمصممون في السعودية والخليج.  
**اللغة والاتجاه:** العربية أولًا، RTL افتراضيًا، مع دعم المصطلحات والروابط الإنجليزية عند الحاجة.  
**العملة:** الريال السعودي `SAR`، مع تنسيق الأسعار باستخدام `Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" })`.

يجب أن يبدو المنتج متجرًا حقيقيًا ومنظمًا لمنتجات رقمية: تصفّح الثيمات، البحث والتصفية، صفحة تفاصيل واضحة، معرض معاينات، قائمة مفضلة، سلة، وتجربة طلب تجريبي كاملة من البداية إلى النهاية.

## حدود النسخة الأولى — إلزامية

- **Frontend فقط:** لا قاعدة بيانات، ولا خادم إنتاجي، ولا بوابة دفع، ولا تسجيل دخول حقيقي، ولا اتصال فعلي بـ Salla أو بأي API خارجي.
- كل بيانات الثيمات والتصنيفات والتقييمات تأتي من fixtures محلية، وتمر عبر طبقة API mock. ممنوع أن تستورد مكوّنات الواجهة ملفات JSON مباشرة.
- السلة والمفضلة تحفظان محليًا في `localStorage` عبر repository مستقل وقابل للاستبدال لاحقًا.
- زر إتمام الطلب ينشئ **طلبًا تجريبيًا فقط**. لا تجمع بيانات بطاقة بنكية، ولا تدّعِ أن عملية دفع أو شراء أو تفعيل ثيم حقيقية قد تمت. وضّح ذلك للمستخدم قبل التأكيد وبعده.
- لا تنشئ ملفات ثيمات قابلة للتنزيل على أنها منتجات حقيقية إذا لم تكن موجودة. يمكن عرض معاينات محلية وبيانات تجريبية، مع تسمية واضحة بأن الشراء والتنزيل غير مفعّلين في النسخة التجريبية.
- لا تستخدم شعار سلة الرسمي أو أصولها أو واجهاتها بطريقة توحي بأن «نَسَق» تابع لسلة أو معتمد منها. أضف تنويهًا مناسبًا في التذييل: **«نَسَق متجر مستقل، وليس تابعًا لمنصة سلة أو ممثلًا لها.»** لا تصف أي ثيم بأنه «معتمد رسميًا» إلا إذا أُضيف لاحقًا إثبات وموافقة حقيقية.
- لا تخترع endpoints أو شروطًا رسمية لـ Salla. أي تكامل أو اعتماد مستقبلي يجب التحقق منه من وثائق سلة الرسمية قبل تنفيذه.

## معمارية البيانات المطلوبة

```txt
UI
 ↓  (TanStack Query hooks / server functions)
Endpoint Factory  (typed operations + Zod request/response validation)
 ↓
Transport         (mock transport  ←→  fetch transport)
 ↓
Contract + Schema + Local Fixture  →  future REST API
```

تبديل بيانات الكتالوج من mock إلى HTTP يتم عبر متغير البيئة فقط، من دون تعديل مكوّنات الواجهة. أمّا الدفع الحقيقي فيبقى **معطّلًا صراحةً** إلى أن يُبنى backend وتُدمج بوابة دفع معتمدة؛ تغيير `API_MODE` لا يفعّل الدفع الحقيقي.

---

# 2. التقنية المطلوبة

استخدم الحزم التالية، ولا تضف بدائل غير لازمة:

| المجال | الحزم | ملاحظات |
|---|---|---|
| الإطار | `next` 15+ (App Router) | TypeScript افتراضيًا |
| اللغة | `typescript` ^5 | `strict: true` |
| الواجهة | `react` 19 + `react-dom` 19 | |
| التنسيق | `tailwindcss` ^4 + `@tailwindcss/postcss` + `tw-animate-css` | CSS-first |
| مكونات الواجهة | shadcn/ui، إعداد `new-york`، `rsc: true`، `tsx: true`، `baseColor: neutral`، CSS variables | أضف فقط المكونات المستخدمة |
| الأيقونات | `lucide-react` | لا تستخدم رموز emoji كبديل للأيقونات الأساسية |
| جلب البيانات | `@tanstack/react-query` ^5 + `@tanstack/react-query-devtools` | مطلوب |
| التحقق | `zod` ^3.24 | لعقود الطلب والاستجابة وfixtures |
| النماذج | `react-hook-form` ^7 + `@hookform/resolvers` | لنموذج التواصل/الطلب التجريبي عند الحاجة |
| الثيم | `next-themes` | light/dark/system |
| الإشعارات | `sonner` | |
| البحث | `use-debounce` | تأخير البحث أثناء الكتابة |
| المساعدات | `clsx`, `tailwind-merge`, `class-variance-authority`, `date-fns` | |
| HTTP | `fetch` الأصلي | طبقة النقل فقط؛ لا `fetch` داخل المكونات |
| الاختبارات | `vitest` ^4 + `@types/node` | اختبارات mock workflow |
| مدير الحزم | `pnpm` | |

**لا تستخدم:** Express، NestJS، قاعدة بيانات، Prisma، Firebase، Supabase، tRPC، أو أي CSS framework غير Tailwind. لا تربط بوابة دفع أو Salla API في النسخة الأولى.

## 2.1 إعداد المشروع — نفّذ أولًا

```bash
pnpm create next-app@latest nasaq-salla-themes \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
cd nasaq-salla-themes
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge breadcrumb skeleton tabs accordion dialog sheet
pnpm dlx shadcn@latest add checkbox select input label form separator dropdown-menu tooltip
pnpm add @tanstack/react-query @tanstack/react-query-devtools zod next-themes sonner lucide-react
pnpm add react-hook-form @hookform/resolvers use-debounce date-fns
pnpm add -D vitest @types/node
```

في إعداد shadcn استخدم `new-york` و`neutral` وCSS variables. لا تثبّت مكونات لا تحتاجها.

## 2.2 أوامر `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test:mock": "vitest run tests/mock-workflows.test.ts"
  }
}
```

## 2.3 مسارات `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/lib/api/*": ["./src/lib/api/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/constants/*": ["./src/constants/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

## 2.4 PostCSS وTailwind 4

`postcss.config.mjs`:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

يبدأ `app/globals.css` بـ:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-ibm-plex-arabic), Tahoma, Arial, ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace;
  /* اربط بقية tokens بمتغيرات ألوان :root و.dark */
}
```

## 2.5 `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // لا تتجاهل أخطاء TypeScript.
  images: { unoptimized: true }
};

export default nextConfig;
```

استخدم `next/font/google` لخط `IBM Plex Sans Arabic` وخط لاتيني/أحادي مناسب عند توفر الاتصال. إذا تعذّر جلب الخط أثناء البناء، استخدم fallback محليًا من دون كسر البناء.

---

# 3. إعداد البيئة

أنشئ `.env.example`:

```dotenv
# mock = بيانات العرض المحلية، http = API مستقبلي للكتالوج
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_PATH=/api

# إعدادات مستقبلية للخادم فقط؛ لا تكشف أسرارًا عبر NEXT_PUBLIC_
API_INTERNAL_URL=http://localhost:5067
API_TIMEOUT_MS=15000

# حالة السلة/المفضلة محلية في النسخة الأولى
NEXT_PUBLIC_STORE_STATE_MODE=local

# الدفع الحقيقي ممنوع في النسخة التجريبية
NEXT_PUBLIC_ENABLE_REAL_CHECKOUT=false
```

`src/lib/api/config.ts`:

```ts
export type ApiMode = "mock" | "http";
export type StoreStateMode = "local" | "api";

export const apiConfig = {
  mode: process.env.NEXT_PUBLIC_API_MODE === "http" ? ("http" as const) : ("mock" as const),
  browserBasePath: process.env.NEXT_PUBLIC_API_BASE_PATH || "/api",
  serverOrigin: process.env.API_INTERNAL_URL || "",
  timeoutMs: Number(process.env.API_TIMEOUT_MS || 15_000),
  storeStateMode: process.env.NEXT_PUBLIC_STORE_STATE_MODE === "api" ? ("api" as const) : ("local" as const),
  realCheckoutEnabled: process.env.NEXT_PUBLIC_ENABLE_REAL_CHECKOUT === "true"
} as const;
```

لا تعرض واجهة دفع حقيقية ولا حقول بطاقات. إذا أصبحت `realCheckoutEnabled` true مستقبلًا، ارفض تفعيلها في الواجهة ما لم توجد خدمة backend موثّقة ومراجعة أمنيًا.

---

# 4. بنية الملفات المستهدفة

```txt
nasaq-salla-themes/
├── .env.example
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── pnpm-lock.yaml
├── tsconfig.json
│
├── app/
│   ├── globals.css
│   ├── layout.tsx                          # html lang="ar" dir="rtl" + providers + metadata
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── (store)/
│       ├── layout.tsx                      # header + footer + main container
│       ├── page.tsx                        # الصفحة الرئيسية
│       ├── themes/
│       │   ├── page.tsx                    # الكتالوج والبحث والفلاتر
│       │   └── [slug]/
│       │       ├── page.tsx                # تفاصيل الثيم
│       │       ├── loading.tsx
│       │       └── not-found.tsx
│       ├── categories/
│       │   ├── page.tsx                    # كل التصنيفات
│       │   └── [slug]/page.tsx             # ثيمات التصنيف
│       ├── favorites/page.tsx
│       ├── cart/page.tsx
│       ├── checkout/page.tsx               # تجربة طلب تجريبية فقط
│       ├── orders/[orderId]/page.tsx        # تأكيد الطلب التجريبي
│       ├── about/page.tsx
│       ├── faq/page.tsx
│       └── contact/page.tsx
│
├── public/
│   └── themes/
│       ├── leen/                            # صور محلية لمعاينة ثيم لِين
│       ├── mada/
│       └── ...
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── site-header.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── site-breadcrumbs.tsx
│   │   ├── home/
│   │   │   ├── home-page.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── category-strip.tsx
│   │   │   ├── featured-themes.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   └── trust-section.tsx
│   │   ├── catalog/
│   │   │   ├── theme-card.tsx
│   │   │   ├── theme-grid.tsx
│   │   │   ├── theme-card-skeleton.tsx
│   │   │   ├── theme-filter-bar.tsx
│   │   │   ├── theme-search.tsx
│   │   │   ├── theme-sort.tsx
│   │   │   ├── theme-gallery.tsx
│   │   │   ├── theme-details.tsx
│   │   │   ├── theme-specifications.tsx
│   │   │   ├── theme-reviews.tsx
│   │   │   └── related-themes.tsx
│   │   ├── cart/
│   │   │   ├── cart-page.tsx
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   ├── checkout/
│   │   │   ├── demo-checkout.tsx
│   │   │   └── demo-order-confirmation.tsx
│   │   ├── shared/
│   │   │   ├── api-query-error.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── page-container.tsx
│   │   │   └── demo-notice.tsx
│   │   └── ui/                              # shadcn components المستخدمة فقط
│   │
│   ├── lib/
│   │   ├── utils.ts                         # cn(), formatPrice()
│   │   ├── site-config.ts
│   │   ├── query-client.tsx
│   │   ├── api/
│   │   │   ├── config.ts
│   │   │   ├── contracts/
│   │   │   │   ├── common.ts
│   │   │   │   ├── home.ts
│   │   │   │   ├── category.ts
│   │   │   │   ├── theme.ts
│   │   │   │   ├── review.ts
│   │   │   │   ├── cart.ts
│   │   │   │   └── order.ts
│   │   │   ├── schemas/
│   │   │   │   ├── common.ts
│   │   │   │   └── store.ts                 # Zod mirrors لكل DTO
│   │   │   ├── transport/
│   │   │   │   ├── types.ts
│   │   │   │   ├── fetch-transport.ts
│   │   │   │   ├── query.ts
│   │   │   │   └── errors.ts
│   │   │   ├── client/
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── browser-client.ts
│   │   │   │   ├── server-client.ts
│   │   │   │   └── scoped-client.ts
│   │   │   ├── mock/
│   │   │   │   ├── mock-transport.ts
│   │   │   │   ├── mock-store.ts
│   │   │   │   └── fixtures/
│   │   │   │       ├── home.json
│   │   │   │       ├── categories.json
│   │   │   │       ├── themes.json
│   │   │   │       └── reviews.json
│   │   │   └── modules/
│   │   │       ├── home/{endpoint.ts,hooks.ts,keys.ts,server.ts}
│   │   │       ├── categories/{endpoint.ts,hooks.ts,keys.ts,server.ts}
│   │   │       ├── themes/{endpoint.ts,hooks.ts,keys.ts,server.ts}
│   │   │       ├── reviews/{endpoint.ts,hooks.ts,keys.ts,server.ts}
│   │   │       └── orders/{endpoint.ts,hooks.ts,keys.ts,server.ts}
│   │   └── store-state/
│   │       ├── types.ts
│   │       ├── storage.ts
│   │       ├── cart-repository.ts
│   │       ├── local-cart-repository.ts
│   │       ├── favorites-repository.ts
│   │       └── local-favorites-repository.ts
│   │
│   └── types/index.ts                       # View models فقط
│
├── tests/
│   └── mock-workflows.test.ts
└── docs/
    └── backend-handoff/
        ├── README.md
        └── architecture/
            ├── STORE_DATA_MODEL.md
            ├── STORE_API_CONTRACT.md
            └── STORE_BACKEND_BLUEPRINT.md
```

يجوز تعديل تقسيم الملفات لتحسين التنفيذ، لكن لا تدمج الواجهة والـfixtures وطبقة النقل في ملف واحد، ولا تضع ملفات fixtures داخل مكونات الصفحات.

---

# 5. طبقة البيانات — القاعدة الأهم

## 5.1 قاعدة الطبقات

```txt
Contract → Endpoint Factory → Transport → Hook / Server Function → UI
```

- `contracts/` يعرّف DTOs والفلاتر فقط، من دون منطق عرض.
- `schemas/` يحتوي Zod schemas مطابقة لكل DTO.
- `modules/*/endpoint.ts` يعرّف العمليات المسمّاة والأنواع.
- `mock-transport` و`fetch-transport` هما طريقتا النقل فقط. يختار `browser-client.ts` أو `server-client.ts` إحداهما بحسب `apiConfig.mode`.
- مكونات client تجلب بيانات الكتالوج عبر TanStack Query hooks فقط.
- مكونات server تستدعي دوال `server.ts` فقط.
- لا تستورد الواجهة JSON fixtures، ولا تستورد `mock-transport`، ولا تنفّذ `fetch` مباشرة.
- cart وfavorites يمران عبر repository مستقل بواجهة ثابتة. النسخة الأولى تستخدم localStorage، ويمكن استبدال repository لاحقًا بخدمة backend.
- الطلبات التجريبية فقط تمر عبر endpoint mock صريح اسمه `demo`; لا يوجد endpoint دفع حقيقي.

## 5.2 أنواع النقل المشتركة

استخدم الأنواع الأساسية التالية في `src/lib/api/transport/types.ts`، مع إضافة ما يلزم:

```ts
export type ApiScope = "storefront";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type RequestOptions<TBody = unknown, TResponse = unknown> = {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  requestSchema?: ZodType<TBody>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
  responseSchema?: ZodType<TResponse>;
};

export interface ApiTransport {
  request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>): Promise<TResponse>;
}
```

أنشئ `ApiClient` typed بعمليات `request/get/post/put/patch/delete`. الـscope لأغراض logging والسياق فقط، وليس authorization.

## 5.3 عميل API والتحقق

في `client/api-client.ts`:

1. `validateRequest`: إن وُجد `requestSchema`، تحقق من body قبل النقل. عند الفشل ارمِ `ApiError` بحالة `422` ورمز `INVALID_API_REQUEST` ورسالة عربية وحقول الأخطاء.
2. أرسل `X-Client-Surface: storefront`.
3. `validateResponse`: إن وُجد `responseSchema`، تحقق من الاستجابة. عند الفشل ارمِ `ApiError` بحالة `502` ورمز `INVALID_API_RESPONSE`.
4. فك غلاف `{ data }` عند استخدامه، وتعامل مع أخطاء HTTP كـ`ApiError`.

## 5.4 `fetch-transport.ts`

- المتصفح يطلب من مسار نسبي مثل `/api`؛ لا تستخدم `localhost` في أي كود يصل إليه المتصفح.
- الخادم يستخدم `API_INTERNAL_URL` عند ضبطه ويمرر cookies عند الحاجة.
- أضف `AbortController` timeout، و`credentials: "include"`، و`Accept: application/json`، وJSON body عند الحاجة.
- حلّل أخطاء API بأسلوب RFC-7807، مع fallback للنص الفارغ أو غير الصالح.

## 5.5 اختيار mock أو HTTP

```ts
const browserTransport = apiConfig.mode === "mock"
  ? createMockTransport()
  : createFetchTransport({ baseUrl: apiConfig.browserBasePath, timeoutMs: apiConfig.timeoutMs });
```

أنشئ الاختيار الموازي للخادم باستخدام `API_INTERNAL_URL`. لا تكتب فروعًا داخل المكونات حسب وضع API.

## 5.6 Mock store وmock transport

- حمّل fixtures مرة واحدة في `mock-store.ts`، وتحقق من كل fixture باستخدام Zod عند seed.
- اجعل التخزين آمنًا مع HMR عبر `globalThis`، مع `resetMockDatabase()` للاختبارات.
- أضف latency بسيطة (نحو 100–150ms) كي تظهر حالات التحميل الحقيقية.
- طبّق البحث والتصفية والترتيب والترقيم داخل النقل mock، وليس داخل UI فقط.
- أعد `ApiError 404 NOT_FOUND` عند عدم العثور على slug أو id.
- احسب `themeCount` للتصنيفات و`rating`/`reviewCount` من fixtures بدل تكرار أرقام متضاربة في أكثر من مكان.
- كل endpoint يملك `responseSchema`؛ وعمليات POST تملك `requestSchema`.

## 5.7 عقد endpoints للنسخة الأولى

| الطريقة | المسار | المدخلات | النتيجة | ملاحظات |
|---|---|---|---|---|
| GET | `/v1/home/content` | — | `HomeContentDto` | نصوص الصفحة الرئيسية ومزايا المتجر |
| GET | `/v1/categories` | — | `CategoryDto[]` | مرتّبة حسب `order`، وعدد الثيمات محسوب |
| GET | `/v1/categories/:slug` | — | `CategoryDetailDto` | التصنيف مع ملخصات الثيمات |
| GET | `/v1/themes` | `search, category, industry, priceType, minPrice, maxPrice, sort, page, pageSize` | `PageResult<ThemeSummaryDto>` | `published` فقط في واجهة المتجر |
| GET | `/v1/themes/:slug` | — | `ThemeDetailDto` | تفاصيل ومعاينات الثيم |
| GET | `/v1/themes/:slug/reviews` | `page, pageSize, sort` | `PageResult<ReviewDto>` | بيانات mock معلّمة كبيانات عرض |
| GET | `/v1/themes/:slug/related` | `limit` | `ThemeSummaryDto[]` | من تصنيف أو مجال قريب |
| POST | `/v1/orders/demo` | `CreateDemoOrderInput` | `DemoOrderDto` | طلب تجريبي فقط، لا دفع ولا تفعيل |
| GET | `/v1/orders/demo/:orderId` | — | `DemoOrderDto` | من mock store/session فقط |

السلة والمفضلة لهما عمليات repository محلية: `get`, `add`, `remove`, `clear`, `toggleFavorite`, `listFavorites`. لا تسجل بيانات دفع أو شخصية. يمكن توثيق endpoints المستقبلية في handoff، لكن لا توحِ بأنها عاملة في v1.

---

# 6. نماذج البيانات والعقود

يجب أن تكون الأنواع في `contracts/` واضحة ومطابقة حرفيًا لـZod في `schemas/store.ts`.

## 6.1 المشترك — `contracts/common.ts`

```ts
export type ApiScope = "storefront";
export type CurrencyCode = "SAR";
export type PageMeta = { page: number; pageSize: number; total: number; totalPages: number };
export type PageResult<T> = { items: T[]; meta: PageMeta };
export type ApiProblem = {
  status: number;
  code: string;
  title: string;
  detail?: string;
  fields?: Record<string, string[]>;
  requestId?: string;
};
export type ListFilter = { page?: number; pageSize?: number; search?: string };
```

## 6.2 التصنيفات — `contracts/category.ts`

```ts
export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;                 // اسم lucide icon من قائمة مسموح بها
  image: string;                // مسار محلي داخل /public
  order: number;
  themeCount: number;           // يحسبه mock transport
}

export interface CategoryDetailDto extends CategoryDto {
  themes: ThemeSummaryDto[];
}
```

## 6.3 الثيمات — `contracts/theme.ts`

```ts
export type ThemeSort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";
export type ThemePriceType = "free" | "paid";
export type ThemeBadge = "جديد" | "مميز";
export type ThemeImageKind = "cover" | "desktop" | "mobile" | "detail";

export interface ThemeImageDto {
  src: string;                 // مسار محلي؛ لا hotlink خارجي
  alt: string;
  kind: ThemeImageKind;
}

export interface ThemeSummaryDto {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categoryId: string;
  categoryName: string;
  industries: string[];        // مثل أزياء، عبايات، عناية بالبشرة
  styleTags: string[];         // مثل بسيط، فاخر، عصري
  price: number;               // مبلغ صحيح بالريال في fixtures التجريبية
  currency: CurrencyCode;
  priceType: ThemePriceType;
  compareAtPrice?: number;
  coverImage: string;
  gallery: ThemeImageDto[];
  badges: ThemeBadge[];
  rating: number;              // يحسب من reviews في mock transport
  reviewCount: number;          // يحسب من reviews في mock transport
  features: string[];
  supportsRTL: boolean;
  responsive: boolean;
  lastUpdated: string;          // ISO date
  demoPreviewPath?: string;    // مسار داخلي لمعاينة محلية إن توفرت
  status: "published" | "draft";
}

export interface ThemeDetailDto extends ThemeSummaryDto {
  longDescription: string;
  featureGroups: { title: string; items: string[] }[];
  requirements: string[];
  compatibilityNote: string;
  license: {
    title: string;
    summary: string;
    terms: string[];
  };
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
  status?: "published" | "draft";
}
```

لا تكتب «متوافق مع كل إضافات سلة» أو «معتمد من سلة» كادعاء عام. صف فقط خصائص الثيم الموجودة في بياناته، واستخدم تنويهًا بأن مواصفات العرض تجريبية.

## 6.4 الصفحة الرئيسية — `contracts/home.ts`

```ts
export interface HomeContentDto {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  benefits: { title: string; description: string; icon: string }[];
  howItWorks: { step: number; title: string; description: string }[];
  featuredThemeIds: string[];
  categoryIds: string[];
}
```

إحصاءات الصفحة الرئيسية — مثل عدد الثيمات والتصنيفات — تُحسب من fixtures؛ لا تكتب أرقامًا تسويقية ثابتة أو ادعاءات مبيعات غير حقيقية.

## 6.5 التقييمات — `contracts/review.ts`

```ts
export interface ReviewDto {
  id: string;
  themeId: string;
  authorName: string;
  rating: number;              // 1..5
  title: string;
  body: string;
  createdAt: string;
  isDemo: boolean;              // true لجميع التقييمات المحلية
}
```

إن عُرضت تقييمات fixtures، وضّح في واجهة التجربة أو في تنويه واضح أنها **بيانات تجريبية** وليست تقييمات عملاء حقيقية.

## 6.6 السلة والطلب — `contracts/cart.ts`, `contracts/order.ts`

```ts
export interface CartLineDto {
  themeId: string;
  slug: string;
  name: string;
  coverImage: string;
  price: number;
  currency: "SAR";
}

export interface CartDto {
  items: CartLineDto[];
  itemCount: number;
  subtotal: number;
  currency: "SAR";
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
  currency: "SAR";
  createdAt: string;
  notice: string;
}
```

الطلب التجريبي لا يحتوي رقم بطاقة، ولا payment token، ولا عنوانًا أو هاتفًا أو بريدًا إلكترونيًا. لا تكتب VAT أو رسوم شحن أو ضريبة كحقيقة ما لم تضف متطلبات محاسبية موثّقة لاحقًا.

---

# 7. معايير TanStack Query

## 7.1 Provider

أنشئ `src/lib/query-client.tsx` كـClient Component مع الإعدادات التالية:

```tsx
"use client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: (i: number) => Math.min(1000 * 2 ** i, 30_000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
        throwOnError: false
      },
      mutations: {
        retry: 1,
        throwOnError: false,
        onError: (error: Error) => console.error("Store mutation error:", error)
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 7.2 مفاتيح الاستعلام

```ts
export const homeKeys = { all: ["home"] as const, content: () => [...homeKeys.all, "content"] as const };

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  detail: (slug: string) => [...categoryKeys.all, "detail", slug] as const
};

export const themeKeys = {
  all: ["themes"] as const,
  lists: () => [...themeKeys.all, "list"] as const,
  list: (filter: ThemeFilter = {}) => [...themeKeys.lists(), normalizedFilter(filter)] as const,
  detail: (slug: string) => [...themeKeys.all, "detail", slug] as const,
  reviews: (slug: string) => [...themeKeys.detail(slug), "reviews"] as const,
  related: (slug: string) => [...themeKeys.detail(slug), "related"] as const
};

export const orderKeys = {
  all: ["orders"] as const,
  demo: (orderId: string) => [...orderKeys.all, "demo", orderId] as const
};

export const cartKeys = { all: ["cart"] as const, root: () => [...cartKeys.all] as const };
export const favoritesKeys = { all: ["favorites"] as const, root: () => [...favoritesKeys.all] as const };
```

## 7.3 Hooks

- استخدم `queryOptions` داخل `modules/*/hooks.ts`، مع `keepPreviousData` لنتائج البحث والفلاتر.
- وفّر hooks واضحة مثل `useThemes(filter)`, `useTheme(slug)`, `useCategories()`, `useCategory(slug)`, `useThemeReviews(slug)`, `useCart()`, `useFavorites()`, `useCreateDemoOrder()`.
- عمليات السلة والمفضلة تستدعي repositories فقط ثم تعمل invalidate لمفاتيح cache المناسبة.
- لا تستخدم React Query hooks داخل Server Components.

## 7.4 قواعد Server/Client

- Server Components تستدعي `listThemesForServer()`, `getThemeForServer(slug)`, `listCategoriesForServer()` من ملفات `server.ts`.
- Client Components تستخدم hooks فقط.
- لا تضع `"use client"` على layout أو مكوّنات عرض ثابتة من دون سبب تفاعلي.

---

# 8. السلة والمفضلة والتخزين المحلي

أنشئ واجهة repository قابلة للتبديل:

```ts
export interface CartRepository {
  get(): Promise<CartDto>;
  add(theme: ThemeSummaryDto): Promise<CartDto>;
  remove(themeId: string): Promise<CartDto>;
  clear(): Promise<CartDto>;
}

export interface FavoritesRepository {
  getIds(): Promise<string[]>;
  toggle(themeId: string): Promise<string[]>;
  remove(themeId: string): Promise<string[]>;
  clear(): Promise<string[]>;
}
```

- مفاتيح التخزين: `nasaq-cart-v1` و`nasaq-favorites-v1`.
- تحقق من البيانات المخزنة عبر Zod عند القراءة. إذا كانت تالفة، أعد الحالة الافتراضية من دون تعطيل الصفحة.
- إضافة الثيم إلى السلة idempotent: لا تضف الثيم نفسه أكثر من مرة.
- مزامنة badge السلة والمفضلة بعد كل mutation، وتحديثها بعد refresh.
- لا تفترض وجود مستخدم مسجل الدخول.
- أنشئ `getCartRepository()` و`getFavoritesRepository()` لاختيار local repository الآن وremote repository مستقبلًا عند توفر backend.
- احذر `localStorage` أثناء SSR؛ استخدمه داخل البيئة الآمنة فقط.
- الطلب التجريبي يحتفظ ببيانات الطلب اللازمة لعرض صفحة تأكيده فقط، ولا يحفظ أي بيانات شخصية أو دفع.

---

# 9. بيانات العرض — عربية وسعودية وليست نصوصًا مؤقتة

أنشئ fixtures كاملة ومدققة بـZod داخل `src/lib/api/mock/fixtures/`.

## 9.1 التصنيفات

أنشئ 6 تصنيفات على الأقل، مع وصف عربي وصورة محلية وعدد ثيمات محسوب:

1. `fashion` — الأزياء والعبايات
2. `beauty` — الجمال والعناية
3. `home` — المنزل والديكور
4. `food` — الأطعمة والمشروبات
5. `electronics` — الإلكترونيات
6. `gifts` — الهدايا والزهور

## 9.2 الثيمات

أنشئ 10 ثيمات عربية على الأقل، موزعة على التصنيفات. استخدم أسماء عربية قصيرة وslugs إنجليزية، وأسعار عرض معقولة بالريال السعودي. الأسعار والأسماء التالية أمثلة fixtures وليست عروضًا حقيقية:

| Slug | الاسم | المجال | السعر التجريبي | طابع التصميم |
|---|---|---|---:|---|
| `leen` | لِين | أزياء وعبايات | 279 ر.س | هادئ وأنيق |
| `mada` | مَدى | عناية وجمال | 329 ر.س | ناعم ومعاصر |
| `mahad` | مَهاد | منزل وديكور | 299 ر.س | دافئ وطبيعي |
| `qahwa` | قهوة | أطعمة ومشروبات | 199 ر.س | حيوي ومباشر |
| `wameed` | وَميض | إلكترونيات | 349 ر.س | واضح وتقني |
| `ward` | وَرد | هدايا وزهور | 229 ر.س | لطيف واحتفالي |
| `tibr` | تِبر | مجوهرات وإكسسوارات | 379 ر.س | فاخر ومختزل |
| `tamrah` | تَمرة | تمور ومنتجات غذائية | 249 ر.س | أصيل وحديث |
| `rawaq` | رِواق | أثاث وديكور | 319 ر.س | تحريري وفاخر |
| `nada` | نَدى | عناية بالبشرة | 289 ر.س | مشرق وبسيط |

لكل ثيم: tagline، وصف قصير وطويل، category، industries، style tags، features، متطلبات، ملاحظة توافق صادقة، سعر `SAR`، حالة العرض، صور cover/gallery محلية، تحديثات، license copy تجريبية، وأسئلة شائعة. لا تضع أرقام مبيعات مزيفة.

احسب rating وعدد التقييمات من `reviews.json`. إن أضفت تقييمات لأغراض العرض، اجعلها كلها `isDemo: true` وأظهر تنويهًا بأنها تجريبية. لا تكتب شهادات عملاء حقيقية أو شعارات متاجر حقيقية من دون إذن.

## 9.3 الصور والمعاينات

- استخدم ملفات محلية تحت `public/themes/<slug>/` فقط؛ لا تعتمد على hotlinks أو روابط صور قد تتوقف.
- إذا لم تتوفر صور منتجات حقيقية، أنشئ معاينات محلية جذابة باستخدام SVG/HTML/CSS توضّح شكل المتجر، وسمّها «معاينة تصميمية» بدل عرضها على أنها متجر فعلي.
- وفّر على الأقل غلافًا ومعاينة desktop ومعاينة mobile لكل ثيم، مع `alt` عربي وصفي.
- لا تستخدم شعار سلة الرسمي في mockup. يمكن كتابة «متجر تجريبي» أو اسم متجر خيالي.
- يجب أن تختلف معاينات الثيمات فعلًا في الألوان والتخطيط حتى يستطيع الزائر المقارنة بصريًا.

## 9.4 الصفحة الرئيسية — `home.json`

اكتب copy عربيًا حقيقيًا مثل:

- العنوان: **«ثيم يليق بمتجرك. ويخلّي البداية أسهل.»**
- الوصف يشرح أن الزائر يستطيع استكشاف ثيمات عرضها عربي، ومعاينتها، ومقارنة تفاصيلها قبل اتخاذ القرار.
- CTA أساسي: **«اكتشف الثيمات»**.
- CTA ثانوي: **«كيف تعمل المنصة؟»**.
- فوائد: معاينة قبل الاختيار، عرض مزايا كل ثيم بوضوح، تصميمات متجاوبة، تجربة عربية RTL، وخطوات واضحة.
- احسب إحصاءات المتجر من fixtures. لا تخترع «آلاف المتاجر» أو «مبيعات مضمونة» أو «معتمد رسميًا».

---

# 10. مواصفات الصفحات

كل صفحة تكون thin قدر الإمكان، ومكوّنات التفاعل داخل components منفصلة. لكل حالة بيانات: تحميل، خطأ، نتيجة فارغة، ونجاح.

## 10.1 الـroot layout

في `app/layout.tsx`:

```tsx
<html lang="ar" dir="rtl" suppressHydrationWarning>
  <body>
    {/* رابط تخطٍ إلى #main-content */}
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </QueryProvider>
  </body>
</html>
```

أضف metadata عربية، و`metadataBase` بقيمة نطاق تجريبي واضحة، وOpen Graph/Twitter locale `ar_SA`. لا تستخدم دومينًا يوحي بأنه موقع سلة الرسمي.

## 10.2 الرئيسية `/`

الأقسام بالترتيب:

1. `HeroSection`: عنوان واضح، وصف مختصر، CTA للكتالوج، وصورة/معاينة ثيم محلية.
2. `CategoryStrip`: تصنيفات المتجر مع روابطها.
3. `FeaturedThemes`: ثيمات مميزة من `home.content.featuredThemeIds`.
4. `HowItWorks`: خطوات التصفح والمعاينة واختيار الثيم، مع توضيح أن الشراء الفعلي غير مفعّل في demo.
5. `Benefits`: مزايا تجربة المتجر دون ادعاءات غير موثقة.
6. `DemoNotice`: يوضّح أن بيانات الكتالوج والطلب تجريبية.

كل قسم يعالج loading/error/empty states. لا تكرر fixtures في المكوّنات.

## 10.3 كتالوج الثيمات `/themes`

- البحث المؤجل 300ms على الاسم والوصف والتصنيف والمجالات والوسوم.
- الفلاتر تعمل معًا: التصنيف، المجال، مجاني/مدفوع، حد السعر، والترتيب.
- خيارات الترتيب: مميز، الأحدث، السعر من الأقل، السعر من الأعلى، التقييم.
- اعرض عدد النتائج من `meta.total`، ووفّر زر مسح الفلاتر.
- على الهاتف تظهر الفلاتر داخل Sheet accessible.
- بطاقة الثيم تعرض: صورة معاينة، الاسم، وصفًا قصيرًا، التصنيف، السعر بالريال، rating مع بيان أنه تجريبي عند وجوده، وCTA للتفاصيل/المعاينة، وزر مفضلة حقيقي.
- حالات فارغة عربية: **«ما لقينا ثيمات تطابق بحثك»** مع زر لمسح الفلاتر.

## 10.4 تفاصيل الثيم `/themes/[slug]`

- Server Component يستدعي `getThemeForServer(slug)`؛ استخدم `notFound()` عند عدم وجوده.
- أنشئ `generateMetadata()` و`generateStaticParams()` من fixtures عبر دوال server layer، لا من imports داخل الصفحة.
- Breadcrumbs: الرئيسية / الثيمات / التصنيف / اسم الثيم.
- معرض صور accessible يدعم الصور المكتبية والجوال؛ لا يعرض iframe خارجيًا إلا إذا كان الرابط داخليًا وآمنًا وموفرًا في البيانات.
- عرض اسم الثيم، السعر، badge تجريبي عند اللزوم، الوصف، مزاياه، المتطلبات، ملاحظة التوافق، شروط الترخيص التجريبية، وسجل التحديثات.
- أزرار: «أضف للسلة»، «أضف للمفضلة»، «شاهد المعاينة». وضّح بوضوح أن الطلب التجريبي لا يشتري ولا يفعّل الثيم.
- اعرض تقييمات mock كبيانات تجريبية، ثم ثيمات ذات صلة.
- لا تضع أي زر «تنزيل الثيم» يعمل على ملف وهمي.

## 10.5 صفحة التصنيفات `/categories` و`/categories/[slug]`

- صفحة التصنيفات تعرض التصنيفات الستة على الأقل، الوصف وعدد الثيمات المحسوب.
- صفحة التصنيف تعرض عنوانًا ووصفًا وgrid قابلًا للتصفية للثيمات التابعة له.
- التصنيف غير الموجود يعرض 404 حقيقية.

## 10.6 المفضلة `/favorites`

- تعتمد على favorites repository المحلي، وتعرض الثيمات المفضلة عبر استعلام الكتالوج أو mapper.
- زر إزالة المفضلة يعمل فورًا ويحدّث badge والصفحة.
- الحالة الفارغة: **«ما أضفت ثيمات للمفضلة بعد»** مع رابط إلى الكتالوج.

## 10.7 السلة `/cart`

- اعرض الثيمات المختارة، السعر لكل ثيم، الإجمالي، إزالة عنصر، تفريغ السلة، والانتقال للمتابعة.
- لا تسمح بإضافة الثيم نفسه مرتين.
- اذكر أن الأسعار والطلب في نسخة العرض تجريبية، ولا توجد رسوم أو ضرائب محسوبة في هذه النسخة.
- الحالة الفارغة لديها CTA للعودة إلى الثيمات.

## 10.8 إتمام الطلب التجريبي `/checkout`

- اعرض ملخص الثيمات والمجموع بالريال.
- قبل التأكيد اعرض ملاحظة ظاهرة: **«هذه تجربة توضيحية فقط — لن يتم تحصيل أي مبلغ أو تفعيل/تنزيل ثيم.»**
- يجب أن يوافق المستخدم على `acceptedDemoNotice` قبل إرسال mutation.
- لا تعرض حقول بطاقة ولا تطلب معلومات شخصية. زر التأكيد يستدعي `POST /v1/orders/demo` فقط.
- بعد نجاح mutation أفرغ السلة، ثم انتقل إلى `/orders/[orderId]`.
- لا تستخدم عبارات تفيد بإتمام عملية شراء فعلية.

## 10.9 نتيجة الطلب `/orders/[orderId]`

- استرجع `DemoOrderDto` من endpoint mock واعرض badge واضحًا **«طلب تجريبي — لم يتم الدفع»**.
- اعرض المنتجات والإجمالي ووقت الإنشاء، مع زري العودة للمتجر وعرض الثيمات.
- لا تعرض روابط تفعيل أو تنزيل غير حقيقية.
- إذا لم يوجد الطلب في session/mock store، اعرض حالة not found أو رسالة انتهاء بيانات العرض.

## 10.10 عن المتجر `/about`، الأسئلة `/faq`، التواصل `/contact`

- محتوى عربي موجز وصادق عن منصة نَسَق واستقلاليتها عن سلة.
- FAQ يغطي المعاينة، نطاق النسخة التجريبية، طريقة اختيار الثيم، والتوافق دون ادعاء ضمانات.
- نموذج التواصل في النسخة الأولى محلي للعرض فقط: يوضح أن الرسالة لن تُرسل أو تُخزّن. تحقّق من الحقول بـZod، ثم اعرض toast تجريبيًا فقط؛ لا تجمع معلومات حساسة.

---

# 11. منطق الأسعار والطلبات

أنشئ دوال pure قابلة للاختبار داخل `src/lib/store-state/` أو `src/lib/commerce/`:

```ts
export function calculateCartSubtotal(items: CartLineDto[]): number;
export function createDemoOrder(items: CartLineDto[], acceptedDemoNotice: boolean): DemoOrderDto;
```

القواعد:

- العملة `SAR` فقط في v1.
- السعر قيمة صحيحة بالريال داخل fixtures، ويُنسّق للعرض باستخدام `Intl.NumberFormat`.
- لا تحسب VAT أو رسوم خدمة أو شحن من تلقاء نفسك.
- رفض إنشاء طلب تجريبي إذا كانت السلة فارغة أو لم تتم الموافقة على التنويه.
- `DemoOrderDto.status` دائمًا `demo-only`؛ لا يوجد status مثل `paid` أو `fulfilled` في mock.
- لا تخزن بيانات بطاقة أو معلومات دفع أو بيانات شخصية في localStorage أو sessionStorage.

---

# 12. نظام المعاينة وعرض الثيمات

- يجب أن تكون صور المعاينة assets محلية، مع أحجام ثابتة تقلّل layout shift و`alt` عربي.
- استخدم `next/image` مع `unoptimized: true` حسب إعداد المشروع، أو `<img>` فقط عند سبب واضح.
- وفر modal/dialog accessible لمعاينة desktop/mobile، مع إغلاق Escape وإرجاع focus.
- إذا بُنيت صفحات demo حيّة للثيمات، استعمل route داخليًا واضحًا مثل `/themes/[slug]/preview` وبيانات fixtures. لا تربط بمتجر حقيقي ولا تستخدم checkout حقيقيًا.
- لا تخلط بين صورة تصميمية وبين لقطة متجر عميل فعلي. اكتب «معاينة تصميمية» عندما تكون الصورة mockup.

---

# 13. نظام التصميم

- هوية عربية premium وهادئة مناسبة للتجارة السعودية: خلفية دافئة فاتحة، أخضر داكن/زيتوني كلون أساسي، لمسات رملية أو طينية، ومساحات بيضاء واضحة. يمكن تطوير القيم اللونية، لكن حافظ على التباين.
- استخدم خط `IBM Plex Sans Arabic` أو `Tajawal` للنص العربي، وخط مناسب للأرقام واللاتينية عند الحاجة.
- التصميم يركّز على صور الثيمات والمعاينة، وليس على gradients ضخمة أو ظلال ثقيلة أو animations مبالغ فيها.
- Header واضح فيه العلامة «نَسَق»، روابط: الثيمات، التصنيفات، كيف تعمل، عن المتجر، وأيقونات البحث/المفضلة/السلة مع counts.
- واجهة شراء صادقة: السعر والميزات والقيود والتنويه التجريبي ظاهرة قبل الإجراء.
- استخدم tokens دلالية للألوان (`primary`, `muted`, `success`, `warning`, `error`) وCSS variables متوافقة مع shadcn.
- فعّل light/dark theme، لكن اجعل الوضع الافتراضي light. راجع صور المعاينة والبطاقات والحالات الفارغة في الوضعين.
- RTL أصلي عبر `dir="rtl"` وlogical CSS/Tailwind؛ اجعل الصور والكود/URLs فقط LTR عند الحاجة. اعكس الأسهم فقط عندما يتغير معناها بصريًا.
- اختبر 360، 390، 768، 1024، و1440px.

---

# 14. SEO والوصول والأداء والأخطاء

## SEO

- عناوين ووصف عربيان لكل route، و`generateMetadata()` لصفحات التفاصيل والتصنيفات.
- استخدم `title.template = "%s | نَسَق"` وOpen Graph locale `ar_SA`، وcanonical مناسب لدومين تجريبي واضح.
- أضف JSON-LD منظمًا للـ`Product` فقط عندما تكون البيانات حقيقية وموسومة بوضوح؛ في النسخة التجريبية لا تدّعِ availability أو offers حقيقية. يمكن استخدام `ItemList` للكتالوج بدلًا منه.
- `h1` واحد واضح في كل صفحة.

## Accessibility

- كل عنصر تفاعلي `<button>` أو `<a>` حقيقي، وليس `div` clickable.
- keyboard navigation، focus ring واضح، Escape لإغلاق dialog/sheet، labels للحقول، `aria-label` للأزرار ذات الأيقونة فقط، `aria-current` للروابط النشطة، و`aria-live` لتحديثات السلة عند الحاجة.
- لا تعتمد على اللون وحده لعرض السعر أو حالة المفضلة أو الأخطاء.
- تباين WCAG AA قدر الإمكان، واحترم `prefers-reduced-motion`.

## الأداء والحالات

- Server Components افتراضيًا؛ client components فقط للتفاعل.
- استخدم الصور المحلية وأبعادًا ثابتة وlazy loading للمعارض خارج الجزء المرئي.
- طبّق loading skeletons للكتالوج والتفاصيل، وerror state قابلًا لإعادة المحاولة، وempty states للبحث والتصنيفات والمفضلة والسلة.
- أنشئ `app/loading.tsx`, `app/error.tsx` (`"use client"`), `app/not-found.tsx`، وnot-found لصفحة الثيم والتصنيف.
- `ApiQueryError` يعرض رسائل عربية مفهومة؛ ميّز `INVALID_API_RESPONSE` و404.
- لا تترك روابط مكسورة أو أزرارًا شكلية بلا سلوك. إذا كانت الميزة غير متاحة في demo، عطّل الزر واشرح السبب.

---

# 15. استراتيجية الاختبار — Vitest

أنشئ `tests/mock-workflows.test.ts` مع `beforeEach(resetMockDatabase)` واختبر endpoint factories نفسها التي تستخدمها الواجهة.

السيناريوهات المطلوبة:

1. تحميل home content بالعربية، ووجود benefits وخطوات الاستخدام.
2. تحميل 6 تصنيفات على الأقل وترتيبها، وحساب `themeCount` من بيانات الثيمات.
3. وجود 10 ثيمات منشورة على الأقل؛ اختبار البحث العربي والإنجليزي، التصنيف، المجال، النوع المجاني/المدفوع، مجال السعر، والترقيم والترتيب.
4. جلب تفاصيل ثيم موجود، و`ApiError 404 NOT_FOUND` لslug غير موجود.
5. حساب rating وreviewCount من fixtures، ورفض rating خارج النطاق عبر Zod.
6. كل صور الثيمات محلية، وكل `src` يبدأ بـ`/themes/`، ولا يعتمد أي fixture على `http(s)` خارجي.
7. السلة: إضافة، منع التكرار، إزالة، تفريغ، مجموع السعر، تنسيق العملة، واستعادة localStorage بعد refresh.
8. المفضلة: toggle، الإزالة، التزامن، والتعامل الآمن مع storage تالف.
9. الطلب التجريبي: رفض سلة فارغة، رفض عدم الموافقة على التنويه، نجاح `demo-only`، وعدم وجود حقول دفع/بيانات شخصية أو `paid` status.
10. Zod request/response validation: طلب غير صالح ينتج `INVALID_API_REQUEST`، واستجابة مخالفة تنتج `INVALID_API_RESPONSE`.
11. البحث الذي لا يطابق نتائج يعيد meta صحيحة وواجهة empty-state قابلة للاستخدام.
12. الروابط الداخلية، بيانات metadata، وحالات 404 للثيم والتصنيف.

لا تختبر بوابة دفع لأنها غير موجودة. لا تستخدم أي بيانات اتصال أو credentials حقيقية في الاختبارات.

---

# 16. وثائق تسليم Backend — اكتبها كاملة

أنشئ `docs/backend-handoff/`:

- `README.md`: شرح mock-first، تشغيل المشروع، حدود demo، وكيفية تفعيل HTTP للكتالوج فقط.
- `architecture/STORE_DATA_MODEL.md`: نموذج Category, Theme, ThemeAsset, License, Review, Cart, Order, PaymentIntent (كمستقبل موثق فقط)، والعلاقات بينها.
- `architecture/STORE_API_CONTRACT.md`: جدول endpoints وعقود request/response وZod schemas. وضّح صراحة أي المسارات mock-only.
- `architecture/STORE_BACKEND_BLUEPRINT.md`: اقتراح backend آمن، قاعدة بيانات مناسبة، إدارة الجلسات، صلاحيات admin مستقبلًا، إدارة ملفات الثيمات، حماية روابط التنزيل، بوابة الدفع، سجلات الطلبات، وwebhooks.

وثّق أن تشغيل الدفع وتفعيل/تنزيل الثيمات يتطلب backend حقيقيًا، وحماية ملفات، وتكاملًا موثّقًا. قبل بناء أي تكامل مع سلة أو استخدام اسم/شعار/اعتماد رسمي، راجع الشروط والوثائق والموافقات الرسمية الحالية. لا تنفّذ scraping ولا تخمّن API endpoints.

---

# 17. مراحل البناء — نفّذ بالترتيب وببوابة لكل مرحلة

## المرحلة 1 — Scaffold والهوية والـlayout

أنشئ Next app، Tailwind 4، shadcn، RTL root layout، الخطوط، providers، metadata، theme toggle، header/footer/mobile nav، loading/error/not-found، و`.env.example`.

**بوابة المرحلة:** `pnpm dev` يعرض shell عربي RTL متجاوب، وأزرار التنقل الأساسية تعمل، و`pnpm lint` ينجح.

## المرحلة 2 — العقود وطبقة API mock

أنشئ contracts وZod schemas والfixtures والـmock store والـtransports والـAPI client وendpoint factories وhooks/server functions.

**بوابة المرحلة:** كل endpoints في §5.7 تعمل من خلال mock transport، والسيناريوهات 1–6 و10 في الاختبارات تمر.

## المرحلة 3 — الصفحة الرئيسية والكتالوج والتصنيفات

نفّذ hero، category strip، featured themes، catalog search/filter/sort/pagination، theme cards، وصفحات التصنيفات مع skeleton/error/empty states.

**بوابة المرحلة:** الانتقال الرئيسية → التصنيفات/الكتالوج → تصفية النتائج يعمل عند 360–1440px.

## المرحلة 4 — تفاصيل الثيم والمعاينة

نفّذ صفحات التفاصيل، metadata، breadcrumbs، gallery، requirements، license copy، reviews demo notice، related themes، و404.

**بوابة المرحلة:** جميع الثيمات العشرة تفتح، صورها محلية، ولا توجد ادعاءات أو روابط خارجية زائفة.

## المرحلة 5 — المفضلة والسلة

نفّذ repositories المحلية، التخزين الآمن، counters، add/remove/clear، وصفحات empty/loading.

**بوابة المرحلة:** السلة والمفضلة تعملان بعد refresh والسيناريوهات 7–8 تمر.

## المرحلة 6 — طلب تجريبي

نفّذ checkout تجريبيًا صريحًا، الموافقة المطلوبة، mock order endpoint، confirmation route، وحالات الخطأ.

**بوابة المرحلة:** لا توجد حقول دفع أو شراء حقيقي، وكل طلب يحمل `demo-only`، والسيناريوهات 9–10 تمر.

## المرحلة 7 — الصفحات المساندة

نفّذ about وFAQ وcontact demo، وأكمل التنقل وfooter وروابط السياسات التجريبية.

**بوابة المرحلة:** كل الروابط إما تعمل أو معطّلة مع تفسير واضح؛ لا نموذج يوهم المستخدم بأن الرسالة أُرسلت.

## المرحلة 8 — SEO وAccessibility وresponsive

راجع metadata وcanonical وkeyboard/focus وcontrast وRTL وmobile sheets والـdark mode.

**بوابة المرحلة:** تحقق يدويًا على 360/390/768/1024/1440، ولا توجد مشاكل overflow أو focus traps.

## المرحلة 9 — الأداء والصقل

حسّن الصور، skeletons، caching، أخطاء API، وأزل أي client components غير ضرورية.

**بوابة المرحلة:** لا صور خارجية معطّلة ولا layout shifts كبيرة ولا أزرار شكلية.

## المرحلة 10 — التسليم

شغّل `pnpm build` و`pnpm lint` و`pnpm test:mock`، اختبر جميع المسارات، وأكمل وثائق backend handoff.

**بوابة المرحلة:** كل checklist أدناه مكتمل؛ لا تترك TODO/FIXME في الوظائف الأساسية.

---

# 18. تعريف الإنجاز — Acceptance Checklist

- [ ] `pnpm build` ينجح مع TypeScript strict ومن دون تجاهل أخطاء.
- [ ] `pnpm lint` بلا أخطاء.
- [ ] `pnpm test:mock` ناجح.
- [ ] المسارات تعمل: `/`, `/themes`, `/themes/[slug]`, `/categories`, `/categories/[slug]`, `/favorites`, `/cart`, `/checkout`, `/orders/[orderId]`, `/about`, `/faq`, `/contact`.
- [ ] البحث والفلاتر والترتيب والترقيم تعمل معًا، مع empty state واضحة.
- [ ] كل تفاصيل الثيمات تعرض السعر بالريال، المزايا، صور المعاينة المحلية، المتطلبات والتنويه التجريبي.
- [ ] المفضلة والسلة تستمران بعد refresh، ولا يضاف الثيم نفسه مرتين.
- [ ] الطلب التجريبي يتطلب موافقة، ويظهر بوضوح أنه غير مدفوع وغير مفعّل.
- [ ] لا يوجد جمع لبيانات بطاقة، ولا fake payment success، ولا ادعاء تفعيل/تنزيل.
- [ ] لا يوجد اعتماد على صور خارجية، ولا fixtures ببيانات عميل/مبيعات وهمية غير معلّمة.
- [ ] لا يوحي التصميم أن نَسَق تابع لسلة أو معتمد منها؛ التنويه موجود بوضوح.
- [ ] العربية وRTL صحيحان في header، الفلاتر، الأسعار، dialogs، footer، وداخل mobile navigation.
- [ ] الواجهة responsive على 360/390/768/1024/1440px، والـdark/light readable.
- [ ] الوصول بلوحة المفاتيح وARIA وfocus states تعمل؛ لا توجد `div` قابلة للنقر بلا semantics.
- [ ] `NEXT_PUBLIC_API_MODE=http` يستخدم fetch transport للكتالوج فقط، من دون تغيير UI؛ لا تعتبره تفعيلًا للدفع.
- [ ] أخطاء API و404 وloading وempty states مغطاة.
- [ ] وثائق backend handoff مكتملة ومتسقة مع العقود.

---

# 19. ثوابت المعمارية التي لا يجوز كسرها

- `src/lib/api/{config,contracts,schemas,transport,client,mock,modules}` هو فصل المسؤوليات الأساسي.
- كل domain module يوفر `endpoint.ts / hooks.ts / keys.ts / server.ts` عند الحاجة.
- `mock-transport` هو المصدر المحلي لعقود API، و`fetch-transport` المسار الوحيد لاتصالات HTTP.
- UI لا يستورد JSON fixtures، ولا ينفّذ fetch، ولا يقرر وضع mock/http.
- كل response يخضع لـZod validation، والـfixtures تُفحص عند seed.
- السلة والمفضلة عبر repositories قابلة للاستبدال، وليستا وصولًا مباشرًا إلى localStorage من مكوّنات الواجهة.
- حالات loading/error/empty/confirmation مقصودة ومترجمة للعربية.
- بيانات الطلب التجريبي لا تُعامل كدفع أو شراء حقيقي، ولا تحفظ أي بيانات دفع أو بيانات شخصية.
- أي ادعاء عن سلة أو اعتماد أو توافق أو تكامل خارجي يجب أن يكون موثقًا وصحيحًا، لا استنتاجًا من التصميم.
