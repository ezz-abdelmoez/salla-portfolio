import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveStorefrontPreview } from "@/components/live-storefront-preview";
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
      title: `معاينة ${theme.name} — متجر تجريبي محلي`,
      description: `محاكاة محلية متجاوبة لتصميم ${theme.name}، ببيانات وعناصر تجريبية وليست متجرًا فعليًا على سلة.`,
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: "معاينة غير متاحة", robots: { index: false, follow: false } };
  }
}

export default async function ThemePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = await getThemeForServer(slug).catch(() => null);
  if (!theme) notFound();
  return <LiveStorefrontPreview theme={theme} />;
}
