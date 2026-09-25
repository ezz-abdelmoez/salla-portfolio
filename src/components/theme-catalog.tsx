"use client";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { ArrowDownUp, ChevronLeft, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import type { ThemeFilter, ThemePriceType, ThemeSort } from "@/lib/api/contracts/theme";
import { useCategories } from "@/lib/api/modules/categories/hooks";
import { useThemes } from "@/lib/api/modules/themes/hooks";
import { ThemeGrid } from "./theme-grid";
import { DemoNotice, EmptyState, LoadingState, QueryError, SectionHeading } from "./shared";

const sortLabels: Record<ThemeSort, string> = {
  featured: "الأكثر تميزًا",
  newest: "الأحدث",
  "price-asc": "السعر: الأقل أولًا",
  "price-desc": "السعر: الأعلى أولًا",
  rating: "التقييم الأعلى",
};

export function ThemeCatalog({ initialCategory = "", heading = "كل الثيمات", eyebrow = "دليل نَسَق", description = "اختار التصميم اللي يناسب نشاطك، وعاين تفاصيله قبل ما تضيفه لقائمتك." }: { initialCategory?: string; heading?: string; eyebrow?: string; description?: string }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [category, setCategory] = useState(initialCategory);
  const [priceType, setPriceType] = useState<ThemePriceType | "">("");
  const [sort, setSort] = useState<ThemeSort>("featured");
  const [priceRange, setPriceRange] = useState("");
  const [page, setPage] = useState(1);
  const categories = useCategories();

  const range = useMemo(() => {
    if (priceRange === "under-250") return { minPrice: undefined, maxPrice: 249 };
    if (priceRange === "250-320") return { minPrice: 250, maxPrice: 320 };
    if (priceRange === "over-320") return { minPrice: 321, maxPrice: undefined };
    return { minPrice: undefined, maxPrice: undefined };
  }, [priceRange]);

  const filter: ThemeFilter = { search: debouncedSearch || undefined, category: category || undefined, priceType: priceType || undefined, sort, page, pageSize: 9, ...range };
  const result = useThemes(filter);
  const activeFilters = Number(Boolean(category)) + Number(Boolean(priceType)) + Number(Boolean(priceRange));

  function resetFilters() {
    setSearch(""); setCategory(""); setPriceType(""); setPriceRange(""); setSort("featured"); setPage(1);
  }

  return (
    <div className="catalog-page page-shell">
      <div className="catalog-heading"><SectionHeading eyebrow={eyebrow} title={heading} description={description} /><span className="catalog-stamp"><SlidersHorizontal size={17} />اختيار على ذوقك</span></div>
      <div className="catalog-toolbar">
        <label className="catalog-search"><Search size={19} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="ابحث باسم الثيم أو المجال..." aria-label="ابحث في الثيمات" /><kbd>⌘ K</kbd>{search && <button type="button" onClick={() => setSearch("")} aria-label="مسح البحث"><X size={15} /></button>}</label>
        <div className="catalog-controls">
          <label className="select-wrap"><Filter size={16} /><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} aria-label="تصفية حسب التصنيف"><option value="">كل التصنيفات</option>{categories.data?.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
          <label className="select-wrap"><select value={priceType} onChange={(event) => { setPriceType(event.target.value as ThemePriceType | ""); setPage(1); }} aria-label="تصفية حسب السعر"><option value="">كل الأسعار</option><option value="paid">مدفوع</option><option value="free">مجاني</option></select></label>
          <label className="select-wrap"><select value={priceRange} onChange={(event) => { setPriceRange(event.target.value); setPage(1); }} aria-label="نطاق السعر"><option value="">أي سعر</option><option value="under-250">أقل من ٢٥٠ ر.س</option><option value="250-320">٢٥٠–٣٢٠ ر.س</option><option value="over-320">أكثر من ٣٢٠ ر.س</option></select></label>
          <label className="select-wrap select-wrap--sort"><ArrowDownUp size={15} /><select value={sort} onChange={(event) => { setSort(event.target.value as ThemeSort); setPage(1); }} aria-label="ترتيب الثيمات">{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
      </div>
      <div className="catalog-results-row">
        <p>{result.data ? <><strong>{result.data.meta.total}</strong> ثيم للمعاينة</> : "نستكشف لك الخيارات..."}{debouncedSearch && <span className="query-term">نتائج «{debouncedSearch}»</span>}</p>
        {(activeFilters > 0 || search) && <button className="clear-filters" onClick={resetFilters}>مسح الفلاتر <X size={14} /></button>}
      </div>
      <div className="catalog-chips" aria-label="تصفية سريعة">
        <button className={!category ? "is-selected" : ""} onClick={() => { setCategory(""); setPage(1); }}>الكل</button>
        {categories.data?.map((item) => <button key={item.id} className={category === item.slug ? "is-selected" : ""} onClick={() => { setCategory(category === item.slug ? "" : item.slug); setPage(1); }}>{item.name}</button>)}
      </div>
      {result.isLoading && !result.data ? <div className="catalog-loading"><LoadingState label="نجهز لك الثيمات..." /><div className="skeleton-grid">{[1,2,3].map((key) => <div className="skeleton-card" key={key} />)}</div></div> : result.isError ? <QueryError onRetry={() => result.refetch()} /> : result.data?.items.length ? <ThemeGrid themes={result.data.items} /> : <EmptyState title="ما لقينا ثيمات تطابق بحثك" description="جرّب كلمة ثانية أو امسح الفلاتر عشان تشوف كل الخيارات." action="امسح الفلاتر" href="/themes" />}
      {result.data && result.data.meta.totalPages > 1 && (
        <nav className="pagination" aria-label="صفحات الثيمات">
          <button disabled={page <= 1} onClick={() => { setPage((current) => current - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}><ChevronLeft size={16} /> السابق</button>
          <span>صفحة <strong>{result.data.meta.page}</strong> من {result.data.meta.totalPages}</span>
          <button disabled={page >= result.data.meta.totalPages} onClick={() => { setPage((current) => current + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>التالي <ChevronLeft size={16} className="rotate-180" /></button>
        </nav>
      )}
      <DemoNotice>بيانات الثيمات والأسعار والتقييمات هنا تجريبية، ولا يوجد شراء أو تفعيل فعلي.</DemoNotice>
    </div>
  );
}
