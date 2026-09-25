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

توجد ست مسودات Twilight داخل `salla-themes/`، منفصلة عن كتالوج نَسَق التجريبي:

- **لِين** للعبايات والأزياء: [`salla-themes/leen/`](./salla-themes/leen/)
- **مَدى** للعناية بالبشرة والجمال: [`salla-themes/mada/`](./salla-themes/mada/)
- **وَميض** للإلكترونيات والأجهزة الذكية: [`salla-themes/wameed/`](./salla-themes/wameed/)
- **وَرد** للزهور والهدايا والمناسبات: [`salla-themes/ward/`](./salla-themes/ward/)
- **قهوة** للمحمصات ومتاجر القهوة المختصة: [`salla-themes/qahwa/`](./salla-themes/qahwa/)
- **مِسك** للعطور والعود والبخور: [`salla-themes/misk/`](./salla-themes/misk/)

لطلب تصميم مخصص، يتيح `/contact#custom-theme-request` نموذجًا توضيحيًا لوصف الفكرة والمجال والخيارات والمراجع. لن يُرسل الطلب أو يُحفظ حتى تُربط قناة تواصل فعلية.

كلها مسودات محلية مبنية على Theme Raed وبها مكوّنات قابلة للتخصيص، لكن لكل ثيم اتجاه تخطيط مرئي مستقل: لِين بدفتر أزياء تحريري، مَدى بخطوات روتين، وَميض بلوحات مواصفات داكنة، وَرد بدليل مناسبات، قهوة بقسم تحميص ممتد، ومِسك بهرم عطري. افتح `/themes/<slug>/preview` لمعاينة متجر محلية متعددة الصفحات لكل ثيم: الرئيسية، التشكيلة، تفاصيل المنتج، الحملة، من نحن، الأسئلة الشائعة، التواصل، السياسات، السلة وإتمام الطلب التجريبي. تعرض المعاينات صورًا تحريرية وصور منتجات وعناصر بصرية مخصصة، وتدعم العربية والإنجليزية وأحجام سطح المكتب والجهاز اللوحي والجوال. كل التفاعلات والنماذج والطلبات محلية ووهمية؛ لا تُرسل بيانات ولا تنفّذ دفعًا. هذه محاكاة React وليست تشغيلًا لقوالب Twilight أو متجرًا مستضافًا على سلة. لم يُربط أي منها بحساب شريك سلة أو متجر معاينة؛ لذلك لم تُختبر على متجر سلة أو تُقدّم أو تُعتمد، ولا ينبغي اعتبارها جاهزة للتثبيت.

للفحص والبناء معًا من جذر المشروع. قبل البناء أو بوابة الإصدار، ثبّت تبعيات مشاريع الثيمات الستة مرة واحدة:

```bash
for theme in leen mada wameed ward qahwa misk; do
  (cd "salla-themes/$theme" && corepack pnpm install --frozen-lockfile)
done

corepack pnpm check:twilight
corepack pnpm build:twilight
corepack pnpm check:theme-release-readiness
```

بوابة `check:theme-release-readiness` تعرض موانع البيع وتخرج بحالة محجوبة حتى توثيق الترخيص وبيانات الناشر واختبار متجر المعاينة ومراجعة سلة؛ راجع [خطة الجاهزية](./docs/SALLA_THEME_RELEASE_READINESS.md). نجاح البناء المحلي وحده لا يثبت التوافق أو الاعتماد.

عند إنشاء حساب الشريك، صدّر كل ثيم إلى مجلد جديد ليكون `twilight.json` في جذر مشروع مستقل:

```bash
corepack pnpm export:twilight -- leen ../leen-twilight-theme
corepack pnpm export:twilight -- mada ../mada-twilight-theme
corepack pnpm export:twilight -- wameed ../wameed-twilight-theme
corepack pnpm export:twilight -- ward ../ward-twilight-theme
corepack pnpm export:twilight -- qahwa ../qahwa-twilight-theme
corepack pnpm export:twilight -- misk ../misk-twilight-theme
```

راجع ملفات README داخل مجلدات الثيمات وخطط الانتقال للمعاينة: [`لِين`](./docs/SALLA_THEME_FIRST_DRAFT.md)، [`مَدى`](./docs/SALLA_THEME_SECOND_DRAFT.md)، [`وَميض`](./docs/SALLA_THEME_THIRD_DRAFT.md)، [`وَرد`](./docs/SALLA_THEME_FOURTH_DRAFT.md)، [`قهوة`](./docs/SALLA_THEME_FIFTH_DRAFT.md)، و[`مِسك`](./docs/SALLA_THEME_SIXTH_DRAFT.md).
