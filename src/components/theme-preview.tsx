import type { CSSProperties } from "react";
import type { ThemeSummaryDto } from "@/lib/api/contracts/theme";

type ThemePreviewProps = {
  theme: ThemeSummaryDto;
  size?: "card" | "hero" | "detail" | "mobile";
  showToolbar?: boolean;
};

export function ThemePreview({ theme, size = "card", showToolbar = true }: ThemePreviewProps) {
  const palette = theme.previewPalette;
  const style = {
    "--preview-bg": palette.background,
    "--preview-surface": palette.surface,
    "--preview-primary": palette.primary,
    "--preview-accent": palette.accent,
    "--preview-text": palette.text,
  } as CSSProperties;
  const artKind = theme.categoryId.replace("cat-", "");

  return (
    <div className={`theme-preview theme-preview--${size}`} style={style} role="img" aria-label={`معاينة تصميمية لثيم ${theme.name}، ${theme.categoryName}`}>
      {showToolbar && (
        <div className="preview-browser-bar" aria-hidden="true">
          <span className="browser-dots"><i /><i /><i /></span>
          <span className="browser-address"><span /> {theme.slug}.store-demo</span>
          <span className="browser-expand">↗</span>
        </div>
      )}
      <div className="preview-canvas">
        <div className="preview-site-nav">
          <div className="preview-brand">{theme.previewStoreName}</div>
          <div className="preview-links"><span>الرئيسية</span><span>المتجر</span><span>من نحن</span></div>
          <div className="preview-tools"><i /><i /></div>
        </div>
        <div className="preview-hero-content">
          <div className="preview-copy">
            <span className="preview-kicker">مجموعة مختارة بعناية</span>
            <strong>{theme.previewHeadline}</strong>
            <span className="preview-subcopy">تفاصيل بسيطة، تجربة أقرب لك.</span>
            <span className="preview-shop-cta">اكتشفي المجموعة <b>←</b></span>
          </div>
          <div className={`preview-art preview-art--${artKind}`} aria-hidden="true">
            <span className="art-sun" />
            <span className="art-shadow" />
            <span className="art-object"><i /><b /></span>
            <span className="art-orbit" />
            <span className="art-sticker">NEW<br />DROP</span>
          </div>
        </div>
        <div className="preview-products" aria-hidden="true">
          <div><span className="product-swatch product-swatch--one" /><small>الاختيار الأول</small><b>١٨٩ ر.س</b></div>
          <div><span className="product-swatch product-swatch--two" /><small>تفاصيل يومية</small><b>٢٤٩ ر.س</b></div>
          <div><span className="product-swatch product-swatch--three" /><small>إصدار خاص</small><b>٣٢٠ ر.س</b></div>
        </div>
      </div>
      {size === "hero" && (
        <>
          <span className="preview-float preview-float--top">واجهة عربية <b>↗</b></span>
          <span className="preview-float preview-float--bottom"><i /> معاينة تصميمية</span>
        </>
      )}
    </div>
  );
}
