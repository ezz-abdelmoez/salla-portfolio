import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-main">
        <div className="footer-brand-block">
          <Link href="/" className="brand-lockup brand-lockup--footer"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 34 34" fill="none"><path d="M6 9.5C6 7.567 7.567 6 9.5 6h15A3.5 3.5 0 0 1 28 9.5v2A3.5 3.5 0 0 1 24.5 15h-15A3.5 3.5 0 0 1 6 11.5v-2Z" fill="currentColor"/><path d="M6 22.5A3.5 3.5 0 0 1 9.5 19h9a3.5 3.5 0 0 1 0 7h-9A3.5 3.5 0 0 1 6 22.5Z" fill="currentColor" opacity=".45"/><circle cx="25" cy="22.5" r="3.5" fill="#D99A6C"/></svg></span><span className="brand-word">نَسَق<span className="brand-period">.</span></span></Link>
          <p>مساحة تجمع ثيمات عربية لمتاجر تطمح لحضور مختلف.</p>
        </div>
        <div className="footer-links-group">
          <h3>اكتشف</h3>
          <Link href="/themes">كل الثيمات</Link>
          <Link href="/categories">التصنيفات</Link>
          <Link href="/favorites">المفضلة</Link>
        </div>
        <div className="footer-links-group">
          <h3>عن نَسَق</h3>
          <Link href="/about">قصتنا</Link>
          <Link href="/#how-it-works">كيف تعمل؟</Link>
          <Link href="/faq">الأسئلة الشائعة</Link>
          <Link href="/contact#custom-theme-request">اطلب تصميم ثيم مخصص</Link>
        </div>
        <Link href="/themes" className="footer-cta">ابدأ باستكشاف الثيمات <ArrowUpLeft size={16} /></Link>
      </div>
      <div className="page-shell footer-bottom">
        <p>© {new Date().getFullYear()} نَسَق. نموذج متجر تجريبي.</p>
        <p className="footer-disclaimer">نَسَق متجر مستقل، وليس تابعًا لمنصة سلة أو ممثلًا لها. الأسعار والتقييمات والطلبات المعروضة بيانات تجريبية.</p>
      </div>
    </footer>
  );
}
