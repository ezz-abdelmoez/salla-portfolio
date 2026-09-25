import type { ThemeSummaryDto } from "@/lib/api/contracts/theme";
import { ThemeCard } from "./theme-card";

export function ThemeGrid({ themes }: { themes: ThemeSummaryDto[] }) {
  return <div className="theme-grid">{themes.map((theme, index) => <ThemeCard key={theme.id} theme={theme} index={index} />)}</div>;
}
