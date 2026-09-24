import type { Metadata } from "next";
import { ThemeCatalog } from "@/components/theme-catalog";

export const metadata: Metadata = { title: "الثيمات", description: "تصفّح معاينات ثيمات عربية لمتاجر سلة، مع تفاصيل الأسعار والمزايا التجريبية." };

export default async function ThemesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  return <ThemeCatalog initialCategory={params.category || ""} />;
}
