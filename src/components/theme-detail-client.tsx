"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpLeft, Check, ChevronDown, Heart, LoaderCircle, ShieldCheck, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import { toast } from "sonner";
import { useTheme, useThemeReviews, useRelatedThemes } from "@/lib/api/modules/themes/hooks";
import type { ThemeDetailDto } from "@/lib/api/contracts/theme";
import { useAddToCart, useCart, useFavorites, useToggleFavorite } from "@/lib/store-state/hooks";
import { formatPrice } from "@/lib/utils";
import { ThemePreview } from "./theme-preview";
import { ThemeGrid } from "./theme-grid";
import { DemoNotice, EmptyState, LoadingState, QueryError } from "./shared";

export function ThemeDetailClient({ slug, initialTheme }: { slug: string; initialTheme: ThemeDetailDto }) {
  const themeQuery = useTheme(slug, initialTheme);
  const cart = useCart();
  const favorites = useFavorites();
  const addToCart = useAddToCart();
  const toggleFavorite = useToggleFavorite();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const router = useRouter();
  const theme = themeQuery.data;
  const reviews = useThemeReviews(slug);
  const related = useRelatedThemes(slug);
  const isFavorite = theme ? (favorites.data?.includes(theme.id) ?? false) : false;
  const inCart = theme ? (cart.data?.items.some((item) => item.themeId === theme.id) ?? false) : false;

  useEffect(() => {
    if (!previewOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setPreviewOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewOpen]);

  if (themeQuery.isLoading && !theme) return <div className="page-shell detail-loading"><LoadingState label="نحمّل تفاصيل الثيم..." /><div className="skeleton-card skeleton-card--detail" /></div>;
  if (themeQuery.isError || !theme) return <div className="page-shell detail-loading"><QueryError message="ما لقينا هذا الثيم أو تعذر تحميل تفاصيله." onRetry={() => themeQuery.refetch()} /><EmptyState title="يمكن الرابط مو موجود" description="ارجع للكتالوج وشوف بقية المعاينات." /></div>;

  async function handleAdd() {
    if (!theme) return;
    if (inCart) {
      router.push("/cart");
      return;
    }
    await addToCart.mutateAsync(theme);
    toast.success("انضاف للسلة", { description: "إضافة تجريبية — لا يوجد شراء أو تفعيل حقيقي." });
  }

  async function handleFavorite() {
    if (!theme) return;
    await toggleFavorite.mutateAsync(theme.id);
    toast.success(isFavorite ? "انشال من المفضلة" : "انضاف للمفضلة");
  }

  return (
    <div className="detail-page page-shell">
      <nav className="breadcrumbs" aria-label="مسار التنقل"><Link href="/">الرئيسية</Link><span>/</span><Link href="/themes">الثيمات</Link><span>/</span><Link href={`/categories/${theme.categoryId.replace("cat-", "")}`}>{theme.categoryName}</Link><span>/</span><strong>{theme.name}</strong></nav>
      <div className="detail-topbar"><Link href="/themes" className="back-link"><ArrowLeft size={16} /> العودة للثيمات</Link><span className="demo-chip"><span /> معاينة تصميمية</span></div>
      <section className="product-hero">
        <div className="product-visual-column">
          <div className="product-preview-shell"><ThemePreview theme={theme} size="detail" /></div>
          <div className="preview-actions-row"><div className="preview-tabs" role="tablist" aria-label="اختيار شكل المعاينة"><button role="tab" aria-selected={view === "desktop"} className={view === "desktop" ? "is-active" : ""} onClick={() => setView("desktop")}>سطح المكتب</button><button role="tab" aria-selected={view === "mobile"} className={view === "mobile" ? "is-active" : ""} onClick={() => setView("mobile")}>الجوال</button></div><button className="text-button" onClick={() => setPreviewOpen(true)}>معاينة أكبر <ArrowUpLeft size={15} /></button></div>
          <div className={`secondary-preview secondary-preview--${view}`}><ThemePreview theme={theme} size={view === "mobile" ? "mobile" : "card"} showToolbar={false} /></div>
        </div>
        <div className="product-info-column">
          <div className="product-kicker"><span className="product-kicker-line" />{theme.categoryName}<span className="demo-pill">بيانات تجريبية</span></div>
          <h1>{theme.name}<span className="product-name-dot">.</span></h1>
          <p className="product-tagline">{theme.tagline}</p>
          <p className="product-description">{theme.longDescription}</p>
          <div className="product-rating"><span><Star size={15} fill="currentColor" /> {theme.rating.toFixed(1)}</span><span>{theme.reviewCount} تقييمات تجريبية</span><span className="rating-dot" /> <span>{theme.industries.slice(0, 2).join(" · ")}</span></div>
          <div className="product-price-row"><div><strong>{theme.price === 0 ? "مجاني" : formatPrice(theme.price)}</strong>{theme.compareAtPrice && <del>{formatPrice(theme.compareAtPrice)}</del>}</div><span>السعر للعرض فقط</span></div>
          <div className="product-action-stack">
            <button className="button button--primary button--full button--large" onClick={handleAdd} disabled={addToCart.isPending}>{addToCart.isPending ? <LoaderCircle size={17} className="spin" /> : inCart ? <Check size={17} /> : <ShoppingBag size={17} />}{inCart ? "موجود في السلة — راجعها" : "أضف للسلة التجريبية"}</button>
            <button className={`button button--outline button--full ${isFavorite ? "favorite-active-button" : ""}`} onClick={handleFavorite}><Heart size={16} fill={isFavorite ? "currentColor" : "none"} />{isFavorite ? "أُضيف للمفضلة" : "أضف للمفضلة"}</button>
          </div>
          <div className="product-mini-trust"><div><ShieldCheck size={16} /><span>تفاصيل ومتطلبات واضحة</span></div><div><Sparkles size={16} /><span>معاينة محلية غير تفاعلية</span></div></div>
          <DemoNotice>طلب تجريبي فقط. لا يتم تحصيل مبلغ أو تفعيل أو تنزيل أي ثيم.</DemoNotice>
        </div>
      </section>

      <section className="detail-lower-grid">
        <div className="detail-main-content">
          <section className="detail-section"><p className="eyebrow">عن التصميم</p><h2>واجهة لها شخصية</h2><p>{theme.description} صُممت هذه المعاينة لتوضيح اتجاه بصري محتمل، وليست متجرًا فعليًا أو لقطة لعميل.</p><div className="tag-list">{theme.styleTags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
          <section className="detail-section"><p className="eyebrow">المزايا</p><h2>تفاصيل تساعدك تختار</h2><div className="feature-group-grid">{theme.featureGroups.map((group) => <article className="feature-group" key={group.title}><h3>{group.title}</h3>{group.items.map((item) => <p key={item}><Check size={15} />{item}</p>)}</article>)}</div></section>
          <section className="detail-section"><p className="eyebrow">قبل الاستخدام</p><h2>ملاحظات مهمة</h2><div className="notice-panel"><strong>التوافق الفعلي يحتاج تحقق</strong><p>{theme.compatibilityNote}</p></div><ul className="requirements-list">{theme.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></section>
          <section className="detail-section"><p className="eyebrow">الترخيص</p><h2>{theme.license.title}</h2><p>{theme.license.summary}</p><ul className="requirements-list">{theme.license.terms.map((term) => <li key={term}>{term}</li>)}</ul></section>
          <section className="detail-section review-section"><div className="review-heading"><div><p className="eyebrow">آراء حول المعاينة</p><h2>تقييمات توضيحية</h2></div><span className="demo-pill">ليست تقييمات عملاء حقيقية</span></div>{reviews.isLoading ? <LoadingState label="نحمّل التقييمات..." /> : reviews.data?.items.length ? <div className="review-grid">{reviews.data.items.map((review) => <article className="review-card" key={review.id}><div className="review-stars" aria-label={`${review.rating} من 5 نجوم`}>{Array.from({ length: 5 }).map((_, index) => <Star size={13} key={index} fill={index < review.rating ? "currentColor" : "none"} />)}</div><h3>{review.title}</h3><p>{review.body}</p><span>{review.authorName} · تجربة عرض</span></article>)}</div> : <p className="muted-copy">لا توجد تقييمات للمعاينة.</p>}</section>
          <section className="detail-section faq-section"><p className="eyebrow">أسئلة عن الثيم</p><h2>قبل ما تقرر</h2>{theme.faq.map((item) => <details key={item.question}><summary>{item.question}<ChevronDown size={17} /></summary><p>{item.answer}</p></details>)}</section>
        </div>
        <aside className="detail-sidebar"><div className="sidebar-card"><span className="sidebar-card-index">N / 0{theme.slug.slice(0, 1).charCodeAt(0) % 9 + 1}</span><p>بيانات التصميم</p><dl><div><dt>التصنيف</dt><dd>{theme.categoryName}</dd></div><div><dt>المجالات</dt><dd>{theme.industries.join("، ")}</dd></div><div><dt>آخر تحديث للمعاينة</dt><dd>{new Date(theme.lastUpdated).toLocaleDateString("ar-SA", { year: "numeric", month: "long" })}</dd></div><div><dt>اتجاه الواجهة</dt><dd>{theme.supportsRTL ? "عربي RTL" : "غير محدد"}</dd></div><div><dt>متجاوب</dt><dd>{theme.responsive ? "نعم — كنموذج بصري" : "غير محدد"}</dd></div></dl><Link href="/faq" className="text-link">تفاصيل أكثر <ArrowUpLeft size={14} /></Link></div><div className="sidebar-note"><span>ملاحظة</span><p>نَسَق منصة عرض مستقلة. لا نضمن أو نمثل اعتمادًا من سلة.</p></div></aside>
      </section>

      {related.data?.length ? <section className="related-section"><div className="section-heading"><div><p className="eyebrow">قد يعجبك أيضًا</p><h2>من نفس المجال</h2></div><Link href={`/categories/${theme.categoryId.replace("cat-", "")}`} className="text-link">شوف المجال <ArrowUpLeft size={15} /></Link></div><ThemeGrid themes={related.data} /></section> : null}
      {previewOpen && <div className="preview-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOpen(false); }}><section className="preview-modal" role="dialog" aria-modal="true" aria-label={`معاينة ثيم ${theme.name}`}><div className="preview-modal-header"><div><span className="eyebrow">معاينة تصميمية</span><strong>{theme.name} — {theme.previewStoreName}</strong></div><button className="icon-button" onClick={() => setPreviewOpen(false)} aria-label="إغلاق المعاينة"><X size={19} /></button></div><ThemePreview theme={theme} size="detail" /><div className="preview-modal-footer"><span>هذه معاينة محلية وليست متجرًا فعليًا.</span><button className="text-button" onClick={() => setPreviewOpen(false)}>إغلاق <X size={14} /></button></div></section></div>}
    </div>
  );
}
