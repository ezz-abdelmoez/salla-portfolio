export default function Loading() {
  return (
    <main className="page-shell loading-shell" aria-label="جاري تحميل الصفحة">
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-grid">
        {[1, 2, 3, 4].map((item) => <div key={item} className="skeleton-card" />)}
      </div>
    </main>
  );
}
