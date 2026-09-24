# نَسَق — متجر ثيمات لمنصة سلة

واجهة عربية RTL لمتجر مستقل يعرض معاينات تصميمية لثيمات التجارة الإلكترونية. النسخة الحالية تستخدم بيانات محلية؛ السلة والمفضلة محفوظتان محليًا، والطلب تجريبي فقط (لا دفع أو تنزيل أو تفعيل حقيقي).

> نَسَق مشروع مستقل، وليس تابعًا لمنصة سلة أو ممثلًا لها. بيانات الأسعار والتقييمات والمعاينات تجريبية.

## التشغيل محليًا

```bash
corepack pnpm install
corepack pnpm dev
```

أوامر التحقق:

```bash
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm test:mock
corepack pnpm build
```

للاطلاع على مواصفات المشروع: [`SALLA_THEME_STORE_PROJECT_PROMPT.md`](./SALLA_THEME_STORE_PROJECT_PROMPT.md).

## مسودات Twilight محلية

توجد خمس مسودات Twilight داخل `salla-themes/`، منفصلة عن كتالوج نَسَق التجريبي:

- **لِين** للعبايات والأزياء: [`salla-themes/leen/`](./salla-themes/leen/)
- **مَدى** للجمال والعناية: [`salla-themes/mada/`](./salla-themes/mada/)
- **وَميض** للإلكترونيات والأجهزة الذكية: [`salla-themes/wameed/`](./salla-themes/wameed/)
- **وَرد** للزهور والهدايا والمناسبات: [`salla-themes/ward/`](./salla-themes/ward/)
- **قهوة** للمحمصات ومتاجر القهوة المختصة: [`salla-themes/qahwa/`](./salla-themes/qahwa/)

كلها مسودات محلية مبنية على Theme Raed وبها مكوّنات قابلة للتخصيص. افتح `/themes/<slug>/preview` لمعاينة متجر محلية تفاعلية لكل ثيم؛ هذه محاكاة React بمحتوى تجريبي وليست تشغيلًا لقوالب Twilight أو متجرًا مستضافًا على سلة. لم يُربط أي منها بحساب شريك سلة أو متجر معاينة؛ لذلك لم تُختبر على متجر سلة أو تُقدّم أو تُعتمد، ولا ينبغي اعتبارها جاهزة للتثبيت.

للفحص والبناء معًا من جذر المشروع:

```bash
corepack pnpm check:twilight
corepack pnpm build:twilight
```

عند إنشاء حساب الشريك، صدّر كل ثيم إلى مجلد جديد ليكون `twilight.json` في جذر مشروع مستقل:

```bash
corepack pnpm export:twilight -- leen ../leen-twilight-theme
corepack pnpm export:twilight -- mada ../mada-twilight-theme
corepack pnpm export:twilight -- wameed ../wameed-twilight-theme
corepack pnpm export:twilight -- ward ../ward-twilight-theme
corepack pnpm export:twilight -- qahwa ../qahwa-twilight-theme
```

راجع ملفات README داخل مجلدات الثيمات وخطط الانتقال للمعاينة: [`لِين`](./docs/SALLA_THEME_FIRST_DRAFT.md)، [`مَدى`](./docs/SALLA_THEME_SECOND_DRAFT.md)، [`وَميض`](./docs/SALLA_THEME_THIRD_DRAFT.md)، [`وَرد`](./docs/SALLA_THEME_FOURTH_DRAFT.md)، و[`قهوة`](./docs/SALLA_THEME_FIFTH_DRAFT.md).
