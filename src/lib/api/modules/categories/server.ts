import "server-only";
import { createCategoryEndpoints } from "./endpoint";
import { createServerApiClient } from "../../server-client";

export async function listCategoriesForServer() {
  return createCategoryEndpoints(createServerApiClient()).list();
}
export async function getCategoryForServer(slug: string) {
  return createCategoryEndpoints(createServerApiClient()).get(slug);
}
