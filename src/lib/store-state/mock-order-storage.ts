import { demoOrderSchema } from "../api/schemas/store";
import type { DemoOrderDto } from "../api/contracts/order";

const SESSION_KEY = "nasaq-demo-orders-v1";

function readSessionOrders(): DemoOrderDto[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.sessionStorage.getItem(SESSION_KEY);
    if (!value) return [];
    const parsed = demoOrderSchema.array().safeParse(JSON.parse(value));
    if (parsed.success) return parsed.data;
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    try { window.sessionStorage.removeItem(SESSION_KEY); } catch {}
  }
  return [];
}

export function saveDemoOrder(order: DemoOrderDto) {
  if (typeof window === "undefined") return;
  try {
    const orders = readSessionOrders().filter((item) => item.id !== order.id);
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify([...orders.slice(-9), demoOrderSchema.parse(order)]));
  } catch {}
}

export function findDemoOrder(orderId: string) {
  return readSessionOrders().find((order) => order.id === orderId);
}
