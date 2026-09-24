"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowUpLeft, Check, Heart, Menu, Search, ShoppingBag, Sparkles } from "lucide-react";
import type { ThemeDetailDto } from "@/lib/api/contracts/theme";
import { formatPrice } from "@/lib/utils";

type PreviewProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  group: string;
};

const productsBySlug: Record<string, PreviewProduct[]> = {
  leen: [
    { id: "linen-abaya", name: "عباية نَسج", description: "قصة انسيابية بتفاصيل هادئة", price: 420, group: "عبايات" },
    { id: "linen-set", name: "طقم يومي", description: "اختيار مريح لكل يوم", price: 315, group: "أطقم" },
    { id: "linen-scarf", name: "وشاح لِين", description: "ملمس ناعم ولمسة أخيرة", price: 125, group: "إكسسوارات" },
  ],
  mada: [
    { id: "mada-serum", name: "سيروم التوازن", description: "خطوة خفيفة ضمن روتينك", price: 145, group: "العناية" },
    { id: "mada-routine", name: "روتين المساء", description: "ثلاث خطوات للعناية اليومية", price: 235, group: "روتين" },
    { id: "mada-mist", name: "رذاذ الندى", description: "انتعاش يناسب كل وقت", price: 89, group: "العناية" },
  ],
  wameed: [
    { id: "wameed-headphones", name: "سماعة موجة", description: "صوت واضح بتصميم خفيف", price: 429, group: "صوتيات" },
    { id: "wameed-watch", name: "ساعة نبض", description: "رفيقك للمهام اليومية", price: 579, group: "أجهزة" },
    { id: "wameed-charger", name: "شاحن سريع", description: "حجم عملي للاستخدام اليومي", price: 149, group: "إكسسوارات" },
  ],
  ward: [
    { id: "ward-bouquet", name: "باقة صباح", description: "ألوان موسمية بتنسيق هادئ", price: 195, group: "باقات" },
    { id: "ward-vase", name: "تنسيق بتلة", description: "هدية مكتملة في مزهرية", price: 260, group: "هدايا" },
    { id: "ward-card", name: "بطاقة إهداء", description: "أضف كلماتك للمناسبة", price: 25, group: "إضافات" },
  ],
  qahwa: [
    { id: "qahwa-harvest", name: "محصول الموسم", description: "أضف بيانات المنشأ والتحميص الموثقة", price: 78, group: "محاصيل" },
    { id: "qahwa-drip", name: "مجموعة التقطير", description: "عدة تحضير قابلة للتخصيص", price: 185, group: "أدوات التحضير" },
    { id: "qahwa-cup", name: "كوب اليوم", description: "تفاصيل المنتج يحررها التاجر", price: 54, group: "أدوات التحضير" },
  ],
};

const fallbackProducts: Record<string, PreviewProduct[]> = {
  "cat-food": [
    { id: "food-selection", name: "تشكيلة الموسم", description: "منتجات مختارة لمتجرك", price: 95, group: "مختارات" },
    { id: "food-gift", name: "صندوق ضيافة", description: "عبوة يحدد تفاصيلها التاجر", price: 145, group: "هدايا" },
    { id: "food-daily", name: "اختيار يومي", description: "معلومات من مصدر المنتج", price: 68, group: "مختارات" },
  ],
  "cat-home": [
    { id: "home-object", name: "قطعة الموسم", description: "خامة وتفاصيل موضحة", price: 320, group: "ديكور" },
    { id: "home-lamp", name: "ضوء هادئ", description: "تصميم يكمّل مساحتك", price: 460, group: "إنارة" },
    { id: "home-vase", name: "مزهرية أثر", description: "لمسة طبيعية للمنزل", price: 185, group: "ديكور" },
  ],
  "cat-electronics": [
    { id: "device-main", name: "جهازك القادم", description: "مواصفات واضحة في صفحة المنتج", price: 599, group: "أجهزة" },
    { id: "device-audio", name: "صوت محمول", description: "اختيار عملي للمكتب والمنزل", price: 249, group: "صوتيات" },
    { id: "device-accessory", name: "ملحق يومي", description: "تفاصيل متوافقة يضيفها التاجر", price: 89, group: "إكسسوارات" },
  ],
  "cat-gifts": [
    { id: "gift-box", name: "صندوق لحظتك", description: "اختر المناسبة والتغليف", price: 175, group: "هدايا" },
    { id: "gift-flowers", name: "تنسيق موسمي", description: "ألوان يحددها المتجر", price: 220, group: "باقات" },
    { id: "gift-card", name: "بطاقة خاصة", description: "أضف رسالتك للمناسبة", price: 20, group: "إضافات" },
  ],
  "cat-beauty": [
    { id: "beauty-serum", name: "سيروم يومي", description: "بيانات المنتج من مصدرها", price: 135, group: "العناية" },
    { id: "beauty-kit", name: "مجموعة العناية", description: "روتين يحرره المتجر", price: 245, group: "روتين" },
    { id: "beauty-mist", name: "رذاذ ناعم", description: "إضافة خفيفة لروتينك", price: 82, group: "العناية" },
  ],
  "cat-fashion": [
    { id: "fashion-main", name: "قطعة الموسم", description: "قصة مريحة وتفاصيل مختارة", price: 290, group: "تشكيلة" },
    { id: "fashion-set", name: "إطلالة يومية", description: "اختيارات من مجموعة المتجر", price: 225, group: "تشكيلة" },
    { id: "fashion-accessory", name: "إضافة أنيقة", description: "أكمل تفاصيل إطلالتك", price: 95, group: "إكسسوارات" },
  ],
};

const editorialSlugs = new Set(["leen", "mada", "wameed", "ward", "qahwa"]);

export function LiveStorefrontPreview({ theme }: { theme: ThemeDetailDto }) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [activeGroup, setActiveGroup] = useState("الكل");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addedProduct, setAddedProduct] = useState("");

  const products = productsBySlug[theme.slug] ?? fallbackProducts[theme.categoryId] ?? fallbackProducts["cat-fashion"];
  const groups = ["الكل", ...new Set(products.map((product) => product.group))];
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesGroup = activeGroup === "الكل" || product.group === activeGroup;
    const matchesSearch = !search || `${product.name} ${product.description} ${product.group}`.includes(search.trim());
    return matchesGroup && matchesSearch;
  }), [activeGroup, products, search]);
  const heroImage = editorialSlugs.has(theme.slug) ? `/themes/previews/${theme.slug}-editorial.jpg` : theme.coverImage;
  const previewStyle = {
    "--store-background": theme.previewPalette.background,
    "--store-surface": theme.previewPalette.surface,
    "--store-primary": theme.previewPalette.primary,
    "--store-accent": theme.previewPalette.accent,
    "--store-ink": theme.previewPalette.text,
  } as CSSProperties;

  function toggleFavorite(productId: string) {
    setFavorites((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }

  return (
    <div className="local-store-preview page-shell">
      <div className="local-preview-heading">
        <div>
          <Link href={`/themes/${theme.slug}`} className="back-link"><ArrowLeft size={15} /> العودة لتفاصيل الثيم</Link>
          <p className="eyebrow"><Sparkles size={14} /> محاكاة متجر محلية</p>
          <h1>معاينة {theme.name}</h1>
          <p className="local-preview-description">تصفّح نموذجًا بصريًا متجاوبًا باسم «{theme.previewStoreName}»، مع محتوى وعناصر تفاعلية تجريبية.</p>
        </div>
        <div className="local-preview-controls" role="group" aria-label="حجم المعاينة">
          <button type="button" className={viewport === "desktop" ? "is-active" : ""} aria-pressed={viewport === "desktop"} onClick={() => setViewport("desktop")}>سطح المكتب</button>
          <button type="button" className={viewport === "mobile" ? "is-active" : ""} aria-pressed={viewport === "mobile"} onClick={() => setViewport("mobile")}>الجوال</button>
        </div>
      </div>

      <div className="local-preview-disclaimer" role="note">
        <span>!</span>
        <p><strong>محاكاة محلية فقط.</strong> ليست معاينة من متجر سلة، ولا تتصل بدفع أو مخزون أو شحن. أسماء المنتجات وأسعارها تجريبية.</p>
      </div>

      <div className={`local-store-stage local-store-stage--${viewport}`} style={previewStyle}>
        <div className="local-store-shell">
          <div className="local-store-announcement">تشكيلة جديدة — اكتشف خيارات هذا الموسم</div>
          <header className="local-store-header">
            <Link href="#store-home" className="local-store-logo">{theme.previewStoreName}<span>.</span></Link>
            <nav className="local-store-nav" aria-label="قائمة المتجر">
              <a href="#store-home">الرئيسية</a><a href="#store-products">المتجر</a><a href="#store-story">قصتنا</a>
            </nav>
            <label className="local-store-search"><Search size={16} /><input aria-label="ابحث في المنتجات التجريبية" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن منتج" /></label>
            <div className="local-store-actions">
              <button type="button" className="local-store-icon" aria-label={`${favorites.length} منتجات في المفضلة`}><Heart size={18} /><span>{favorites.length}</span></button>
              <button type="button" className="local-store-icon" aria-label={`${cartCount} منتجات في السلة التجريبية`}><ShoppingBag size={18} /><span>{cartCount}</span></button>
              <button type="button" className="local-store-menu" aria-label="القائمة"><Menu size={19} /></button>
            </div>
          </header>

          <main id="store-home">
            <section className="local-store-hero">
              <div className="local-store-hero-copy">
                <span className="local-store-kicker">مختارات {theme.categoryName}</span>
                <h2>{theme.previewHeadline}</h2>
                <p>{theme.tagline} {theme.slug === "qahwa" ? "تفاصيل المنشأ والتحميص يضيفها التاجر من مصادر موثوقة." : "تصفّح المجموعة واكتشف تفاصيلها."}</p>
                <a className="local-store-cta" href="#store-products">تسوّق الآن <ArrowUpLeft size={16} /></a>
                <span className="local-store-note">تصميم عربي · تجربة متجاوبة</span>
              </div>
              <div className="local-store-hero-image">
                <Image src={heroImage} alt={`صورة تحريرية لمعاينة ${theme.name}`} fill priority sizes={viewport === "mobile" ? "92vw" : "(max-width: 900px) 92vw, 50vw"} />
                <span>{theme.previewStoreName} / 01</span>
              </div>
            </section>

            <section className="local-store-benefits" aria-label="مزايا المتجر التجريبي">
              <div><span>01</span><p><strong>اختيارات واضحة</strong><small>تفاصيل قابلة للتخصيص</small></p></div>
              <div><span>02</span><p><strong>تجربة عربية</strong><small>تخطيط من اليمين لليسار</small></p></div>
              <div><span>03</span><p><strong>عرض متجاوب</strong><small>نموذج للشاشات المختلفة</small></p></div>
            </section>

            <section className="local-store-products" id="store-products">
              <div className="local-store-section-heading">
                <div><span className="local-store-kicker">من المتجر</span><h2>تصفّح التشكيلة</h2><p>عناصر وهمية لعرض شكل المتجر؛ استبدلها بمنتجاتك الفعلية لاحقًا.</p></div>
                <Link href={`/themes/${theme.slug}`} className="local-store-more">عن الثيم <ArrowLeft size={14} /></Link>
              </div>
              <div className="local-store-filter-row">
                <div className="local-store-filters" role="group" aria-label="تصفية المنتجات التجريبية">
                  {groups.map((group) => <button type="button" key={group} className={activeGroup === group ? "is-active" : ""} aria-pressed={activeGroup === group} onClick={() => setActiveGroup(group)}>{group}</button>)}
                </div>
                <span>{visibleProducts.length} منتجات تجريبية</span>
              </div>
              {visibleProducts.length ? <div className="local-store-product-grid">
                {visibleProducts.map((product, index) => {
                  const isFavorite = favorites.includes(product.id);
                  return <article className="local-store-product" key={product.id}>
                    <div className={`local-product-art local-product-art--${theme.categoryId.replace("cat-", "")}`}>
                      <span className={`local-product-object local-product-object--${index + 1}`} aria-hidden="true" />
                      <span className="local-product-label">{product.group}</span>
                      <button type="button" className={`local-product-favorite ${isFavorite ? "is-active" : ""}`} aria-label={isFavorite ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} للمفضلة`} aria-pressed={isFavorite} onClick={() => toggleFavorite(product.id)}><Heart size={16} fill={isFavorite ? "currentColor" : "none"} /></button>
                    </div>
                    <div className="local-product-copy"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>{formatPrice(product.price)}</strong></div>
                    <button type="button" className="local-product-add" onClick={() => { setCartCount((count) => count + 1); setAddedProduct(product.id); }}>{addedProduct === product.id ? <><Check size={15} /> أُضيف تجريبيًا</> : <><ShoppingBag size={15} /> أضف للسلة</>}</button>
                  </article>;
                })}
              </div> : <p className="local-store-empty">ما لقينا نتائج. جرّب كلمة ثانية.</p>}
            </section>

            <section className="local-store-story" id="store-story">
              <div className="local-store-story-mark">{theme.name.slice(0, 1)}</div>
              <div><span className="local-store-kicker">حكاية المتجر</span><h2>واجهة تبدأ من هوية علامتك</h2><p>{theme.description} هذه مساحة نموذجية للقصة والمزايا، ويمكن استبدال نصها عند إعداد المتجر الفعلي.</p></div>
              <Link href={`/themes/${theme.slug}`} className="local-store-cta local-store-cta--outline">تفاصيل الثيم <ArrowLeft size={15} /></Link>
            </section>
          </main>

          <footer className="local-store-footer"><Link href="#store-home" className="local-store-logo">{theme.previewStoreName}<span>.</span></Link><p>متجر تجريبي محلي — لا توجد معاملات فعلية.</p><a href="#store-home">العودة للأعلى ↑</a></footer>
        </div>
      </div>

      <p className="local-preview-footnote">المعاينة هنا مولّدة داخل نَسَق ببيانات Mock. لم يتم تشغيل ملفات Twilight على متجر سلة، ولا تعني توافقًا أو اعتمادًا.</p>
    </div>
  );
}
