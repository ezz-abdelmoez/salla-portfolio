export const orderKeys = { all: ["orders"] as const, demo: (orderId: string) => [...orderKeys.all, "demo", orderId] as const };
