import Link from "next/link";
export default function CategoryNotFound() { return <main className="error-page"><p className="eyebrow">التصنيف غير موجود</p><h1>ما لقينا هذا المجال</h1><p>ارجع للتصنيفات واستكشف الخيارات المتاحة.</p><Link className="button button--primary" href="/categories">كل التصنيفات</Link></main>; }
