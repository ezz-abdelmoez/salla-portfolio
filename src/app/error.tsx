"use client";
import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="error-page">
      <span className="error-icon"><AlertCircle size={24} /></span>
      <p className="eyebrow">حصل شيء غير متوقع</p>
      <h1>ما قدرنا نعرض الصفحة</h1>
      <p>جرّب مرة ثانية، أو ارجع للصفحة الرئيسية.</p>
      <button className="button button--primary" onClick={() => reset()}><RotateCcw size={17} /> إعادة المحاولة</button>
    </main>
  );
}
