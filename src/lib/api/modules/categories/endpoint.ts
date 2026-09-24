import type { ApiClient } from "../../transport/types";
import { categoryDetailSchema, categorySchema } from "../../schemas/store";
import type { CategoryDetailDto, CategoryDto } from "../../contracts/category";

export function createCategoryEndpoints(client: ApiClient) {
  return {
    list: () => client.get<CategoryDto[]>("/v1/categories", { responseSchema: categorySchema.array() }),
    get: (slug: string) => client.get<CategoryDetailDto>(`/v1/categories/${encodeURIComponent(slug)}`, { responseSchema: categoryDetailSchema }),
  };
}
