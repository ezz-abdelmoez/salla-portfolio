import "server-only";
import { createServerApiClient } from "../../server-client";
import { createOrderEndpoints } from "./endpoint";

export async function getDemoOrderForServer(orderId: string) {
  return createOrderEndpoints(createServerApiClient()).getDemo(orderId);
}
