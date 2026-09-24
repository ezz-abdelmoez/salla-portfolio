import Link from "next/link";
import { AlertCircle, ArrowUpLeft, LoaderCircle, PackageOpen, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p className="section-description">{description}</p>}</div>
      {action && <div className="section-heading-action">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "جاري التحميل..." }: { label?: string }) {
  return <div className="inline-loading" role="status"><LoaderCircle size={18} className="spin" /><span>{label}</span></div>;
}

export function QueryError({ onRetry, message = "ما قدرنا نحمّل البيانات." }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="query-error" role="alert">
      <AlertCircle size={22} />
      <div><strong>صار خطأ بسيط</strong><p>{message}</p></div>
      {onRetry && <button className="text-button" onClick={onRetry}><RotateCcw size={15} /> حاول مرة ثانية</button>}
    </div>
  );
}

export function EmptyState({ title, description, href = "/themes", action = "استكشف الثيمات" }: { title: string; description: string; href?: string; action?: string }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon"><PackageOpen size={25} strokeWidth={1.6} /></span>
      <h2>{title}</h2><p>{description}</p>
      <Link href={href} className="button button--outline">{action}<ArrowUpLeft size={16} /></Link>
    </div>
  );
}

export function DemoNotice({ children = "نسخة عرض تجريبية — لا توجد عملية دفع أو تفعيل حقيقية." }: { children?: ReactNode }) {
  return <div className="demo-notice"><span className="demo-notice-mark">i</span><p>{children}</p></div>;
}
