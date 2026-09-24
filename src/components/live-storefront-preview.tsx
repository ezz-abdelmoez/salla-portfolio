"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowUpLeft, Check, Heart, Menu, Monitor, Search, ShoppingBag, Smartphone, Sparkles, Tablet, X } from "lucide-react";
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

type PreviewViewport = "desktop" | "tablet" | "mobile";
type PreviewPanel = "cart" | "favorites" | null;

const editorialSlugs = new Set(["leen", "mada", "wameed", "ward", "qahwa"]);

export function LiveStorefrontPreview({ theme }: { theme: ThemeDetailDto }) {
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [language, setLanguage] = useState<PreviewLanguage>("ar");
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [addedProductId, setAddedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<DemoPreviewProduct | null>(null);
  const [openPanel, setOpenPanel] = useState<PreviewPanel>(null);
  const [panelMessage, setPanelMessage] = useState("");

  const products = previewProductsBySlug[theme.slug] ?? fallbackProductsByCategory[theme.categoryId] ?? fallbackProductsByCategory["cat-fashion"];
  const englishCopy = englishStorefrontCopy[theme.slug];
  const copy = language === "en" ? englishCopy : undefined;
  const chrome = previewChrome[language];
  const storeName = copy?.storeName ?? theme.previewStoreName;
  const categoryName = copy?.category ?? theme.categoryName;
  const headline = copy?.headline ?? theme.previewHeadline;
  const tagline = copy?.tagline ?? theme.tagline;
  const productsTitle = copy?.productTitle ?? chrome.collection;
  const productsDescription = copy?.productDescription ?? chrome.collectionDescription;
  const storyTitle = copy?.storyTitle ?? chrome.storyTitle;
  const storyDescription = copy?.storyDescription ?? chrome.storyDescription;
  const moduleContent = copy?.module ?? arabicStorefrontModules[theme.slug] ?? {
    eyebrow: theme.featureGroups[0]?.title ?? chrome.featureTitle,
    title: theme.featureGroups[0]?.items[0] ?? headline,
    description: theme.description,
    facts: [0, 1, 2].map((index) => ({ label: `0${index + 1}`, value: theme.featureGroups.flatMap((group) => group.items)[index] ?? chrome.featureDescription })) as [{ label: string; value: string }, { label: string; value: string }, { label: string; value: string }],
  };
  const features = copy?.features ?? [
    theme.featureGroups[0]?.items[0] ?? "مساحات قابلة للتخصيص",
    theme.featureGroups[0]?.items[1] ?? "محتوى يحرره التاجر",
    theme.featureGroups[1]?.items[0] ?? "تخطيط متجاوب",
  ];
  const groups = ["all", ...new Set(products.map((product) => product.group[language]))];
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesGroup = activeGroup === "all" || product.group[language] === activeGroup;
    const matchesSearch = !search || `${product.name[language]} ${product.description[language]} ${product.group[language]}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
    return matchesGroup && matchesSearch;
  }), [activeGroup, language, products, search]);
  const heroImage = editorialSlugs.has(theme.slug) ? `/themes/previews/${theme.slug}-editorial.jpg` : theme.coverImage;
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

  useEffect(() => {
    if (!selectedProduct && !openPanel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
        setOpenPanel(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPanel, selectedProduct]);

  function toggleFavorite(productId: string) {
    setFavoriteIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }

  function addToDemoCart(product: DemoPreviewProduct) {
    setCartIds((current) => [...current, product.id]);
    setAddedProductId(product.id);
    setPanelMessage("");
  }

  function removeCartItem(indexToRemove: number) {
    setCartIds((current) => current.filter((_, index) => index !== indexToRemove));
  }

  function showPanel(panel: Exclude<PreviewPanel, null>) {
    setPanelMessage("");
    setOpenPanel(panel);
  }

  return (
    <div className="local-store-preview page-shell" style={stageStyle}>
      <div className="local-preview-heading">
        <div>
          <Link href={`/themes/${theme.slug}`} className="back-link"><ArrowLeft size={15} /> {language === "en" ? "Back to theme details" : "العودة لتفاصيل الثيم"}</Link>
          <p className="eyebrow"><Sparkles size={14} /> {chrome.preview}</p>
          <h1>{language === "en" ? `Preview ${copy?.themeName ?? theme.name}` : `معاينة ${theme.name}`}</h1>
          <p className="local-preview-description">{language === "en" ? `Explore a responsive local storefront concept for ${copy?.storeName ?? theme.previewStoreName}, with sample content and interactions.` : `تصفّح نموذجًا بصريًا متجاوبًا باسم «${theme.previewStoreName}»، مع محتوى وعناصر تفاعلية تجريبية.`}</p>
        </div>
        <div className="local-preview-toolbar">
          {englishCopy && <div className="local-preview-controls local-preview-language" role="group" aria-label={language === "en" ? "Preview language" : "لغة المعاينة"}>
            <button type="button" className={language === "ar" ? "is-active" : ""} aria-pressed={language === "ar"} onClick={() => { setLanguage("ar"); setActiveGroup("all"); }}>عربي</button>
            <button type="button" className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => { setLanguage("en"); setActiveGroup("all"); }}>EN</button>
          </div>}
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

      <div className={`local-store-stage local-store-stage--${viewport}`} style={stageStyle} dir={language === "en" ? "ltr" : "rtl"} lang={language}>
        <div className="local-store-shell">
          <div className="local-store-announcement">{copy?.announcement ?? chrome.announcement}</div>
          <header className="local-store-header">
            <a href="#store-home" className="local-store-logo">{storeName}<span>.</span></a>
            <nav className="local-store-nav" aria-label={language === "en" ? "Store navigation" : "قائمة المتجر"}>
              <a href="#store-home">{copy?.navHome ?? chrome.home}</a><a href="#store-products">{copy?.navShop ?? chrome.shop}</a><a href="#store-story">{copy?.navStory ?? chrome.story}</a>
            </nav>
            <label className="local-store-search"><Search size={16} /><input aria-label={copy?.searchPlaceholder ?? chrome.search} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy?.searchPlaceholder ?? chrome.search} /></label>
            <div className="local-store-actions">
              <button type="button" className="local-store-icon" aria-label={`${chrome.favorites}: ${favoriteIds.length}`} onClick={() => showPanel("favorites")}><Heart size={18} /><span>{favoriteIds.length}</span></button>
              <button type="button" className="local-store-icon" aria-label={`${chrome.cart}: ${cartIds.length}`} onClick={() => showPanel("cart")}><ShoppingBag size={18} /><span>{cartIds.length}</span></button>
              <button type="button" className="local-store-menu" aria-label={language === "en" ? "Menu" : "القائمة"} onClick={() => document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth" })}><Menu size={19} /></button>
            </div>
          </header>

          <main id="store-home">
            <section className="local-store-hero">
              <div className="local-store-hero-copy">
                <span className="local-store-kicker">{language === "en" ? `Curated ${categoryName}` : `مختارات ${categoryName}`}</span>
                <h2>{headline}</h2>
                <p>{tagline} {copy?.heroDescription ?? (theme.slug === "qahwa" ? "تفاصيل المنشأ والتحميص يضيفها التاجر من مصادر موثوقة." : "تصفّح المجموعة واكتشف تفاصيلها.")}</p>
                <a className="local-store-cta" href="#store-products">{copy?.cta ?? chrome.cta} <ArrowUpLeft size={16} /></a>
                <span className="local-store-note">{language === "en" ? "Responsive concept · Sample content" : "تصميم عربي · محتوى تجريبي"}</span>
              </div>
              <div className="local-store-hero-image">
                <Image src={heroImage} alt={language === "en" ? `Editorial image for ${copy?.themeName ?? theme.name}` : `صورة تحريرية لمعاينة ${theme.name}`} fill priority sizes={viewport === "mobile" ? "92vw" : viewport === "tablet" ? "80vw" : "(max-width: 900px) 92vw, 50vw"} />
                <span>{storeName} / 01</span>
              </div>
            </section>

            <section className="local-store-benefits" aria-label={chrome.featureTitle}>
              {features.map((feature, index) => <div key={feature}><span>0{index + 1}</span><p><strong>{feature}</strong><small>{copy ? ["Explore the edit", "Merchant-editable details", "A responsive storefront"][index] : "تفاصيل قابلة للتخصيص"}</small></p></div>)}
            </section>

            <section className="local-store-signature" aria-labelledby="local-store-signature-title">
              <div className="local-store-signature-intro"><span className="local-store-kicker">{moduleContent.eyebrow}</span><h2 id="local-store-signature-title">{moduleContent.title}</h2><p>{moduleContent.description}</p></div>
              <div className="local-store-signature-grid">
                {moduleContent.facts.map((fact, index) => <article key={fact.label}><span>0{index + 1}</span><small>{fact.label}</small><strong>{fact.value}</strong></article>)}
              </div>
            </section>

            <section className="local-store-products" id="store-products">
              <div className="local-store-section-heading">
                <div><span className="local-store-kicker">{copy?.storeName ?? "من المتجر"}</span><h2>{productsTitle}</h2><p>{productsDescription}</p></div>
                <Link href={`/themes/${theme.slug}`} className="local-store-more">{language === "en" ? "About this theme" : "عن الثيم"} <ArrowLeft size={14} /></Link>
              </div>
              <div className="local-store-filter-row">
                <div className="local-store-filters" role="group" aria-label={language === "en" ? "Filter sample products" : "تصفية المنتجات التجريبية"}>
                  <button type="button" className={activeGroup === "all" ? "is-active" : ""} aria-pressed={activeGroup === "all"} onClick={() => setActiveGroup("all")}>{language === "en" ? "All" : "الكل"}</button>
                  {groups.filter((group) => group !== "all").map((group) => <button type="button" key={group} className={activeGroup === group ? "is-active" : ""} aria-pressed={activeGroup === group} onClick={() => setActiveGroup(group)}>{group}</button>)}
                </div>
                <span>{visibleProducts.length} {chrome.products}</span>
              </div>
              {visibleProducts.length ? <div className="local-store-product-grid">
                {visibleProducts.map((product, index) => {
                  const isFavorite = favoriteIds.includes(product.id);
                  return <article className="local-store-product" key={product.id}>
                    <div className={`local-product-art local-product-art--${theme.categoryId.replace("cat-", "")}`}>
                      <span className={`local-product-object local-product-object--${index + 1}`} aria-hidden="true" />
                      <span className="local-product-label">{product.group[language]}</span>
                      <button type="button" className={`local-product-favorite ${isFavorite ? "is-active" : ""}`} aria-label={isFavorite ? `${language === "en" ? "Remove" : "إزالة"} ${product.name[language]}` : `${language === "en" ? "Save" : "إضافة"} ${product.name[language]}`} aria-pressed={isFavorite} onClick={() => toggleFavorite(product.id)}><Heart size={16} fill={isFavorite ? "currentColor" : "none"} /></button>
                    </div>
                    <div className="local-product-copy"><button type="button" className="local-product-name" onClick={() => setSelectedProduct(product)}><h3>{product.name[language]}</h3><p>{product.description[language]}</p></button><strong>{formatPreviewPrice(product.price)}</strong></div>
                    <div className="local-product-actions"><button type="button" className="local-product-details" onClick={() => setSelectedProduct(product)}>{chrome.details}</button><button type="button" className="local-product-add" onClick={() => addToDemoCart(product)}>{addedProductId === product.id ? <><Check size={15} /> {chrome.added}</> : <><ShoppingBag size={15} /> {chrome.add}</>}</button></div>
                  </article>;
                })}
              </div> : <p className="local-store-empty">{chrome.noResults}</p>}
            </section>

            <section className="local-store-story" id="store-story">
              <div className="local-store-story-mark">{copy?.themeName.slice(0, 1) ?? theme.name.slice(0, 1)}</div>
              <div><span className="local-store-kicker">{copy?.storeName ?? theme.previewStoreName}</span><h2>{storyTitle}</h2><p>{storyDescription}{language === "ar" ? ` ${theme.description}` : ""}</p></div>
              <Link href={`/themes/${theme.slug}`} className="local-store-cta local-store-cta--outline">{language === "en" ? "Theme details" : "تفاصيل الثيم"} <ArrowLeft size={15} /></Link>
            </section>
          </main>

          <footer className="local-store-footer"><a href="#store-home" className="local-store-logo">{storeName}<span>.</span></a><p>{chrome.footer}</p><a href="#store-home">{language === "en" ? "Back to top ↑" : "العودة للأعلى ↑"}</a></footer>
        </div>
      </div>
      <p className="local-preview-footnote" lang={language}>{chrome.footnote}</p>

      {selectedProduct && <div className="store-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}><section className="store-preview-dialog" role="dialog" aria-modal="true" aria-label={selectedProduct.name[language]} lang={language} dir={language === "en" ? "ltr" : "rtl"}><div className="store-preview-dialog-heading"><span className="local-store-kicker">{selectedProduct.group[language]}</span><button type="button" className="icon-button" onClick={() => setSelectedProduct(null)} aria-label={chrome.close}><X size={18} /></button></div><div className={`local-product-art local-product-art--large local-product-art--${theme.categoryId.replace("cat-", "")}`}><span className="local-product-object local-product-object--1" aria-hidden="true" /></div><div className="store-preview-dialog-copy"><h2>{selectedProduct.name[language]}</h2><p>{selectedProduct.description[language]}</p><strong>{formatPreviewPrice(selectedProduct.price)}</strong><span>{language === "en" ? "Sample product information — replace with verified store content." : "بيانات منتج تجريبية — استبدلها بمعلومات متجرك الموثقة."}</span><button type="button" className="local-product-add" onClick={() => addToDemoCart(selectedProduct)}>{addedProductId === selectedProduct.id ? <Check size={15} /> : <ShoppingBag size={15} />} {addedProductId === selectedProduct.id ? chrome.added : chrome.add}</button></div></section></div>}

      {openPanel && <div className="store-preview-backdrop store-preview-backdrop--panel" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpenPanel(null); }}><section className="store-preview-panel" role="dialog" aria-modal="true" aria-label={openPanel === "cart" ? chrome.cart : chrome.favorites} lang={language} dir={language === "en" ? "ltr" : "rtl"}><header><div><span className="local-store-kicker">{storeName}</span><h2>{openPanel === "cart" ? chrome.cart : chrome.favorites}</h2></div><button type="button" className="icon-button" aria-label={chrome.close} onClick={() => setOpenPanel(null)}><X size={18} /></button></header>
        {openPanel === "cart" ? <>
          {cartProducts.length ? <div className="store-preview-panel-items">{cartProducts.map((product, index) => <article key={`${product.id}-${index}`}><div><strong>{product.name[language]}</strong><small>{product.group[language]}</small></div><b>{formatPreviewPrice(product.price)}</b><button type="button" aria-label={language === "en" ? `Remove ${product.name[language]}` : `إزالة ${product.name[language]}`} onClick={() => removeCartItem(index)}><X size={14} /></button></article>)}</div> : <p className="store-preview-panel-empty">{chrome.emptyCart}</p>}
          <div className="store-preview-panel-total"><span>{chrome.subtotal}</span><strong>{formatPreviewPrice(cartTotal)}</strong></div>
          {cartProducts.length > 0 && <button type="button" className="local-product-add" onClick={() => setPanelMessage(chrome.disclaimer)}>{chrome.checkout}</button>}
          {panelMessage && <p className="store-preview-panel-note" role="status">{panelMessage}</p>}
          {cartProducts.length > 0 && <button type="button" className="store-preview-clear" onClick={() => { setCartIds([]); setPanelMessage(""); }}>{chrome.clear}</button>}
        </> : favoriteProducts.length ? <div className="store-preview-panel-items">{favoriteProducts.map((product) => <article key={product.id}><div><strong>{product.name[language]}</strong><small>{product.group[language]}</small></div><b>{formatPreviewPrice(product.price)}</b><button type="button" aria-label={language === "en" ? `Remove ${product.name[language]} from favorites` : `إزالة ${product.name[language]} من المفضلة`} onClick={() => toggleFavorite(product.id)}><Heart size={14} fill="currentColor" /></button></article>)}</div> : <p className="store-preview-panel-empty">{chrome.emptyFavorites}</p>}
      </section></div>}
    </div>
  );
}
