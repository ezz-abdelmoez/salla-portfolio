"use client";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Check, ChevronLeft, Flower2, LayoutGrid, Search, Sparkles, WandSparkles } from "lucide-react";
import type { HomeContentDto } from "@/lib/api/contracts/home";
import type { CategoryDto } from "@/lib/api/contracts/category";
import type { PageResult } from "@/lib/api/contracts/common";
import type { ThemeSummaryDto } from "@/lib/api/contracts/theme";
import { useHomeContent } from "@/lib/api/modules/home/hooks";
import { useCategories } from "@/lib/api/modules/categories/hooks";
import { useThemes } from "@/lib/api/modules/themes/hooks";
import { ThemeGrid } from "./theme-grid";
import { ThemePreview } from "./theme-preview";
import { CategoryGrid } from "./category-grid";
import { DemoNotice, LoadingState, QueryError, SectionHeading } from "./shared";

export function HomePage({ initialHome, initialCategories, initialThemes }: { initialHome: HomeContentDto; initialCategories: CategoryDto[]; initialThemes: PageResult<ThemeSummaryDto> }) {
  const home = useHomeContent(initialHome);
  const categories = useCategories(initialCategories);
  const themes = useThemes({ sort: "featured", pageSize: 12 }, initialThemes);

  if (home.isLoading && !home.data) return <HomeSkeleton />;
  if (home.isError || !home.data) return <div className="page-shell"><QueryError onRetry={() => home.refetch()} /></div>;

  const content = home.data;
  const featured = themes.data?.items.filter((theme) => content.featuredThemeIds.includes(theme.id)).slice(0, 5) ?? [];
  const heroTheme = themes.data?.items.find((theme) => theme.slug === "leen") ?? themes.data?.items[0];
  const categoryItems = categories.data?.filter((item) => content.categoryIds.includes(item.id)) ?? [];
  const titleLines = content.title.split(". ");

  return (
    <div className="home-page">
      <section className="hero-section page-shell">
        <div className="hero-copy">
          <p className="hero-eyebrow"><span className="hero-eyebrow-mark"><Sparkles size={14} /></span>{content.eyebrow}</p>
          <h1>{titleLines[0]}<span className="hero-title-highlight">{titleLines.slice(1).join(". ")}</span></h1>
          <p className="hero-description">{content.subtitle}</p>
          <div className="hero-actions">
            <Link className="button button--primary button--large" href={content.primaryCta.href}>{content.primaryCta.label}<ArrowLeft size={17} /></Link>
            <Link className="button button--text button--large" href={content.secondaryCta.href}>{content.secondaryCta.label}<ArrowUpLeft size={16} /></Link>
          </div>
          <div className="hero-points">
            <span><Check size={14} /> معاينات تصميمية</span>
            <span><Check size={14} /> تفاصيل قبل الاختيار</span>
          </div>
          <span className="hero-index">01 <i /> 04</span>
        </div>
        <div className="hero-visual">
          {heroTheme ? <ThemePreview theme={heroTheme} size="hero" /> : <div className="hero-visual-skeleton" />}
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />
        </div>
        <div className="hero-vertical-label">DESIGNED FOR YOUR STORE</div>
      </section>

      <section className="hero-bottom page-shell" aria-label="مميزات نَسَق">
        <div className="hero-bottom-note"><span className="hero-note-icon"><WandSparkles size={17} /></span><p>اختيارات بصرية<br /><strong>تبدأ من ذوقك</strong></p></div>
        <div className="hero-bottom-divider" />
        <p className="hero-bottom-copy">كل ثيم له حكاية. تصفّحها، عاينها، وخذ وقتك في الاختيار.</p>
        <Link href="/themes" className="hero-bottom-link">شوف كل الثيمات <ArrowUpLeft size={15} /></Link>
      </section>

      <section className="category-section section-pad page-shell">
        <SectionHeading eyebrow="اختار مجالك" title="كل نشاط له ثيم يشبهه" description="ابدأ من المجال الأقرب لمتجرك، واكتشف أفكار تصميم تستاهل." action={<Link href="/categories" className="text-link">كل التصنيفات <ArrowUpLeft size={15} /></Link>} />
        {categories.isLoading ? <LoadingState label="نجهز لك التصنيفات..." /> : categoryItems.length ? <CategoryGrid categories={categoryItems} compact /> : <p className="muted-copy">التصنيفات غير متاحة حاليًا.</p>}
      </section>

      <section className="featured-section section-pad">
        <div className="page-shell">
          <SectionHeading eyebrow="مختارة لك" title="واجهات تلفت من أول نظرة" description="نماذج تصميمية توضّح أساليب مختلفة لمتاجر سلة." action={<Link href="/themes" className="button button--outline">اكتشف الكل <ArrowUpLeft size={16} /></Link>} />
          {themes.isLoading && !themes.data ? <LoadingState label="نحمّل الثيمات..." /> : themes.isError ? <QueryError onRetry={() => themes.refetch()} /> : featured.length ? <ThemeGrid themes={featured} /> : <p className="muted-copy">ما فيه ثيمات للعرض حاليًا.</p>}
          <div className="demo-inline-note"><span><span className="demo-note-dot" />كل المعاينات والأسعار والتقييمات هنا تجريبية</span><Link href="/about">عن النسخة التجريبية <ArrowUpLeft size={13} /></Link></div>
        </div>
      </section>

      <section className="manifesto-section page-shell">
        <div className="manifesto-mark"><LayoutGrid size={22} /></div>
        <div className="manifesto-copy"><p className="eyebrow">من البداية للنهاية</p><h2>متجرك يستحق<br /><em>واجهة تعبّر عنه.</em></h2><p>نَسَق مساحة مستقلة لاستكشاف أفكار ثيمات عربية. نعرض التصميم والتفاصيل بوضوح، بدون وعود مبالغ فيها أو خطوات غامضة.</p></div>
        <div className="manifesto-side"><div className="manifesto-line" /><p><span>نَسَق / ٢٠٢٦</span>نموذج واجهات وتجربة عرض</p><Link href="/about">اعرف حكاية نَسَق <ArrowUpLeft size={15} /></Link></div>
      </section>

      <section id="how-it-works" className="how-section section-pad">
        <div className="page-shell">
          <SectionHeading eyebrow="ببساطة" title="من الفكرة للواجهة" description="ثلاث خطوات تساعدك تستكشف الخيارات — بدون استعجال." />
          <div className="how-grid">
            {content.howItWorks.map((step, index) => (
              <article className="how-card" key={step.step}>
                <div className="how-card-top"><span className="how-number">0{step.step}</span>{index === 0 ? <Search size={18} /> : index === 1 ? <Sparkles size={18} /> : <Check size={18} />}</div>
                <h3>{step.title}</h3><p>{step.description}</p>
                <span className="how-line" />
              </article>
            ))}
          </div>
          <DemoNotice>هذه النسخة للمعاينة فقط. الطلبات لا تتضمن دفعًا أو تنزيلًا أو تفعيلًا فعليًا.</DemoNotice>
        </div>
      </section>

      <section className="benefits-section page-shell">
        <div className="benefits-intro"><p className="eyebrow">ليش نَسَق؟</p><h2>اختيار أوضح،<br /><em>من أول نظرة.</em></h2><Link className="text-link" href="/faq">عندك سؤال؟ شوف الأسئلة الشائعة <ChevronLeft size={15} /></Link></div>
        <div className="benefit-list">
          {content.benefits.map((benefit, index) => <article key={benefit.title} className="benefit-row"><span className="benefit-index">0{index + 1}</span><div><h3>{benefit.title}</h3><p>{benefit.description}</p></div><ArrowUpLeft size={16} /></article>)}
        </div>
        <div className="benefits-flower" aria-hidden="true"><Flower2 size={80} strokeWidth={0.7} /></div>
      </section>

      <section className="last-cta page-shell">
        <div><p className="eyebrow">خطوتك الجاية</p><h2>يمكن ثيمك الجاي<br />هنا.</h2></div>
        <p>خذ جولة بين التصاميم، واحفظ اللي يعجبك عشان ترجع له وقت ما تحب.</p>
        <Link href="/themes" className="button button--light button--large">ابدأ التصفح <ArrowLeft size={17} /></Link>
      </section>
    </div>
  );
}

function HomeSkeleton() {
  return <div className="page-shell home-skeleton"><div className="skeleton-line skeleton-line--short" /><div className="skeleton-line skeleton-line--title" /><div className="skeleton-line" /><div className="skeleton-card skeleton-card--hero" /></div>;
}
