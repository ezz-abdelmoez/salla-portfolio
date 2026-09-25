import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "نَسَق — ثيم يليق بمتجرك", template: "%s | نَسَق" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["ثيمات سلة", "تصميم متاجر", "ثيم متجر إلكتروني", "السعودية", "متاجر عربية"],
  openGraph: {
    title: "نَسَق — ثيم يليق بمتجرك",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "ar_SA",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "نَسَق — ثيم يليق بمتجرك", description: siteConfig.description },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f6f1" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">تخطّي إلى المحتوى</a>
        <Providers>
          <SiteHeader />
          <main id="main-content" className="main-content">{children}</main>
          <SiteFooter />
          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
