import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import type { CategoryDto } from "@/lib/api/contracts/category";

const categoryIcons: Record<string, string> = {
  fashion: "/themes/category-icons/fashion.svg",
  beauty: "/themes/category-icons/beauty.svg",
  home: "/themes/category-icons/home.svg",
  food: "/themes/category-icons/food.svg",
  electronics: "/themes/category-icons/electronics.svg",
  gifts: "/themes/category-icons/gifts.svg",
};

export function CategoryGrid({ categories, compact = false }: { categories: CategoryDto[]; compact?: boolean }) {
  return (
    <div className={`category-grid ${compact ? "category-grid--compact" : ""}`}>
      {categories.map((category, index) => {
        const iconSrc = categoryIcons[category.slug] ?? "/themes/category-icons/sparkles.svg";
        return (
          <Link href={`/categories/${category.slug}`} className="category-card" key={category.id} style={{ animationDelay: `${index * 45}ms` }}>
            <div className="category-card-image">
              <Image src={category.image} alt="" fill sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 190px" />
              <span className="category-icon" aria-hidden="true"><Image src={iconSrc} alt="" width={21} height={21} /></span>
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
