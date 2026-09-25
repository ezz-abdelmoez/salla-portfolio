"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpLeft, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useCart, useFavorites } from "@/lib/store-state/hooks";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 34 34" fill="none">
        <path d="M6 9.5C6 7.567 7.567 6 9.5 6h15A3.5 3.5 0 0 1 28 9.5v2A3.5 3.5 0 0 1 24.5 15h-15A3.5 3.5 0 0 1 6 11.5v-2Z" fill="currentColor" />
        <path d="M6 22.5A3.5 3.5 0 0 1 9.5 19h9a3.5 3.5 0 0 1 0 7h-9A3.5 3.5 0 0 1 6 22.5Z" fill="currentColor" opacity=".45" />
        <circle cx="25" cy="22.5" r="3.5" fill="#D99A6C" />
      </svg>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();
  const favorites = useFavorites();

  return (
    <>
      <div className="announcement-bar">
        <span className="announcement-dot" />
        <span>نَسَق متجر مستقل — المعاينات والطلبات هنا تجريبية</span>
        <Link href="/about">اعرف أكثر <ArrowUpLeft size={13} /></Link>
      </div>
      <header className="site-header">
        <div className="header-inner page-shell">
          <Link href="/" className="brand-lockup" aria-label="نَسَق — الصفحة الرئيسية">
            <BrandMark />
            <span className="brand-word">نَسَق<span className="brand-period">.</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={cn("nav-link", pathname === item.href && "nav-link--active")} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="icon-button header-search" href="/themes" aria-label="ابحث عن ثيم"><Search size={18} /></Link>
            <Link className="icon-button header-favorite" href="/favorites" aria-label={`المفضلة، ${favorites.data?.length ?? 0} ثيم`}>
              <Heart size={18} />
              {(favorites.data?.length ?? 0) > 0 && <span className="count-badge">{favorites.data!.length}</span>}
            </Link>
            <Link className="icon-button header-cart" href="/cart" aria-label={`السلة، ${cart.data?.itemCount ?? 0} ثيم`}>
              <ShoppingBag size={18} />
              {(cart.data?.itemCount ?? 0) > 0 && <span className="count-badge">{cart.data!.itemCount}</span>}
            </Link>
            <ThemeToggle />
            <button className="icon-button mobile-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={menuOpen}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav page-shell" aria-label="التنقل للجوال">
            {siteConfig.nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
            <Link href="/favorites"><Heart size={16} /> المفضلة <span>{favorites.data?.length ?? 0}</span></Link>
            <Link href="/cart"><ShoppingBag size={16} /> السلة <span>{cart.data?.itemCount ?? 0}</span></Link>
          </nav>
        )}
      </header>
    </>
  );
}
