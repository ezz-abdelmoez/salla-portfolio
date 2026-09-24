import type { ApiClient } from "../../transport/types";
import { homeContentSchema } from "../../schemas/store";
import type { HomeContentDto } from "../../contracts/home";

export function createHomeEndpoints(client: ApiClient) {
  return {
    getContent: () => client.get<HomeContentDto>("/v1/home/content", { responseSchema: homeContentSchema }),
  };
}
