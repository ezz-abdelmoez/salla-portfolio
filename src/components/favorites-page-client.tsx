"use client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useThemes } from "@/lib/api/modules/themes/hooks";
import { useFavorites, useToggleFavorite } from "@/lib/store-state/hooks";
import { ThemeGrid } from "./theme-grid";
import { DemoNotice, EmptyState, LoadingState, QueryError } from "./shared";

export function FavoritesPageClient() {
  const favorites = useFavorites();
  const themes = useThemes({ pageSize: 48 });
  const toggleFavorite = useToggleFavorite();
  if ((favorites.isLoading && !favorites.data) || (themes.isLoading && !themes.data)) return <div className="page-shell favorites-page"><LoadingState label="نحمّل ثيماتك المحفوظة..." /></div>;
  if (themes.isError) return <div className="page-shell favorites-page"><QueryError onRetry={() => themes.refetch()} /></div>;
  const saved = themes.data?.items.filter((theme) => favorites.data?.includes(theme.id)) ?? [];

  return (
    <div className="page-shell favorites-page">
      <div className="page-heading-row"><div><p className="eyebrow">قائمة اختياراتك</p><h1>المفضلة <span className="subtle-number">({saved.length})</span></h1><p>الثيمات اللي حبيت تحتفظ فيها للمقارنة والرجوع لها.</p></div>{saved.length > 0 && <button className="clear-cart-button" onClick={async () => { for (const theme of saved) await toggleFavorite.mutateAsync(theme.id); toast.success("تم مسح المفضلة"); }}><Trash2 size={15} /> مسح الكل</button>}</div>
      {saved.length ? <ThemeGrid themes={saved} /> : <EmptyState title="ما أضفت ثيمات للمفضلة بعد" description="اضغط على القلب في أي بطاقة عشان تحفظ الثيم اللي يعجبك." href="/themes" action="استكشف الثيمات" />}
      <DemoNotice>المفضلة محفوظة على هذا الجهاز فقط، ضمن نموذج العرض التجريبي.</DemoNotice>
    </div>
  );
}
