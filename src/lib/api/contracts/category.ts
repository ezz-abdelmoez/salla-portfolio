import type { ThemeSummaryDto } from "./theme";

export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  order: number;
  themeCount: number;
}

export interface CategoryDetailDto extends CategoryDto {
  themes: ThemeSummaryDto[];
}
