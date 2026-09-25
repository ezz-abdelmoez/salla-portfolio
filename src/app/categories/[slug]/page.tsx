import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeCatalog } from "@/components/theme-catalog";
import { getCategoryForServer, listCategoriesForServer } from "@/lib/api/modules/categories/server";

export const dynamicParams = false;
export async function generateStaticParams() {
  const categories = await listCategoriesForServer();
  return categories.map((category) => ({ slug: category.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryForServer(slug);
    return { title: category.name, description: category.description, alternates: { canonical: `/categories/${slug}` } };
  } catch { return { title: "تصنيف غير موجود" }; }
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let category;
  try { category = await getCategoryForServer(slug); } catch { notFound(); }
  return <ThemeCatalog key={slug} initialCategory={slug} heading={`ثيمات ${category.name}`} eyebrow={category.name} description={category.description} />;
}
