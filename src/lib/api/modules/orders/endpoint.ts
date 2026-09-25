import type { ApiClient } from "../../transport/types";
import { createDemoOrderSchema, demoOrderSchema } from "../../schemas/store";
import type { CreateDemoOrderInput, DemoOrderDto } from "../../contracts/order";

export function createOrderEndpoints(client: ApiClient) {
  return {
    createDemo: (input: CreateDemoOrderInput) => client.post<DemoOrderDto, CreateDemoOrderInput>("/v1/orders/demo", input, { requestSchema: createDemoOrderSchema, responseSchema: demoOrderSchema }),
    getDemo: (orderId: string) => client.get<DemoOrderDto>(`/v1/orders/demo/${encodeURIComponent(orderId)}`, { responseSchema: demoOrderSchema }),
  };
}
