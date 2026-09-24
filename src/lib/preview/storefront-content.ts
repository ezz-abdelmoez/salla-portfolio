export type PreviewLanguage = "ar" | "en";

export type DemoPreviewProduct = {
  id: string;
  name: Record<PreviewLanguage, string>;
  description: Record<PreviewLanguage, string>;
  price: number;
  group: Record<PreviewLanguage, string>;
};

type ProductSeed = [string, string, string, string, string, number, string, string];
const products = (rows: ProductSeed[]): DemoPreviewProduct[] => rows.map(([id, nameAr, nameEn, descriptionAr, descriptionEn, price, groupAr, groupEn]) => ({
  id,
  name: { ar: nameAr, en: nameEn },
  description: { ar: descriptionAr, en: descriptionEn },
  price,
  group: { ar: groupAr, en: groupEn },
}));

export const previewProductsBySlug: Record<string, DemoPreviewProduct[]> = {
  leen: products([
    ["linen-abaya", "عباية نَسج", "Naseej Abaya", "قصة انسيابية بتفاصيل هادئة", "A fluid silhouette with considered details", 420, "عبايات", "Abayas"],
    ["linen-set", "طقم يومي", "Everyday Set", "اختيار مريح لكل يوم", "An easy choice for everyday wear", 315, "أطقم", "Sets"],
    ["linen-scarf", "وشاح لِين", "Leen Scarf", "ملمس ناعم ولمسة أخيرة", "A soft finishing touch", 125, "إكسسوارات", "Accessories"],
  ]),
  mada: products([
    ["mada-serum", "سيروم التوازن", "Balance Serum", "خطوة خفيفة ضمن روتينك", "A light step in your routine", 145, "العناية", "Skincare"],
    ["mada-routine", "روتين المساء", "Evening Routine", "ثلاث خطوات للعناية اليومية", "Three steps for daily care", 235, "روتين", "Routines"],
    ["mada-mist", "رذاذ الندى", "Dew Mist", "انتعاش يناسب كل وقت", "A refreshing moment, anytime", 89, "العناية", "Skincare"],
  ]),
  wameed: products([
    ["wameed-headphones", "سماعة موجة", "Mawja Headphones", "صوت واضح بتصميم خفيف", "Clear sound in a lightweight design", 429, "صوتيات", "Audio"],
    ["wameed-watch", "ساعة نبض", "Nabd Watch", "رفيقك للمهام اليومية", "A companion for everyday tasks", 579, "أجهزة", "Devices"],
    ["wameed-charger", "شاحن سريع", "Fast Charger", "حجم عملي للاستخدام اليومي", "A practical size for daily use", 149, "إكسسوارات", "Accessories"],
  ]),
  ward: products([
    ["ward-bouquet", "باقة صباح", "Morning Bouquet", "ألوان موسمية بتنسيق هادئ", "Seasonal color, thoughtfully arranged", 195, "باقات", "Bouquets"],
    ["ward-vase", "تنسيق بتلة", "Petal Arrangement", "هدية مكتملة في مزهرية", "A ready-to-gift vase arrangement", 260, "هدايا", "Gifts"],
    ["ward-card", "بطاقة إهداء", "Gift Note", "أضف كلماتك للمناسبة", "Add a message for the occasion", 25, "إضافات", "Add-ons"],
  ]),
  qahwa: products([
    ["qahwa-harvest", "محصول الموسم", "Seasonal Crop", "أضف بيانات المنشأ والتحميص الموثقة", "Add verified origin and roast details", 78, "محاصيل", "Coffee"],
    ["qahwa-drip", "مجموعة التقطير", "Pour-over Set", "عدة تحضير قابلة للتخصيص", "A customizable brewing setup", 185, "أدوات التحضير", "Brewing"],
    ["qahwa-cup", "كوب اليوم", "Daily Cup", "تفاصيل المنتج يحررها التاجر", "Product details are merchant-editable", 54, "أدوات التحضير", "Brewing"],
  ]),
};

export const fallbackProductsByCategory: Record<string, DemoPreviewProduct[]> = {
  "cat-food": products([
    ["food-selection", "تشكيلة الموسم", "Seasonal Selection", "منتجات مختارة لمتجرك", "A curated selection for your store", 95, "مختارات", "Selected"],
    ["food-gift", "صندوق ضيافة", "Hospitality Box", "عبوة يحدد تفاصيلها التاجر", "Packaging details set by the merchant", 145, "هدايا", "Gifts"],
    ["food-daily", "اختيار يومي", "Daily Pick", "معلومات من مصدر المنتج", "Details verified against the product source", 68, "مختارات", "Selected"],
  ]),
  "cat-home": products([
    ["home-object", "قطعة الموسم", "Seasonal Piece", "خامة وتفاصيل موضحة", "Materials and details clearly presented", 320, "ديكور", "Decor"],
    ["home-lamp", "ضوء هادئ", "Quiet Light", "تصميم يكمّل مساحتك", "A design that completes your space", 460, "إنارة", "Lighting"],
    ["home-vase", "مزهرية أثر", "Athar Vase", "لمسة طبيعية للمنزل", "A natural accent for the home", 185, "ديكور", "Decor"],
  ]),
  "cat-electronics": products([
    ["device-main", "جهازك القادم", "Your Next Device", "مواصفات واضحة في صفحة المنتج", "Clear specifications on the product page", 599, "أجهزة", "Devices"],
    ["device-audio", "صوت محمول", "Portable Audio", "اختيار عملي للمكتب والمنزل", "A practical choice for desk or home", 249, "صوتيات", "Audio"],
    ["device-accessory", "ملحق يومي", "Daily Accessory", "تفاصيل التوافق يضيفها التاجر", "Compatibility details supplied by the merchant", 89, "إكسسوارات", "Accessories"],
  ]),
  "cat-gifts": products([
    ["gift-box", "صندوق لحظتك", "A Moment Box", "اختر المناسبة والتغليف", "Choose an occasion and wrapping", 175, "هدايا", "Gifts"],
    ["gift-flowers", "تنسيق موسمي", "Seasonal Arrangement", "ألوان يحددها المتجر", "Colors selected by the store", 220, "باقات", "Bouquets"],
    ["gift-card", "بطاقة خاصة", "Personal Note", "أضف رسالتك للمناسبة", "Add a note for the occasion", 20, "إضافات", "Add-ons"],
  ]),
  "cat-beauty": products([
    ["beauty-serum", "سيروم يومي", "Daily Serum", "بيانات المنتج من مصدرها", "Product information from a verified source", 135, "العناية", "Skincare"],
    ["beauty-kit", "مجموعة العناية", "Care Set", "روتين يحرره المتجر", "A routine described by the store", 245, "روتين", "Routines"],
    ["beauty-mist", "رذاذ ناعم", "Soft Mist", "إضافة خفيفة لروتينك", "A light addition to your routine", 82, "العناية", "Skincare"],
  ]),
  "cat-fashion": products([
    ["fashion-main", "قطعة الموسم", "Seasonal Piece", "قصة مريحة وتفاصيل مختارة", "An easy silhouette with considered details", 290, "تشكيلة", "Collection"],
    ["fashion-set", "إطلالة يومية", "Everyday Look", "اختيارات من مجموعة المتجر", "A look from the store collection", 225, "تشكيلة", "Collection"],
    ["fashion-accessory", "إضافة أنيقة", "Finishing Touch", "أكمل تفاصيل إطلالتك", "Complete the look with one detail", 95, "إكسسوارات", "Accessories"],
  ]),
};

type ModuleCopy = { eyebrow: string; title: string; description: string; facts: [{ label: string; value: string }, { label: string; value: string }, { label: string; value: string }] };
type StorefrontCopy = {
  themeName: string; storeName: string; category: string; headline: string; tagline: string; announcement: string;
  heroDescription: string; storyTitle: string; storyDescription: string; productTitle: string; productDescription: string;
  searchPlaceholder: string; navHome: string; navShop: string; navStory: string; cta: string;
  features: [string, string, string]; module: ModuleCopy;
};

const moduleCopy = (eyebrow: string, title: string, description: string, facts: ModuleCopy["facts"]): ModuleCopy => ({ eyebrow, title, description, facts });

export const englishStorefrontCopy: Record<string, StorefrontCopy> = {
  leen: {
    themeName: "Leen", storeName: "Masa Space", category: "Fashion & Abayas", headline: "Quiet details, a look of your own", tagline: "Easy silhouettes, thoughtfully chosen.", announcement: "New season edit — explore the latest collection", heroDescription: "Discover refined pieces, with room for the details that matter.", storyTitle: "A wardrobe with room to breathe", storyDescription: "A calm, editorial storefront concept for fashion and abaya collections.", productTitle: "The collection", productDescription: "Sample products and prices are placeholders for the preview.", searchPlaceholder: "Search the collection", navHome: "Home", navShop: "Shop", navStory: "Our story", cta: "Explore the edit", features: ["Clear collection paths", "Fit notes merchants can edit", "A calm, image-led layout"],
    module: moduleCopy("Fit notes", "The details that help you choose", "Replace these prompts with verified product details from your store.", [{ label: "Sizing", value: "Merchant-managed options" }, { label: "Fabric", value: "Add details from the product listing" }, { label: "Care", value: "Follow the product care label" }]),
  },
  mada: {
    themeName: "Mada", storeName: "Nadi Skin", category: "Beauty & Care", headline: "Care that feels simple", tagline: "A thoughtful routine, at your own pace.", announcement: "A new routine starts here — discover the edit", heroDescription: "A bright, uncluttered storefront concept for everyday care.", storyTitle: "Small steps, made clear", storyDescription: "A flexible space for your brand story and verified product guidance.", productTitle: "The care edit", productDescription: "Sample products and prices are placeholders for the preview.", searchPlaceholder: "Search the care edit", navHome: "Home", navShop: "Shop", navStory: "Our story", cta: "Explore the routine", features: ["Simple category paths", "Space for product guidance", "A light, responsive layout"],
    module: moduleCopy("Your routine", "A considered care ritual", "Add accurate usage guidance from each product label; the preview does not verify claims.", [{ label: "Step 01", value: "Set by the merchant" }, { label: "Ingredients", value: "Use the verified product listing" }, { label: "Usage", value: "Follow the product instructions" }]),
  },
  wameed: {
    themeName: "Wameed", storeName: "Wameed Store", category: "Electronics", headline: "Choose your next everyday upgrade", tagline: "Technology, presented with clarity.", announcement: "New arrivals — find your next useful upgrade", heroDescription: "A crisp storefront concept built around products and specifications.", storyTitle: "Details make the difference", storyDescription: "Give verified specifications, compatibility notes, and support terms a clear place.", productTitle: "Featured tech", productDescription: "Sample products and prices are placeholders for the preview.", searchPlaceholder: "Search devices and accessories", navHome: "Home", navShop: "Shop", navStory: "About us", cta: "Browse the devices", features: ["Product-led navigation", "Space for verified specifications", "Responsive device cards"],
    module: moduleCopy("Tech details", "The specifications that matter", "Only publish specifications verified against the manufacturer's source.", [{ label: "Compatibility", value: "Confirm for each product" }, { label: "Warranty", value: "Add the store's actual terms" }, { label: "Specifications", value: "Verify against the manufacturer" }]),
  },
  ward: {
    themeName: "Ward", storeName: "Petal", category: "Flowers & Gifts", headline: "Little details, unforgettable moments", tagline: "Thoughtful gestures, with room for your message.", announcement: "A little something for every occasion", heroDescription: "A warm storefront concept for gifts, bouquets, and meaningful details.", storyTitle: "Make the gesture your own", storyDescription: "Showcase gifting options and editable occasion content without implying delivery services.", productTitle: "The gift edit", productDescription: "Sample products and prices are placeholders for the preview.", searchPlaceholder: "Search gifts and bouquets", navHome: "Home", navShop: "Shop", navStory: "Our story", cta: "Find a thoughtful gift", features: ["Occasion-led browsing", "Space for personal messages", "A warm, responsive layout"],
    module: moduleCopy("A personal touch", "Make it meaningful", "These are presentation prompts only; configure fulfillment in the real store.", [{ label: "Occasion", value: "Merchant-defined choices" }, { label: "Gift note", value: "Editable sample message" }, { label: "Wrapping", value: "Describe the actual option" }]),
  },
  qahwa: {
    themeName: "Qahwa", storeName: "Samt Roastery", category: "Coffee & Roastery", headline: "From bean to your moment", tagline: "Coffee, slowly; every detail from its source.", announcement: "A fresh roast, a slower moment — explore the edit", heroDescription: "A warm editorial storefront concept for coffee roasters and brewing gear.", storyTitle: "Good coffee starts with clear details", storyDescription: "A dedicated space for merchant-edited origin, roast, and brewing information.", productTitle: "Coffee & brewing", productDescription: "Sample products and prices are placeholders for the preview.", searchPlaceholder: "Search coffee and brewing gear", navHome: "Home", navShop: "Shop", navStory: "Our story", cta: "Explore the harvest", features: ["Editable origin notes", "Space for roast and brew details", "A warm, product-led layout"],
    module: moduleCopy("Origin, roast & brew", "Tell the coffee story clearly", "Use verified details only; this sample preview does not verify product claims.", [{ label: "Origin", value: "Add verified supplier details" }, { label: "Roast", value: "Use the product's actual roast profile" }, { label: "Brew", value: "Add a merchant-supplied suggestion" }]),
  },
};

export const arabicStorefrontModules: Record<string, ModuleCopy> = {
  leen: moduleCopy("ملاحظات المقاس", "تفاصيل تساعدك على الاختيار", "استبدل هذه التلميحات ببيانات المنتج الموثقة في متجرك.", [{ label: "المقاس", value: "خيارات يحددها التاجر" }, { label: "الخامة", value: "أضف التفاصيل من صفحة المنتج" }, { label: "العناية", value: "اتبع بطاقة العناية الفعلية" }]),
  mada: moduleCopy("روتينك", "خطوات عناية واضحة", "أضف إرشادات الاستخدام من ملصق المنتج؛ المعاينة لا تتحقق من الادعاءات.", [{ label: "الخطوة الأولى", value: "يحددها التاجر" }, { label: "المكونات", value: "انقلها من مصدر موثوق" }, { label: "طريقة الاستخدام", value: "اتبع تعليمات المنتج" }]),
  wameed: moduleCopy("تفاصيل تقنية", "المواصفات التي تهمك", "لا تعرض مواصفات إلا بعد مطابقتها مع المصدر الرسمي للمنتج.", [{ label: "التوافق", value: "تحقق منه لكل منتج" }, { label: "الضمان", value: "أضف شروط المتجر الفعلية" }, { label: "المواصفات", value: "راجع مصدر الشركة المصنعة" }]),
  ward: moduleCopy("لمسة شخصية", "اجعل الهدية أقرب", "هذه خيارات عرض فقط؛ إعداد تنفيذ الطلبات يكون من أدوات المتجر الفعلية.", [{ label: "المناسبة", value: "خيارات يحددها التاجر" }, { label: "رسالة الإهداء", value: "نص تجريبي قابل للتعديل" }, { label: "التغليف", value: "صف الخيار المتاح فعليًا" }]),
  qahwa: moduleCopy("المنشأ والتحميص والتحضير", "عرّف قهوتك كما هي", "استخدم بيانات موثقة فقط؛ لا تتحقق هذه المعاينة من معلومات المنتج.", [{ label: "المنشأ", value: "أضف بيانات المورد الموثقة" }, { label: "التحميص", value: "استخدم مستوى التحميص الفعلي" }, { label: "التحضير", value: "أضف اقتراحًا من المتجر" }]),
};

export const previewChrome = {
  ar: {
    announcement: "تشكيلة جديدة — اكتشف خيارات هذا الموسم", search: "ابحث عن منتج", home: "الرئيسية", shop: "المتجر", story: "قصتنا", preview: "محاكاة متجر محلية", disclaimer: "محاكاة محلية فقط. ليست معاينة من متجر سلة، ولا تتصل بدفع أو مخزون أو شحن. أسماء المنتجات وأسعارها تجريبية.", desktop: "سطح المكتب", tablet: "جهاز لوحي", mobile: "الجوال", favorites: "المفضلة", cart: "السلة التجريبية", products: "منتجات تجريبية", noResults: "ما لقينا نتائج. جرّب كلمة ثانية.", add: "أضف للسلة", added: "أُضيف تجريبيًا", details: "تفاصيل المنتج", close: "إغلاق", clear: "إفراغ السلة", emptyCart: "السلة التجريبية فارغة.", emptyFavorites: "ما أضفت منتجات للمفضلة بعد.", subtotal: "المجموع التجريبي", checkout: "إتمام تجريبي", storyTitle: "واجهة تبدأ من هوية علامتك", storyDescription: "هذه مساحة نموذجية للقصة والمزايا؛ عدّلها عند إعداد المتجر الفعلي.", collection: "تصفّح التشكيلة", collectionDescription: "عناصر وهمية لعرض شكل المتجر؛ استبدلها بمنتجاتك الفعلية لاحقًا.", featureTitle: "تفاصيل المتجر", featureDescription: "مساحات توضيحية قابلة للتخصيص في المتجر الفعلي.", cta: "تسوّق الآن", footer: "متجر تجريبي محلي — لا توجد معاملات فعلية.", footnote: "المعاينة هنا مولّدة داخل نَسَق ببيانات Mock. لم يتم تشغيل ملفات Twilight على متجر سلة، ولا تعني توافقًا أو اعتمادًا.",
  },
  en: {
    announcement: "A new collection — discover this season's edit", search: "Search products", home: "Home", shop: "Shop", story: "Our story", preview: "Local storefront simulation", disclaimer: "Local simulation only. This is not a Salla store preview and does not connect to payment, inventory, or shipping. Product names and prices are samples.", desktop: "Desktop", tablet: "Tablet", mobile: "Mobile", favorites: "Favorites", cart: "Demo cart", products: "sample products", noResults: "No matches. Try another search.", add: "Add to demo cart", added: "Added to demo cart", details: "Quick view", close: "Close", clear: "Clear cart", emptyCart: "Your demo cart is empty.", emptyFavorites: "You have not saved any sample products yet.", subtotal: "Demo subtotal", checkout: "Demo checkout", storyTitle: "A storefront shaped around your brand", storyDescription: "A sample space for your story and features; replace it when preparing a real store.", collection: "Explore the collection", collectionDescription: "Sample products for layout only; replace them with your real catalogue.", featureTitle: "Store highlights", featureDescription: "Sample feature spaces that can be adapted for a real storefront.", cta: "Shop the edit", footer: "Local demo store — no real transactions take place.", footnote: "This Nasaq preview uses mock data. Twilight templates are not running on Salla; no compatibility or approval is implied.",
  },
} as const;
