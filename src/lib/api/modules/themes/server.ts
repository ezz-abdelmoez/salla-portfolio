import "server-only";
import type { ThemeFilter } from "../../contracts/theme";
import { createServerApiClient } from "../../server-client";
import { createThemeEndpoints } from "./endpoint";

export async function listThemesForServer(filter: ThemeFilter = {}) {
  return createThemeEndpoints(createServerApiClient()).list(filter);
}
export async function getThemeForServer(slug: string) {
  return createThemeEndpoints(createServerApiClient()).get(slug);
}
export async function listThemeSlugsForServer() {
  const page = await listThemesForServer({ page: 1, pageSize: 48 });
  return page.items.map((theme) => ({ slug: theme.slug }));
}
