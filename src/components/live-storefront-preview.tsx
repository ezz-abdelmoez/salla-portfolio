"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  ChevronDown,
  FileText,
  Heart,
  Mail,
  MapPin,
  Menu,
  Minus,
  Monitor,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tablet,
  Truck,
  X,
} from "lucide-react";
import type { ThemeDetailDto } from "@/lib/api/contracts/theme";
import { formatPrice } from "@/lib/utils";
import {
  arabicStorefrontModules,
  englishStorefrontCopy,
  fallbackProductsByCategory,
  previewChrome,
  previewProductsBySlug,
  type DemoPreviewProduct,
  type PreviewLanguage,
} from "@/lib/preview/storefront-content";
import { storefrontPagesCopy, type StorefrontPageId } from "@/lib/preview/storefront-pages";
import { storefrontVisuals } from "@/lib/preview/storefront-visuals";

type PreviewViewport = "desktop" | "tablet" | "mobile";
type PreviewPanel = "favorites" | null;
type StorefrontNavPage = "home" | "collection" | "campaign" | "about" | "faq" | "contact";

const editorialSlugs = new Set(["leen", "mada", "wameed", "ward", "qahwa", "misk"]);
const navigationPages: StorefrontNavPage[] = ["home", "collection", "campaign", "about", "faq", "contact"];
const englishCategoryNames: Record<string, string> = {
  "cat-fashion": "Fashion & Abayas",
  "cat-beauty": "Beauty & Care",
  "cat-home": "Home & Decor",
  "cat-food": "Food & Drink",
  "cat-electronics": "Electronics",
  "cat-gifts": "Flowers & Gifts",
};
const englishFallbackModule = {
  eyebrow: "Store details",
  title: "Clear details make choosing easier",
  description: "Replace these sample prompts with accurate information from your store.",
  facts: [
    { label: "Details", value: "Merchant-provided information" },
    { label: "Product care", value: "Use the actual product guidance" },
    { label: "Support", value: "Add your store's real terms" },
  ] as [{ label: string; value: string }, { label: string; value: string }, { label: string; value: string }],
};

export function LiveStorefrontPreview({ theme }: { theme: ThemeDetailDto }) {
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [language, setLanguage] = useState<PreviewLanguage>("ar");
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [addedProductId, setAddedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<DemoPreviewProduct | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [storePage, setStorePage] = useState<StorefrontPageId>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<PreviewPanel>(null);
  const [contactSent, setContactSent] = useState(false);

  const products = previewProductsBySlug[theme.slug] ?? fallbackProductsByCategory[theme.categoryId] ?? fallbackProductsByCategory["cat-fashion"];
  const englishCopy = englishStorefrontCopy[theme.slug];
  const copy = language === "en" ? englishCopy : undefined;
  const chrome = previewChrome[language];
  const pageCopy = storefrontPagesCopy[language];
  const visual = storefrontVisuals[theme.slug];
  const visualCopy = visual?.copy[language];
  const storeName = copy?.storeName ?? theme.previewStoreName;
  const categoryName = copy?.category ?? (language === "en" ? englishCategoryNames[theme.categoryId] ?? "Lifestyle" : theme.categoryName);
  const headline = copy?.headline ?? (language === "en" ? `Explore the ${categoryName.toLowerCase()} collection` : theme.previewHeadline);
  const tagline = copy?.tagline ?? (language === "en" ? "A sample storefront with room for clear product details." : theme.tagline);
  const heroDescription = copy?.heroDescription ?? (language === "en" ? "Browse sample products and store details in this local storefront concept." : theme.slug === "qahwa" ? "تفاصيل المنشأ والتحميص يضيفها التاجر من مصادر موثوقة." : "تصفّح المجموعة واكتشف تفاصيلها.");
  const productsTitle = copy?.productTitle ?? chrome.collection;
  const productsDescription = copy?.productDescription ?? chrome.collectionDescription;
  const storyTitle = copy?.storyTitle ?? chrome.storyTitle;
  const storyDescription = copy?.storyDescription ?? chrome.storyDescription;
  const moduleContent = copy?.module ?? (language === "en" ? englishFallbackModule : arabicStorefrontModules[theme.slug]) ?? {
    eyebrow: theme.featureGroups[0]?.title ?? chrome.featureTitle,
    title: theme.featureGroups[0]?.items[0] ?? headline,
    description: theme.description,
    facts: [0, 1, 2].map((index) => ({
      label: `0${index + 1}`,
      value: theme.featureGroups.flatMap((group) => group.items)[index] ?? chrome.featureDescription,
    })) as [{ label: string; value: string }, { label: string; value: string }, { label: string; value: string }],
  };
  const features = copy?.features ?? (language === "en" ? [
    "Clear collection paths",
    "Space for store details",
    "A responsive storefront",
  ] : [
    theme.featureGroups[0]?.items[0] ?? "مساحات قابلة للتخصيص",
    theme.featureGroups[0]?.items[1] ?? "محتوى يحرره التاجر",
    theme.featureGroups[1]?.items[0] ?? "تخطيط متجاوب",
  ]);
  const groups = ["all", ...new Set(products.map((product) => product.group[language]))];
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesGroup = activeGroup === "all" || product.group[language] === activeGroup;
    const searchableContent = `${product.name[language]} ${product.description[language]} ${product.group[language]}`.toLocaleLowerCase();
    const matchesSearch = !search || searchableContent.includes(search.trim().toLocaleLowerCase());
    return matchesGroup && matchesSearch;
  }), [activeGroup, language, products, search]);
  const heroImage = editorialSlugs.has(theme.slug) ? `/themes/previews/${theme.slug}-editorial.jpg` : theme.coverImage;
  const storyImage = visual?.image ?? heroImage;
  const stageStyle = {
    "--store-background": theme.previewPalette.background,
    "--store-surface": theme.previewPalette.surface,
    "--store-primary": theme.previewPalette.primary,
    "--store-accent": theme.previewPalette.accent,
    "--store-ink": theme.previewPalette.text,
  } as CSSProperties;
  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const cartProducts = cartIds.map((id) => productsById.get(id)).filter((product): product is DemoPreviewProduct => Boolean(product));
  const favoriteProducts = favoriteIds.map((id) => productsById.get(id)).filter((product): product is DemoPreviewProduct => Boolean(product));
  const cartTotal = cartProducts.reduce((sum, product) => sum + product.price, 0);
  const formatPreviewPrice = (price: number) => language === "en"
    ? new Intl.NumberFormat("en-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(price)
    : formatPrice(price);

  function getProductImage(product: DemoPreviewProduct) {
    if (!visual?.productImages.length) return undefined;
    const productIndex = products.findIndex((item) => item.id === product.id);
    return visual.productImages[productIndex < 0 ? 0 : productIndex % visual.productImages.length];
  }

  useEffect(() => {
    if (!openPanel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPanel(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPanel]);

  function navigateTo(page: StorefrontPageId) {
    setStorePage(page);
    setMobileMenuOpen(false);
    setOpenPanel(null);
    setContactSent(false);
    if (page !== "product") setSelectedProduct(null);
  }

  function openProduct(product: DemoPreviewProduct) {
    setSelectedProduct(product);
    setSelectedQuantity(1);
    navigateTo("product");
    setSelectedProduct(product);
  }

  function toggleFavorite(productId: string) {
    setFavoriteIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }

  function addToDemoCart(product: DemoPreviewProduct, quantity = 1) {
    setCartIds((current) => [...current, ...Array.from({ length: quantity }, () => product.id)]);
    setAddedProductId(product.id);
  }

  function removeCartItem(indexToRemove: number) {
    setCartIds((current) => current.filter((_, index) => index !== indexToRemove));
  }

  function showFavorites() {
    setOpenPanel("favorites");
  }

  function openSearchResults() {
    setActiveGroup("all");
    navigateTo("collection");
  }

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactSent(true);
  }

  function submitDemoOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCartIds([]);
    setSelectedProduct(null);
    navigateTo("order");
  }

  function renderNavigation(className: string) {
    return (
      <nav className={className} aria-label={language === "en" ? "Store navigation" : "قائمة المتجر"}>
        {navigationPages.map((page) => (
          <button
            type="button"
            key={page}
            className={storePage === page ? "is-active" : ""}
            aria-current={storePage === page ? "page" : undefined}
            onClick={() => navigateTo(page)}
          >
            {pageCopy.nav[page]}
          </button>
        ))}
      </nav>
    );
  }

  function renderProductCards(items: DemoPreviewProduct[]) {
    if (!items.length) return <p className="local-store-empty">{chrome.noResults}</p>;
    return (
      <div className="local-store-product-grid">
        {items.map((product, index) => {
          const isFavorite = favoriteIds.includes(product.id);
          const productImage = getProductImage(product);
          return (
            <article className="local-store-product" key={product.id}>
              <div className={`local-product-art local-product-art--${theme.categoryId.replace("cat-", "")}${productImage ? " local-product-art--photo" : ""}`}>
                <button type="button" className="local-product-open" onClick={() => openProduct(product)} aria-label={`${chrome.details}: ${product.name[language]}`}>
                  {productImage ? <Image src={productImage} alt="" fill sizes="(max-width: 440px) 48vw, (max-width: 760px) 32vw, 22vw" /> : <span className={`local-product-object local-product-object--${(index % 3) + 1}`} aria-hidden="true" />}
                </button>
                <span className="local-product-label">{product.group[language]}</span>
                <button
                  type="button"
                  className={`local-product-favorite ${isFavorite ? "is-active" : ""}`}
                  aria-label={isFavorite ? `${language === "en" ? "Remove" : "إزالة"} ${product.name[language]}` : `${language === "en" ? "Save" : "إضافة"} ${product.name[language]}`}
                  aria-pressed={isFavorite}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="local-product-copy">
                <button type="button" className="local-product-name" onClick={() => openProduct(product)}>
                  <h3>{product.name[language]}</h3>
                  <p>{product.description[language]}</p>
                </button>
                <strong>{formatPreviewPrice(product.price)}</strong>
              </div>
              <div className="local-product-actions">
                <button type="button" className="local-product-details" onClick={() => openProduct(product)}>{chrome.details}</button>
                <button type="button" className="local-product-add" onClick={() => addToDemoCart(product)}>
                  {addedProductId === product.id ? <><Check size={15} /> {chrome.added}</> : <><ShoppingBag size={15} /> {chrome.add}</>}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  function renderBreadcrumb(label: string, parent?: "collection" | "cart") {
    return (
      <nav className="local-store-breadcrumbs" aria-label={language === "en" ? "Breadcrumb" : "مسار الصفحة"}>
        <button type="button" onClick={() => navigateTo("home")}>{pageCopy.breadcrumbHome}</button>
        {parent && <>
          <span aria-hidden="true">/</span>
          <button type="button" onClick={() => navigateTo(parent)}>{parent === "collection" ? pageCopy.nav.collection : pageCopy.cart.title}</button>
        </>}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{label}</span>
      </nav>
    );
  }

  function renderThemeVisualization() {
    if (!visual || !visualCopy) return null;
    const merchantDetail = language === "en" ? "Merchant-provided detail" : "تفصيل يضيفه التاجر";

    return (
      <section className={`local-theme-showcase local-theme-showcase--${visual.kind}`} aria-label={visualCopy.title}>
        <div className="local-theme-showcase-heading">
          <div><span className="local-store-kicker">{visualCopy.eyebrow}</span><h2>{visualCopy.title}</h2><p>{visualCopy.description}</p></div>
        </div>
        <div className="local-theme-showcase-layout">
          <figure className="local-theme-showcase-photo">
            <Image src={visual.image} alt={visual.alt[language]} fill sizes="(max-width: 760px) 90vw, 48vw" />
            <figcaption>{visualCopy.caption}</figcaption>
          </figure>
          <div className={`local-theme-visual local-theme-visual--${visual.kind}`}>
            {visual.kind === "lookbook" && <div className="local-lookbook-index">
              {visualCopy.labels.map((label, index) => <article key={label}><span>0{index + 1}</span><strong>{label}</strong><small>{merchantDetail}</small></article>)}
            </div>}
            {visual.kind === "routine" && <ol className="local-routine-steps">
              {visualCopy.labels.map((label, index) => <li key={label}><span>0{index + 1}</span><div><strong>{label}</strong><small>{merchantDetail}</small></div><ArrowUpLeft size={15} aria-hidden="true" /></li>)}
            </ol>}
            {visual.kind === "specs" && <div className="local-specs-grid">
              {visualCopy.labels.map((label, index) => <article key={label}><span>0{index + 1}</span><strong>{label}</strong><small>{merchantDetail}</small></article>)}
            </div>}
            {visual.kind === "occasions" && <div className="local-occasion-cards">
              {visualCopy.labels.map((label, index) => <article key={label}><span className={`local-occasion-mark local-occasion-mark--${index + 1}`} aria-hidden="true">{index === 0 ? "✳" : index === 1 ? "✦" : "♡"}</span><strong>{label}</strong><small>{language === "en" ? "A sample idea" : "فكرة تجريبية"}</small></article>)}
            </div>}
            {visual.kind === "roast" && <div className="local-roast-chart">
              {visualCopy.labels.map((label, index) => <div className="local-roast-row" key={label}><div><strong>{label}</strong><span>{language === "en" ? "Sample" : "تجريبي"}</span></div><span className="local-roast-meter" style={{ "--visual-bar": `${[44, 66, 53][index]}%` } as CSSProperties} aria-hidden="true" /></div>)}
            </div>}
            {visual.kind === "scent" && <div className="local-scent-pyramid">
              {visualCopy.labels.map((label, index) => <article className={`local-scent-layer local-scent-layer--${index + 1}`} key={label}><span>0{index + 1}</span><strong>{label}</strong><small>{merchantDetail}</small></article>)}
            </div>}
            <p className="local-theme-visual-note">{visualCopy.note}</p>
          </div>
        </div>
      </section>
    );
  }

  function renderProductSection(items: DemoPreviewProduct[], title: string, description: string, showFilters = false) {
    return (
      <section className="local-store-products local-store-products--page">
        <div className="local-store-section-heading">
          <div>
            <span className="local-store-kicker">{storeName}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {storePage !== "collection" && <button type="button" className="local-store-more" onClick={() => navigateTo("collection")}>{pageCopy.nav.collection} <ArrowLeft size={14} /></button>}
        </div>
        {showFilters && <div className="local-store-filter-row">
          <div className="local-store-filters" role="group" aria-label={language === "en" ? "Filter sample products" : "تصفية المنتجات التجريبية"}>
            <button type="button" className={activeGroup === "all" ? "is-active" : ""} aria-pressed={activeGroup === "all"} onClick={() => setActiveGroup("all")}>{pageCopy.collection.all}</button>
            {groups.filter((group) => group !== "all").map((group) => (
              <button type="button" key={group} className={activeGroup === group ? "is-active" : ""} aria-pressed={activeGroup === group} onClick={() => setActiveGroup(group)}>{group}</button>
            ))}
          </div>
          <span>{items.length} {pageCopy.collection.resultCount}</span>
        </div>}
        {renderProductCards(items)}
      </section>
    );
  }

  return (
    <div className="local-store-preview page-shell" style={stageStyle}>
      <div className="local-preview-heading">
        <div>
          <Link href={`/themes/${theme.slug}`} className="back-link"><ArrowLeft size={15} /> {language === "en" ? "Back to theme details" : "العودة لتفاصيل الثيم"}</Link>
          <p className="eyebrow"><Sparkles size={14} /> {chrome.preview}</p>
          <h1>{language === "en" ? `Full storefront preview: ${copy?.themeName ?? theme.name}` : `معاينة المتجر الكامل: ${theme.name}`}</h1>
          <p className="local-preview-description">{language === "en" ? `Navigate home, product, campaign, about, FAQ, contact, cart, and demo checkout pages for ${storeName}.` : `تنقّل بين الرئيسية والمنتجات والحملة ومن نحن والأسئلة والسلة وإتمام تجريبي لمتجر «${storeName}».`}</p>
        </div>
        <div className="local-preview-toolbar">
          <div className="local-preview-controls local-preview-language" role="group" aria-label={language === "en" ? "Preview language" : "لغة المعاينة"}>
            <button type="button" className={language === "ar" ? "is-active" : ""} aria-pressed={language === "ar"} onClick={() => { setLanguage("ar"); setActiveGroup("all"); }}>عربي</button>
            <button type="button" className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => { setLanguage("en"); setActiveGroup("all"); }}>EN</button>
          </div>
          <div className="local-preview-controls local-preview-devices" role="group" aria-label={language === "en" ? "Preview size" : "حجم المعاينة"}>
            <button type="button" className={viewport === "desktop" ? "is-active" : ""} aria-pressed={viewport === "desktop"} onClick={() => setViewport("desktop")}><Monitor size={14} /><span>{chrome.desktop}</span></button>
            <button type="button" className={viewport === "tablet" ? "is-active" : ""} aria-pressed={viewport === "tablet"} onClick={() => setViewport("tablet")}><Tablet size={14} /><span>{chrome.tablet}</span></button>
            <button type="button" className={viewport === "mobile" ? "is-active" : ""} aria-pressed={viewport === "mobile"} onClick={() => setViewport("mobile")}><Smartphone size={14} /><span>{chrome.mobile}</span></button>
          </div>
        </div>
      </div>

      <div className="local-preview-disclaimer" role="note" lang={language}>
        <span>!</span>
        <p>{chrome.disclaimer}</p>
      </div>

      <div className={`local-store-stage local-store-stage--${viewport} local-store-theme--${theme.slug}`} style={stageStyle} dir={language === "en" ? "ltr" : "rtl"} lang={language}>
        <div className="local-store-shell">
          <div className="local-store-announcement">{copy?.announcement ?? chrome.announcement}</div>
          <header className="local-store-header">
            <button type="button" className="local-store-logo" onClick={() => navigateTo("home")} aria-label={storeName}>
              {storeName}<span>.</span>
            </button>
            {renderNavigation("local-store-nav")}
            <label className="local-store-search">
              <Search size={16} />
              <input
                aria-label={copy?.searchPlaceholder ?? chrome.search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") openSearchResults(); }}
                placeholder={copy?.searchPlaceholder ?? chrome.search}
              />
            </label>
            <div className="local-store-actions">
              <button type="button" className="local-store-icon" aria-label={`${chrome.favorites}: ${favoriteIds.length}`} onClick={showFavorites}>
                <Heart size={18} /><span>{favoriteIds.length}</span>
              </button>
              <button type="button" className="local-store-icon" aria-label={`${chrome.cart}: ${cartIds.length}`} onClick={() => navigateTo("cart")}>
                <ShoppingBag size={18} /><span>{cartIds.length}</span>
              </button>
              <button type="button" className="local-store-menu" aria-label={language === "en" ? "Menu" : "القائمة"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
                {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </header>
          {mobileMenuOpen && renderNavigation("local-store-mobile-menu")}

          <main id="store-content" className={`local-store-main local-store-main--${storePage}`}>
            {storePage === "home" && <>
              <section className={`local-store-hero local-store-hero--${theme.slug}`}>
                <div className="local-store-hero-copy">
                  <span className="local-store-kicker">{language === "en" ? `Curated ${categoryName}` : `مختارات ${categoryName}`}</span>
                  <h1>{headline}</h1>
                  <p>{tagline} {heroDescription}</p>
                  <button type="button" className="local-store-cta" onClick={() => navigateTo("collection")}>{copy?.cta ?? chrome.cta} <ArrowUpLeft size={16} /></button>
                  <span className="local-store-note">{language === "en" ? "Responsive concept · Sample content" : "تصميم عربي · محتوى تجريبي"}</span>
                </div>
                <div className="local-store-hero-image">
                  <Image src={heroImage} alt={language === "en" ? `Editorial image for ${copy?.themeName ?? theme.name}` : `صورة تحريرية لمعاينة ${theme.name}`} fill priority sizes={viewport === "mobile" ? "92vw" : viewport === "tablet" ? "80vw" : "(max-width: 900px) 92vw, 50vw"} />
                  <span>{storeName} / 01</span>
                </div>
              </section>

              <section className="local-store-benefits" aria-label={chrome.featureTitle}>
                {features.map((feature, index) => (
                  <div key={feature}><span>0{index + 1}</span><p><strong>{feature}</strong><small>{language === "en" ? ["Explore the edit", "Merchant-editable details", "A responsive storefront"][index] : "تفاصيل قابلة للتخصيص"}</small></p></div>
                ))}
              </section>

              {renderThemeVisualization()}

              <section className="local-store-signature" aria-labelledby="local-store-signature-title">
                <div className="local-store-signature-intro"><span className="local-store-kicker">{moduleContent.eyebrow}</span><h2 id="local-store-signature-title">{moduleContent.title}</h2><p>{moduleContent.description}</p></div>
                <div className="local-store-signature-grid">
                  {moduleContent.facts.map((fact, index) => <article key={fact.label}><span>0{index + 1}</span><small>{fact.label}</small><strong>{fact.value}</strong></article>)}
                </div>
              </section>

              <section className="local-campaign-teaser">
                <div><span className="local-store-kicker">{pageCopy.campaign.eyebrow}</span><h2>{pageCopy.campaign.title}</h2><p>{pageCopy.campaign.description}</p></div>
                <button type="button" className="local-store-cta local-store-cta--outline" onClick={() => navigateTo("campaign")}>{pageCopy.campaign.button} <ArrowUpLeft size={15} /></button>
              </section>

              {renderProductSection(products.slice(0, 3), productsTitle, productsDescription)}

              <section className="local-store-story" id="store-story">
                <div className="local-store-story-mark">{copy?.themeName.slice(0, 1) ?? theme.name.slice(0, 1)}</div>
                <div><span className="local-store-kicker">{storeName}</span><h2>{storyTitle}</h2><p>{storyDescription}</p></div>
                <button type="button" className="local-store-cta local-store-cta--outline" onClick={() => navigateTo("about")}>{pageCopy.nav.about} <ArrowLeft size={15} /></button>
              </section>

              <section className="local-home-faq">
                <div><span className="local-store-kicker">{pageCopy.faq.eyebrow}</span><h2>{pageCopy.faq.title}</h2><p>{pageCopy.faq.description}</p></div>
                <button type="button" className="local-store-more" onClick={() => navigateTo("faq")}>{language === "en" ? "View questions" : "عرض الأسئلة"} <ArrowLeft size={14} /></button>
              </section>
            </>}

            {storePage === "collection" && <>
              {renderBreadcrumb(pageCopy.collection.title)}
              <section className="local-store-page-heading">
                <span className="local-store-kicker">{pageCopy.collection.eyebrow}</span>
                <h1>{productsTitle}</h1>
                <p>{productsDescription}</p>
              </section>
              {renderProductSection(visibleProducts, productsTitle, productsDescription, true)}
            </>}

            {storePage === "campaign" && <>
              {renderBreadcrumb(pageCopy.campaign.title)}
              <section className="local-campaign-hero">
                <div className="local-campaign-copy">
                  <span className="local-store-kicker">{pageCopy.campaign.eyebrow}</span>
                  <h1>{pageCopy.campaign.title}</h1>
                  <p>{pageCopy.campaign.description}</p>
                  <span className="local-campaign-note">{pageCopy.campaign.sampleNote}</span>
                  <button type="button" className="local-store-cta" onClick={() => document.getElementById("campaign-products")?.scrollIntoView({ behavior: "smooth", block: "start" })}>{pageCopy.campaign.button} <ArrowUpLeft size={16} /></button>
                </div>
                <div className="local-campaign-image"><Image src={storyImage} alt={language === "en" ? `Sample campaign image for ${storeName}` : `صورة تجريبية لحملة ${storeName}`} fill sizes="(max-width: 760px) 90vw, 48vw" /></div>
              </section>
              <div className="local-store-campaign-disclaimer"><span>!</span><p>{pageCopy.campaign.sampleNote}</p></div>
              <div id="campaign-products">{renderProductSection(products, productsTitle, productsDescription)}</div>
            </>}

            {storePage === "product" && selectedProduct && <>
              {renderBreadcrumb(selectedProduct.name[language], "collection")}
              <section className="local-store-product-page">
                <div className={`local-product-art local-product-art--large local-product-art--${theme.categoryId.replace("cat-", "")}${getProductImage(selectedProduct) ? " local-product-art--photo" : ""}`}>
                  {getProductImage(selectedProduct) ? <Image src={getProductImage(selectedProduct) ?? heroImage} alt={selectedProduct.name[language]} fill sizes="(max-width: 760px) 92vw, 48vw" /> : <span className="local-product-object local-product-object--1" aria-hidden="true" />}
                  <span className="local-product-label">{selectedProduct.group[language]}</span>
                  <button type="button" className={`local-product-favorite local-product-favorite--detail ${favoriteIds.includes(selectedProduct.id) ? "is-active" : ""}`} aria-label={pageCopy.product.favorite} aria-pressed={favoriteIds.includes(selectedProduct.id)} onClick={() => toggleFavorite(selectedProduct.id)}><Heart size={18} fill={favoriteIds.includes(selectedProduct.id) ? "currentColor" : "none"} /></button>
                </div>
                <div className="local-product-detail-copy">
                  <span className="local-store-kicker">{selectedProduct.group[language]}</span>
                  <h1>{selectedProduct.name[language]}</h1>
                  <p className="local-product-detail-description">{selectedProduct.description[language]}</p>
                  <strong className="local-product-detail-price">{formatPreviewPrice(selectedProduct.price)}</strong>
                  <p className="local-product-detail-sample">{pageCopy.product.sampleNote}</p>
                  <div className="local-quantity-control" aria-label={pageCopy.product.quantity}>
                    <span>{pageCopy.product.quantity}</span>
                    <div>
                      <button type="button" aria-label={language === "en" ? "Decrease quantity" : "تقليل الكمية"} disabled={selectedQuantity <= 1} onClick={() => setSelectedQuantity((quantity) => Math.max(1, quantity - 1))}><Minus size={14} /></button>
                      <output aria-live="polite">{selectedQuantity}</output>
                      <button type="button" aria-label={language === "en" ? "Increase quantity" : "زيادة الكمية"} onClick={() => setSelectedQuantity((quantity) => Math.min(99, quantity + 1))}><Plus size={14} /></button>
                    </div>
                  </div>
                  <button type="button" className="local-store-cta local-product-detail-add" onClick={() => addToDemoCart(selectedProduct, selectedQuantity)}>
                    {addedProductId === selectedProduct.id ? <Check size={16} /> : <ShoppingBag size={16} />}
                    {addedProductId === selectedProduct.id ? pageCopy.product.added : pageCopy.product.add}
                  </button>
                  <button type="button" className="local-product-back" onClick={() => navigateTo("collection")}><ArrowLeft size={14} /> {pageCopy.product.back}</button>
                </div>
              </section>
              <section className="local-product-details-panel">
                <h2>{pageCopy.product.details}</h2>
                <p>{selectedProduct.description[language]}</p>
                <dl><div><dt>{language === "en" ? "Category" : "التصنيف"}</dt><dd>{selectedProduct.group[language]}</dd></div><div><dt>{language === "en" ? "Store" : "المتجر"}</dt><dd>{storeName}</dd></div></dl>
              </section>
              {renderProductSection(products.filter((product) => product.id !== selectedProduct.id), pageCopy.product.related, productsDescription)}
            </>}

            {storePage === "about" && <>
              {renderBreadcrumb(pageCopy.nav.about)}
              <section className="local-about-hero">
                <span className="local-store-kicker">{pageCopy.about.eyebrow} · {storeName}</span>
                <h1>{storyTitle}</h1>
                <p>{storyDescription}</p>
              </section>
              <section className="local-about-details">
                <div><span className="local-store-kicker">{pageCopy.about.eyebrow}</span><h2>{pageCopy.about.detailsTitle}</h2><p>{pageCopy.about.details}</p></div>
                <div className="local-about-value-list"><h2>{pageCopy.about.valuesTitle}</h2>{features.map((feature, index) => <article key={feature}><span>0{index + 1}</span><div><strong>{feature}</strong><p>{moduleContent.facts[index]?.value}</p></div></article>)}</div>
              </section>
              <div className="local-page-cta"><span>{language === "en" ? "Ready to explore?" : "جاهز لاستكشاف المجموعة؟"}</span><button type="button" className="local-store-cta" onClick={() => navigateTo("collection")}>{pageCopy.nav.collection} <ArrowLeft size={15} /></button></div>
            </>}

            {storePage === "faq" && <>
              {renderBreadcrumb(pageCopy.faq.title)}
              <section className="local-store-page-heading local-store-page-heading--center">
                <span className="local-store-kicker">{pageCopy.faq.eyebrow}</span><h1>{pageCopy.faq.title}</h1><p>{pageCopy.faq.description}</p>
              </section>
              <section className="local-faq-list">
                {pageCopy.faq.items.map((item, index) => <details className="local-faq-item" key={item.question} open={index === 0}><summary><span>{item.question}</span><ChevronDown size={17} /></summary><p>{item.answer}</p></details>)}
              </section>
              <div className="local-faq-contact"><div><strong>{language === "en" ? "Still need help?" : "ما زلت تحتاج إلى المساعدة؟"}</strong><span>{pageCopy.contact.description}</span></div><button type="button" className="local-store-cta local-store-cta--outline" onClick={() => navigateTo("contact")}>{pageCopy.nav.contact} <ArrowLeft size={14} /></button></div>
            </>}

            {storePage === "contact" && <>
              {renderBreadcrumb(pageCopy.nav.contact)}
              <section className="local-contact-page">
                <div className="local-contact-intro"><span className="local-store-kicker">{pageCopy.contact.eyebrow}</span><h1>{pageCopy.contact.title}</h1><p>{pageCopy.contact.description}</p>
                  <div className="local-contact-channels">
                    <article><Phone size={17} /><div><strong>{pageCopy.contact.phone}</strong><span>{pageCopy.contact.placeholder}</span></div></article>
                    <article><Mail size={17} /><div><strong>{pageCopy.contact.email}</strong><span>{pageCopy.contact.placeholder}</span></div></article>
                    <article><MapPin size={17} /><div><strong>{pageCopy.contact.hours}</strong><span>{pageCopy.contact.placeholder}</span></div></article>
                  </div>
                </div>
                <form className="local-contact-form" onSubmit={submitContact}>
                  <h2>{pageCopy.contact.formTitle}</h2>
                  <label>{pageCopy.contact.name}<input name="name" autoComplete="off" placeholder={language === "en" ? "Sample name" : "اسم تجريبي"} required /></label>
                  <label>{pageCopy.contact.emailLabel}<input name="email" type="email" autoComplete="off" placeholder="example@email.test" required /></label>
                  <label>{pageCopy.contact.message}<textarea name="message" rows={4} placeholder={language === "en" ? "Sample message" : "رسالة تجريبية"} required /></label>
                  <button className="local-store-cta" type="submit">{pageCopy.contact.submit}</button>
                  {contactSent && <p className="local-form-status" role="status">{pageCopy.contact.sent}</p>}
                </form>
              </section>
            </>}

            {storePage === "policies" && <>
              {renderBreadcrumb(pageCopy.policies.title)}
              <section className="local-store-page-heading"><span className="local-store-kicker">{pageCopy.policies.eyebrow}</span><h1>{pageCopy.policies.title}</h1><p>{pageCopy.policies.description}</p></section>
              <section className="local-policy-grid">
                {pageCopy.policies.items.map((item, index) => <article key={item.title}><span>{index === 0 ? <Truck size={17} /> : index === 2 ? <Heart size={17} /> : <FileText size={17} />}</span><h2>{item.title}</h2><p>{item.body}</p></article>)}
              </section>
            </>}

            {storePage === "cart" && <>
              {renderBreadcrumb(pageCopy.cart.title)}
              <section className="local-store-page-heading"><span className="local-store-kicker">{pageCopy.cart.eyebrow}</span><h1>{pageCopy.cart.title}</h1><p>{pageCopy.cart.description}</p></section>
              {cartProducts.length ? <section className="local-cart-layout">
                <div className="local-cart-items">
                  {cartProducts.map((product, index) => <article className="local-cart-item" key={`${product.id}-${index}`}>
                    <button type="button" className={`local-cart-thumbnail local-product-art local-product-art--${theme.categoryId.replace("cat-", "")}${getProductImage(product) ? " local-product-art--photo" : ""}`} onClick={() => openProduct(product)} aria-label={product.name[language]}>{getProductImage(product) ? <Image src={getProductImage(product) ?? heroImage} alt="" fill sizes="70px" /> : <span className="local-product-object local-product-object--1" aria-hidden="true" />}</button>
                    <div><span className="local-store-kicker">{product.group[language]}</span><button type="button" className="local-cart-item-name" onClick={() => openProduct(product)}>{product.name[language]}</button><small>{product.description[language]}</small></div>
                    <strong>{formatPreviewPrice(product.price)}</strong>
                    <button type="button" className="local-cart-remove" onClick={() => removeCartItem(index)} aria-label={`${pageCopy.cart.remove} ${product.name[language]}`}><X size={15} /></button>
                  </article>)}
                  <button type="button" className="local-product-back" onClick={() => navigateTo("collection")}><ArrowLeft size={14} /> {pageCopy.cart.continue}</button>
                </div>
                <aside className="local-cart-summary"><span className="local-store-kicker">{pageCopy.cart.summary}</span><h2>{cartProducts.length} {pageCopy.cart.count}</h2><div><span>{chrome.subtotal}</span><strong>{formatPreviewPrice(cartTotal)}</strong></div><p>{pageCopy.cart.note}</p><button type="button" className="local-store-cta" onClick={() => navigateTo("checkout")}>{chrome.checkout} <ArrowLeft size={15} /></button></aside>
              </section> : <section className="local-empty-page"><ShoppingBag size={24} /><h2>{pageCopy.cart.emptyTitle}</h2><p>{pageCopy.cart.emptyDescription}</p><button type="button" className="local-store-cta" onClick={() => navigateTo("collection")}>{pageCopy.cart.continue}</button></section>}
            </>}

            {storePage === "checkout" && <>
              {renderBreadcrumb(pageCopy.checkout.title, "cart")}
              <section className="local-store-page-heading"><span className="local-store-kicker">{pageCopy.checkout.eyebrow}</span><h1>{pageCopy.checkout.title}</h1><p>{pageCopy.checkout.description}</p></section>
              {cartProducts.length ? <section className="local-checkout-layout">
                <form className="local-checkout-form" onSubmit={submitDemoOrder}>
                  <label>{pageCopy.checkout.name}<input name="name" autoComplete="off" placeholder={pageCopy.checkout.name} required /></label>
                  <label>{pageCopy.checkout.email}<input name="email" type="email" autoComplete="off" placeholder={pageCopy.checkout.email} required /></label>
                  <label>{pageCopy.checkout.phone}<input name="phone" autoComplete="off" placeholder={pageCopy.checkout.phone} required /></label>
                  <label>{pageCopy.checkout.address}<textarea name="address" rows={3} placeholder={pageCopy.checkout.address} required /></label>
                  <p className="local-demo-notice">{pageCopy.checkout.notice} {pageCopy.checkout.payment}</p>
                  <button className="local-store-cta" type="submit">{pageCopy.checkout.submit}</button>
                </form>
                <aside className="local-cart-summary"><span className="local-store-kicker">{pageCopy.cart.summary}</span>{cartProducts.map((product, index) => <div className="local-checkout-item" key={`${product.id}-${index}`}><span>{product.name[language]}</span><strong>{formatPreviewPrice(product.price)}</strong></div>)}<div><span>{chrome.subtotal}</span><strong>{formatPreviewPrice(cartTotal)}</strong></div></aside>
              </section> : <section className="local-empty-page"><p>{pageCopy.cart.emptyDescription}</p><button type="button" className="local-store-cta" onClick={() => navigateTo("collection")}>{pageCopy.cart.continue}</button></section>}
            </>}

            {storePage === "order" && <section className="local-order-success">
              <span className="local-order-check"><Check size={28} /></span>
              <span className="local-store-kicker">{pageCopy.order.eyebrow}</span>
              <h1>{pageCopy.order.title}</h1>
              <p>{pageCopy.order.description}</p>
              <div><span>{pageCopy.order.reference}</span><strong>DEMO-0001</strong></div>
              <button type="button" className="local-store-cta" onClick={() => navigateTo("home")}>{pageCopy.order.continue} <ArrowLeft size={15} /></button>
            </section>}
          </main>

          <footer className="local-store-footer local-store-footer--pages">
            <button type="button" className="local-store-logo" onClick={() => navigateTo("home")}>{storeName}<span>.</span></button>
            <p>{chrome.footer}</p>
            <div className="local-store-footer-links">
              <button type="button" onClick={() => navigateTo("about")}>{pageCopy.nav.about}</button>
              <button type="button" onClick={() => navigateTo("faq")}>{pageCopy.nav.faq}</button>
              <button type="button" onClick={() => navigateTo("contact")}>{pageCopy.nav.contact}</button>
              <button type="button" onClick={() => navigateTo("policies")}>{pageCopy.nav.policies}</button>
            </div>
          </footer>
        </div>
      </div>
      <p className="local-preview-footnote" lang={language}>{chrome.footnote}</p>

      {openPanel === "favorites" && <div className="store-preview-backdrop store-preview-backdrop--panel" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpenPanel(null); }}>
        <section className="store-preview-panel" role="dialog" aria-modal="true" aria-label={chrome.favorites} lang={language} dir={language === "en" ? "ltr" : "rtl"}>
          <header><div><span className="local-store-kicker">{storeName}</span><h2>{chrome.favorites}</h2></div><button type="button" className="icon-button" aria-label={chrome.close} onClick={() => setOpenPanel(null)}><X size={18} /></button></header>
          {favoriteProducts.length ? <div className="store-preview-panel-items">{favoriteProducts.map((product) => <article key={product.id}><div><button type="button" className="local-favorite-item-name" onClick={() => { setOpenPanel(null); openProduct(product); }}>{product.name[language]}</button><small>{product.group[language]}</small></div><b>{formatPreviewPrice(product.price)}</b><button type="button" aria-label={language === "en" ? `Remove ${product.name[language]} from favorites` : `إزالة ${product.name[language]} من المفضلة`} onClick={() => toggleFavorite(product.id)}><Heart size={14} fill="currentColor" /></button></article>)}</div> : <p className="store-preview-panel-empty">{chrome.emptyFavorites}</p>}
          <button type="button" className="local-product-back" onClick={() => { setOpenPanel(null); navigateTo("collection"); }}>{pageCopy.nav.collection} <ArrowLeft size={14} /></button>
        </section>
      </div>}
    </div>
  );
}
