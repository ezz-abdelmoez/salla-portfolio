import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="error-page">
      <span className="error-icon"><SearchX size={25} /></span>
      <p className="eyebrow">404 · الصفحة غير موجودة</p>
      <h1>شكل الرابط مو مضبوط</h1>
      <p>الصفحة اللي تبحث عنها غير متاحة، خلّنا نرجعك للثيمات.</p>
      <Link className="button button--primary" href="/themes">اكتشف الثيمات <ArrowLeft size={17} /></Link>
    </main>
  );
}
