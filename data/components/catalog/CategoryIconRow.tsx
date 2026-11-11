"use client";

import {
  LayoutGrid,
  Sofa,
  Armchair,
  Table2,
  BedDouble,
  Package,
  Lamp,
  Leaf,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sofa: Sofa,
  chair: Armchair,
  table: Table2,
  bed: BedDouble,
  wardrobe: Package,
  shelf: Package,
  lamp: Lamp,
  decor: Leaf,
  rug: LayoutGrid,
};

interface CategoryIconRowProps {
  categories: string[];
  selected?: string;
  onSelect: (category?: string) => void;
}

export default function CategoryIconRow({
  categories,
  selected,
  onSelect,
}: CategoryIconRowProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(undefined)}
        className="flex shrink-0 flex-col items-center gap-2"
      >
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full transition ${
            !selected ? "bg-[#3A2119] text-white" : "bg-white text-[#957662]"
          }`}
        >
          <LayoutGrid className="h-6 w-6" />
        </span>
        <span className="text-xs font-medium text-[#957662]">All</span>
      </button>

      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category] ?? Package;
        const active = selected === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full transition ${
                active ? "bg-[#3A2119] text-white" : "bg-white text-[#957662]"
              }`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-xs font-medium capitalize text-[#957662]">
              {category}
            </span>
          </button>
        );
      })}
    </div>
  );
}
