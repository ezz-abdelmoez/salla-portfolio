export interface HomeContentDto {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  benefits: { title: string; description: string; icon: string }[];
  howItWorks: { step: number; title: string; description: string }[];
  featuredThemeIds: string[];
  categoryIds: string[];
}
