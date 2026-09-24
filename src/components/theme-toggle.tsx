"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  if (!mounted) return <span className="icon-button icon-button--placeholder" aria-hidden="true" />;
  const dark = resolvedTheme === "dark";
  return (
    <button className="icon-button" type="button" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"} title={dark ? "الوضع الفاتح" : "الوضع الداكن"}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
