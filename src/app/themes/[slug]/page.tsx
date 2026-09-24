import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeDetailClient } from "@/components/theme-detail-client";
import { getThemeForServer, listThemeSlugsForServer } from "@/lib/api/modules/themes/server";

export const dynamicParams = false;

export async function generateStaticParams() {
  return listThemeSlugsForServer();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const theme = await getThemeForServer(slug);
    return {
      title: `${theme.name} — ${theme.tagline}`,
      description: theme.description,
      alternates: { canonical: `/themes/${theme.slug}` },
      openGraph: { title: `${theme.name} | نَسَق`, description: theme.description, locale: "ar_SA", type: "website", images: [theme.coverImage] },
    };
  } catch {
    return { title: "ثيم غير موجود" };
  }
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let theme;
  try { theme = await getThemeForServer(slug); } catch { notFound(); }
  return <ThemeDetailClient slug={slug} initialTheme={theme} />;
}
