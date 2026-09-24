import Image from "next/image";
import Link from "next/link";
import { Armchair, ArrowUpLeft, Coffee, Gift, Headphones, Shirt, Sparkles } from "lucide-react";
import type { CategoryDto } from "@/lib/api/contracts/category";

const icons = { Shirt, Sparkles, Armchair, Coffee, Headphones, Gift } as const;

export function CategoryGrid({ categories, compact = false }: { categories: CategoryDto[]; compact?: boolean }) {
  return (
    <div className={`category-grid ${compact ? "category-grid--compact" : ""}`}>
      {categories.map((category, index) => {
        const Icon = icons[category.icon as keyof typeof icons] ?? Sparkles;
        return (
          <Link href={`/categories/${category.slug}`} className="category-card" key={category.id} style={{ animationDelay: `${index * 45}ms` }}>
            <div className="category-card-image">
              <Image src={category.image} alt="" fill sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 190px" />
              <span className="category-icon"><Icon size={19} strokeWidth={1.7} /></span>
              <span className="category-arrow"><ArrowUpLeft size={15} /></span>
            </div>
            <div className="category-card-copy">
              <div><h3>{category.name}</h3><p>{category.themeCount} ثيمات للمعاينة</p></div>
              <span className="category-mini-arrow">↖</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
