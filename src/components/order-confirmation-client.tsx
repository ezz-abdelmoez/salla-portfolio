"use client";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, CircleCheck, CircleHelp, ShoppingBag } from "lucide-react";
import { useDemoOrder } from "@/lib/api/modules/orders/hooks";
import { formatPrice } from "@/lib/utils";
import { LoadingState, QueryError } from "./shared";

export function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const order = useDemoOrder(orderId);
  if (order.isLoading) return <div className="page-shell order-page"><LoadingState label="نحمّل ملخص الطلب..." /></div>;
  if (order.isError || !order.data) return <div className="page-shell order-page"><QueryError message="ما لقينا هذا الطلب التجريبي على هذا الجهاز. يمكن انتهت جلسة العرض." /><Link href="/themes" className="button button--outline">ارجع للثيمات <ArrowUpLeft size={15} /></Link></div>;
  const data = order.data;
  return (
    <div className="page-shell order-page">
      <section className="order-success-card"><span className="order-success-icon"><CircleCheck size={28} /></span><p className="eyebrow">اكتمل نموذج العرض</p><h1>تم إنشاء ملخص تجريبي</h1><p>ما تم تحصيل أي مبلغ، وما تم تفعيل أو تنزيل أي ثيم.</p><span className="order-status-pill"><CircleHelp size={15} /> طلب تجريبي — غير مدفوع</span><div className="order-id-row"><span>رقم العرض</span><code dir="ltr">{data.id}</code></div><div className="order-lines">{data.items.map((item) => <div key={item.themeId}><span><ShoppingBag size={15} />{item.name}</span><strong>{item.price === 0 ? "مجاني" : formatPrice(item.price)}</strong></div>)}</div><div className="order-total"><span>الإجمالي المعروض</span><strong>{formatPrice(data.subtotal)}</strong></div><div className="order-actions"><Link href="/themes" className="button button--primary">استكشف المزيد <ArrowLeft size={16} /></Link><Link href="/" className="button button--outline">الرئيسية <ArrowUpLeft size={15} /></Link></div><p className="order-safe-note">لا توجد بيانات دفع أو معلومات شخصية محفوظة في هذا النموذج.</p></section>
    </div>
  );
}
