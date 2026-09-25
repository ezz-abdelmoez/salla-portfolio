import { OrderConfirmationClient } from "@/components/order-confirmation-client";
export const metadata = { title: "ملخص الطلب التجريبي" };
export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderConfirmationClient orderId={orderId} />;
}
