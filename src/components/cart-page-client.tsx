"use client";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart, useClearCart, useRemoveFromCart } from "@/lib/store-state/hooks";
import { formatPrice } from "@/lib/utils";
import { DemoNotice, EmptyState, LoadingState } from "./shared";

export function CartPageClient() {
  const cart = useCart();
  const remove = useRemoveFromCart();
  const clear = useClearCart();
  if (cart.isLoading && !cart.data) return <div className="page-shell cart-page"><LoadingState label="نفتح سلتك..." /></div>;
  const items = cart.data?.items ?? [];
  if (!items.length) return <div className="page-shell cart-page"><div className="page-heading-center"><p className="eyebrow">سلتك</p><h1>ما اخترت ثيمات للحين</h1><p>احفظ اللي يعجبك في السلة، أو أضفه للمفضلة عشان ترجع له.</p></div><EmptyState title="السلة فاضية" description="ابدأ من الكتالوج وشوف المعاينات المتاحة." /></div>;

  return (
    <div className="page-shell cart-page">
      <div className="page-heading-row"><div><p className="eyebrow">خطوة قبل الاختيار</p><h1>سلتك <span className="subtle-number">({items.length})</span></h1><p>راجع اختياراتك قبل الطلب التجريبي.</p></div><button className="clear-cart-button" onClick={async () => { await clear.mutateAsync(); toast.success("تم تفريغ السلة"); }}><Trash2 size={15} /> إفراغ السلة</button></div>
      <div className="cart-layout">
        <div className="cart-items-list">
          {items.map((item) => <article className="cart-item" key={item.themeId}><Link className="cart-item-art" href={`/themes/${item.slug}`}><span className="cart-art-pattern"><ShoppingBag size={28} /></span></Link><div className="cart-item-info"><span className="cart-item-kicker">معاينة ثيم</span><Link href={`/themes/${item.slug}`}><h2>{item.name}</h2></Link><p>بيانات عرض تجريبية · لا يتوفر تنزيل</p><button className="remove-item" onClick={async () => { await remove.mutateAsync(item.themeId); toast.success("تم حذف الثيم من السلة"); }}><Trash2 size={14} /> إزالة</button></div><strong className="cart-item-price">{item.price === 0 ? "مجاني" : formatPrice(item.price)}</strong></article>)}
          <Link href="/themes" className="continue-shopping"><ArrowUpLeft size={15} /> متابعة التصفح</Link>
        </div>
        <aside className="cart-summary-card"><div className="cart-summary-title"><span>ملخص الطلب التجريبي</span><ShoppingBag size={18} /></div><div className="cart-summary-line"><span>عدد الثيمات</span><strong>{items.length}</strong></div><div className="cart-summary-line"><span>المجموع الفرعي</span><strong>{formatPrice(cart.data?.subtotal ?? 0)}</strong></div><div className="cart-summary-line cart-summary-total"><span>الإجمالي المعروض</span><strong>{formatPrice(cart.data?.subtotal ?? 0)}</strong></div><p className="cart-no-tax">لا تشمل هذه النسخة دفعًا أو رسومًا أو ضرائب.</p><Link href="/checkout" className="button button--primary button--full">تابع للطلب التجريبي <ArrowLeft size={16} /></Link><div className="cart-secure-note"><Minus size={13} /> طلب توضيحي، وليس عملية شراء</div></aside>
      </div>
      <DemoNotice>المبلغ المعروض بيانات تجريبية فقط. لن يتم تحصيل أي مبلغ أو تفعيل الثيم.</DemoNotice>
    </div>
  );
}
