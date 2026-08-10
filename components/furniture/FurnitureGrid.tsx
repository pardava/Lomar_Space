"use client";

import FurnitureCard from "./FurnitureCard";
import type { Furniture } from "./types";

interface FurnitureGridProps {
  items: Furniture[];
  loading?: boolean;
  onRemove?: (id: string) => void;
  onAdd?: (item: Furniture) => void;
}

export default function FurnitureGrid({
  items,
  loading,
  onRemove,
  onAdd,
}: FurnitureGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-[#33475A]/5"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#33475A]/15 py-20 text-center">
        <p className="text-sm font-medium text-[#33475A]">
          No furniture matches yet
        </p>
        <p className="mt-1 text-sm text-[#8598A8]">
          Try a different style or widen your budget.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <FurnitureCard key={item.id} item={item} onRemove={onRemove} onAdd={onAdd} />
      ))}
    </div>
  );
}
