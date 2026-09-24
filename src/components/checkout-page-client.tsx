"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpLeft, Check, CircleAlert, LoaderCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useCreateDemoOrder } from "@/lib/api/modules/orders/hooks";
import { useCart, useClearCart } from "@/lib/store-state/hooks";
import { formatPrice } from "@/lib/utils";
import { DemoNotice, EmptyState, LoadingState } from "./shared";

export function CheckoutPageClient() {
  const cart = useCart();
  const createOrder = useCreateDemoOrder();
  const clearCart = useClearCart();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  if (cart.isLoading && !cart.data) return <div className="page-shell checkout-page"><LoadingState label="نجهز ملخص السلة..." /></div>;
  const items = cart.data?.items ?? [];
  if (!items.length) return <div className="page-shell checkout-page"><div className="page-heading-center"><p className="eyebrow">الطلب التجريبي</p><h1>ما فيه شيء نكمل عليه</h1><p>أضف ثيمًا للسلة أولًا، ثم ارجع هنا.</p></div><EmptyState title="سلتك فاضية" description="اكتشف ثيمات العرض وأضف اللي يعجبك." href="/themes" action="اكتشف الثيمات" /></div>;

  async function handleSubmit() {
    if (!accepted) return;
    try {
      const order = await createOrder.mutateAsync({ themeIds: items.map((item) => item.themeId), acceptedDemoNotice: true });
      await clearCart.mutateAsync();
      toast.success("تم إنشاء طلب تجريبي", { description: "ما تم تحصيل أي مبلغ." });
      router.push(`/orders/${order.id}`);
    } catch {
      toast.error("ما قدرنا ننشئ الطلب التجريبي", { description: "تحقق من السلة وحاول مرة ثانية." });
    }
  }

  return (
    <div className="page-shell checkout-page">
      <div className="page-heading-row"><div><p className="eyebrow">آخر خطوة — للمعاينة</p><h1>مراجعة الطلب</h1><p>تأكد من اختياراتك قبل إنشاء ملخص الطلب التجريبي.</p></div><Link className="text-link" href="/cart"><ArrowUpLeft size={15} /> العودة للسلة</Link></div>
      <div className="checkout-layout">
        <section className="checkout-card"><div className="checkout-card-heading"><span>١</span><div><h2>اختياراتك</h2><p>{items.length} ثيم للمعاينة</p></div></div><div className="checkout-lines">{items.map((item) => <div className="checkout-line" key={item.themeId}><div className="checkout-line-icon">N.</div><div><strong>{item.name}</strong><span>معاينة تصميمية · لا يوجد تنزيل</span></div><b>{item.price === 0 ? "مجاني" : formatPrice(item.price)}</b></div>)}</div><div className="checkout-total"><span>المجموع المعروض</span><strong>{formatPrice(cart.data?.subtotal ?? 0)}</strong></div><p className="cart-no-tax">لا تُحسب ضرائب أو رسوم في هذا النموذج.</p></section>
        <aside className="checkout-confirm-card"><span className="checkout-warning-icon"><ShieldAlert size={22} /></span><p className="eyebrow">قبل التأكيد</p><h2>هذه تجربة توضيحية فقط</h2><p className="checkout-disclaimer">لن يتم تحصيل أي مبلغ، ولن يتم تفعيل أو تنزيل أي ثيم. سيُنشأ ملخص تجريبي داخل المتصفح فقط.</p><label className="demo-accept"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span className="custom-checkbox">{accepted && <Check size={13} />}</span><span>أفهم أن هذا طلب تجريبي وليس عملية شراء</span></label>{createOrder.isError && <p className="form-error" role="alert"><CircleAlert size={15} /> تعذر إكمال الطلب التجريبي. حاول مرة ثانية.</p>}<button className="button button--primary button--full button--large" type="button" disabled={!accepted || createOrder.isPending} onClick={handleSubmit}>{createOrder.isPending ? <LoaderCircle size={17} className="spin" /> : null}{createOrder.isPending ? "نجهز الملخص..." : "أنشئ الطلب التجريبي"}<ArrowLeft size={16} /></button><span className="checkout-no-payment">لا توجد بيانات دفع مطلوبة أو محفوظة.</span></aside>
      </div>
      <DemoNotice><span><strong>تنويه:</strong> نَسَق مستقل، وهذه النسخة لا تمثل عملية شراء عبر سلة أو أي بوابة دفع.</span></DemoNotice>
    </div>
  );
}
