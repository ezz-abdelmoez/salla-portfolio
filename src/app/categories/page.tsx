import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Palette, Sparkles } from "lucide-react";
import { CategoryGrid } from "@/components/category-grid";
import { getHomeContentForServer } from "@/lib/api/modules/home/server";
import { listCategoriesForServer } from "@/lib/api/modules/categories/server";
import { DemoNotice } from "@/components/shared";
export const metadata = { title: "التصنيفات", description: "استكشف مجالات الثيمات العربية في نَسَق." };

export default async function CategoriesPage() {
  const [categories, home] = await Promise.all([listCategoriesForServer(), getHomeContentForServer()]);
  return (
    <div className="page-shell categories-page">
      <div className="page-heading-row"><div><p className="eyebrow">دليل المجالات</p><h1>اختار مجال متجرك</h1><p>تصفّح التصنيفات واكتشف أساليب تصميم مناسبة لنشاطك.</p></div><Link href="/themes" className="text-link">كل الثيمات <ArrowUpLeft size={15} /></Link></div>
      <CategoryGrid categories={categories} />
      <section className="category-editorial"><span className="eyebrow">من كل مجال</span><h2>ابدأ من الفكرة،<br /><em>وبعدين اختار الواجهة.</em></h2><p>{home.subtitle}</p></section>
      <section className="category-custom-cta">
        <div><p className="eyebrow"><Sparkles size={14} /> عندك تصور مختلف؟</p><h2>نصمّم لك ثيمًا<br /><em>يشبه متجرك.</em></h2><p>شاركنا فكرتك، صورك المرجعية، والخيارات التي تحتاجها — ونبدأ من ذوقك.</p></div>
        <Link href="/contact#custom-theme-request" className="button button--primary button--large"><Palette size={17} /> اطلب ثيمًا مخصصًا <ArrowLeft size={16} /></Link>
      </section>
      <DemoNotice>أعداد الثيمات ومعايناتها بيانات محلية تجريبية.</DemoNotice>
    </div>
  );
}
