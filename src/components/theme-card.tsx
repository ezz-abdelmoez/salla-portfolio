"use client";
import Link from "next/link";
import { Heart, Plus, Star, Check } from "lucide-react";
import { toast } from "sonner";
import type { ThemeSummaryDto } from "@/lib/api/contracts/theme";
import { formatPrice } from "@/lib/utils";
import { useAddToCart, useCart, useFavorites, useToggleFavorite } from "@/lib/store-state/hooks";
import { ThemePreview } from "./theme-preview";

export function ThemeCard({ theme, index = 0 }: { theme: ThemeSummaryDto; index?: number }) {
  const cart = useCart();
  const favorites = useFavorites();
  const addToCart = useAddToCart();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = favorites.data?.includes(theme.id) ?? false;
  const inCart = cart.data?.items.some((item) => item.themeId === theme.id) ?? false;

  async function handleAdd() {
    if (inCart) {
      toast.info("هذا الثيم موجود في سلتك", { description: "تقدر تراجع اختياراتك من صفحة السلة." });
      return;
    }
    await addToCart.mutateAsync(theme);
    toast.success("انضاف للسلة", { description: "إضافة تجريبية — لا يوجد شراء أو تفعيل حقيقي." });
  }

  async function handleFavorite() {
    await toggleFavorite.mutateAsync(theme.id);
    toast.success(isFavorite ? "انشال من المفضلة" : "انضاف للمفضلة");
  }

  return (
    <article className="theme-card" style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}>
      <div className="theme-card-visual">
        <Link href={`/themes/${theme.slug}`} className="theme-card-preview-link" aria-label={`تفاصيل ثيم ${theme.name}`}>
          <ThemePreview theme={theme} size="card" />
        </Link>
        <div className="theme-card-badges">
          {theme.badges.slice(0, 1).map((badge) => <span key={badge} className={`theme-badge ${badge === "مميز" ? "theme-badge--featured" : ""}`}>{badge}</span>)}
          <span className="demo-pill">عرض تجريبي</span>
        </div>
        <button className={`favorite-button ${isFavorite ? "is-active" : ""}`} type="button" onClick={handleFavorite} aria-label={isFavorite ? `إزالة ${theme.name} من المفضلة` : `إضافة ${theme.name} للمفضلة`} aria-pressed={isFavorite}>
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="theme-card-content">
        <div className="theme-card-meta"><span>{theme.categoryName}</span><span className="rating-chip"><Star size={13} fill="currentColor" /> {theme.rating.toFixed(1)} <small>تجريبي</small></span></div>
        <Link href={`/themes/${theme.slug}`} className="theme-card-title"><h3>{theme.name}</h3><span className="theme-card-arrow">↖</span></Link>
        <p className="theme-card-tagline">{theme.tagline}</p>
        <div className="theme-card-bottom">
          <div className="theme-price">
            <strong>{theme.price === 0 ? "مجاني" : formatPrice(theme.price)}</strong>
            {theme.compareAtPrice && <del>{formatPrice(theme.compareAtPrice)}</del>}
          </div>
          <button className={`add-cart-button ${inCart ? "is-added" : ""}`} type="button" onClick={handleAdd} disabled={addToCart.isPending} aria-label={inCart ? `الثيم ${theme.name} موجود في السلة` : `إضافة ${theme.name} للسلة`}>
            {inCart ? <Check size={16} /> : <Plus size={16} />}
            <span>{inCart ? "في السلة" : "أضف للسلة"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
