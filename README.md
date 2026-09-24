# نَسَق — متجر ثيمات لمنصة سلة

واجهة عربية RTL لمتجر مستقل يعرض معاينات تصميمية لثيمات التجارة الإلكترونية. النسخة الحالية تستخدم fixtures محلية؛ السلة والمفضلة محفوظتان محليًا، والطلب تجريبي فقط (لا دفع أو تنزيل أو تفعيل حقيقي).

> نَسَق مستقل وليس تابعًا لمنصة سلة أو ممثلًا لها. بيانات الأسعار والتقييمات والمعاينات تجريبية.

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

للاطلاع على مواصفات المشروع الكاملة: [`SALLA_THEME_STORE_PROJECT_PROMPT.md`](./SALLA_THEME_STORE_PROJECT_PROMPT.md).

## مشاريع Twilight — قيد التطوير

بدأنا مشروعين فعليين لثيمات Twilight، منفصلين عن كتالوج نَسَق التجريبي:

- **لِين** للعبايات والأزياء: [`salla-themes/leen/`](./salla-themes/leen/)
- **مَدى** للجمال والعناية، بطابع حديث واحترافي: [`salla-themes/mada/`](./salla-themes/mada/)

كلاهما مبني محليًا على Theme Raed ويحتوي مكوّنات قابلة لتخصيص التاجر. لم يُربط أيٌّ منهما بحساب شريك سلة أو متجر معاينة، لذلك لم يُختبر أو يُقدّم أو يُعتمد بعد، ولا ينبغي اعتباره قابلًا للتثبيت.

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
```

راجع ملف README داخل كل مجلد، وخطط الانتقال للمعاينة: [`لِين`](./docs/SALLA_THEME_FIRST_DRAFT.md)، [`مَدى`](./docs/SALLA_THEME_SECOND_DRAFT.md)، و[`وَميض`](./docs/SALLA_THEME_THIRD_DRAFT.md).
