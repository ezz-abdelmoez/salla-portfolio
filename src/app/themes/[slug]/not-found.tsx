import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function ThemeNotFound() {
  return <main className="error-page"><span className="error-icon"><SearchX size={24} /></span><p className="eyebrow">الثيم غير متاح</p><h1>ما لقينا هذا الثيم</h1><p>قد يكون الرابط تغيّر أو الثيم غير موجود ضمن المعاينات الحالية.</p><Link href="/themes" className="button button--primary">ارجع للثيمات <ArrowLeft size={16} /></Link></main>;
}
