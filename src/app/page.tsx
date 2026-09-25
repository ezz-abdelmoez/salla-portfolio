import { HomePage } from "@/components/home-page";
import { getHomeContentForServer } from "@/lib/api/modules/home/server";
import { listCategoriesForServer } from "@/lib/api/modules/categories/server";
import { listThemesForServer } from "@/lib/api/modules/themes/server";

export default async function Page() {
  const [home, categories, themes] = await Promise.all([
    getHomeContentForServer(),
    listCategoriesForServer(),
    listThemesForServer({ sort: "featured", pageSize: 12 }),
  ]);
  return <HomePage initialHome={home} initialCategories={categories} initialThemes={themes} />;
}
