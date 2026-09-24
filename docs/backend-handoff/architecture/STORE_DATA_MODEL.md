# نموذج بيانات نَسَق

## الكيانات الأساسية

### Category

- `id`, `slug`, `name`, `description`, `icon`, `image`, `order`
- `themeCount` قيمة محسوبة في القراءة وليست مصدر بيانات مستقلًا.
- التصنيف الواحد يضم عدة Themes.

### Theme

- `id`, `slug`, `name`, `tagline`, `description`, `longDescription`
- `categoryId` مفتاح خارجي إلى Category.
- `industries[]`, `styleTags[]`, `features[]`, `featureGroups[]`
- `price`, `currency`, `priceType`, `compareAtPrice?`
- `status`, `lastUpdated`, `supportsRTL`, `responsive`
- `previewPalette`, `previewStoreName`, `previewHeadline`
- `compatibilityNote`, `requirements[]`
- `license { title, summary, terms[] }`
- `changelog[]`, `faq[]`
- السعر والادعاءات التجارية يجب أن تأتي من مصدر موثوق في الإنتاج، لا من mock fixtures.

### ThemeAsset

- `id`, `themeId`, `src`, `alt`, `kind`, `sortOrder`
- في الإنتاج تُخزّن الملفات بمخزن خاص، وتُصدر روابط مؤقتة للعميل عند الحاجة.
- لا تجعل رابط الملف الدائم عامًا إذا كان يتضمن ملفات ثيم قابلة للبيع.

### Review

- `id`, `themeId`, `authorId?`, `displayName`, `rating`, `title`, `body`, `createdAt`, `status`
- التقييمات في النسخة الحالية demo فقط، ويجب استبدالها بمراجعات حقيقية موثقة قبل الإطلاق.

### Cart / CartLine

- `Cart`: `id`, `customerId/sessionId`, `updatedAt`
- `CartLine`: `cartId`, `themeId`, `priceSnapshot`, `createdAt`
- النسخة الحالية تحفظ snapshot محليًا من دون حساب مستخدم أو مزامنة خادم.

### Order / OrderLine

- `Order`: `id`, `customerId`, `status`, `currency`, `subtotal`, `tax`, `discount`, `total`, `createdAt`
- `OrderLine`: `orderId`, `themeId`, `themeNameSnapshot`, `priceSnapshot`, `licenseSnapshot`
- الطلب المحلي في v1 هو `DemoOrderDto` فقط بحالة `demo-only`، ولا يمثل طلبًا مدفوعًا.

### PaymentIntent — للمستقبل فقط

- كيان يربط الطلب بمزود دفع عبر معرف خارجي وحالة موثقة.
- لا تخزن PAN/CVV أو أسرار الدفع في تطبيق الواجهة أو localStorage.
- التحقق من الدفع وwebhooks وتفعيل الترخيص مسؤولية خادم موثوق، لا المتصفح.

## العلاقات

```txt
Category 1 ─── * Theme 1 ─── * ThemeAsset
                       ├──── * Review
                       └──── * OrderLine ─── 1 Order ─── 0..1 PaymentIntent
Cart 1 ─── * CartLine ─── 1 Theme
```
