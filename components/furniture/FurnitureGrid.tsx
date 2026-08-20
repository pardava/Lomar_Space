"use client";

import FurnitureCard from "./FurnitureCard";
import type { Furniture } from "./types";

interface FurnitureGridProps {
  items: Furniture[];
  loading?: boolean;
  onAdd?: (item: Furniture) => void;
  addedIds?: string[];
}

export default function FurnitureGrid({
  items,
  loading = false,
  onAdd,
  addedIds = [],
}: FurnitureGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-[#3A2119]/8 bg-white"
          >
            <div className="aspect-square animate-pulse bg-[#E8EEF4]" />

            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#E8EEF4]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[#E8EEF4]" />
              <div className="h-8 w-full animate-pulse rounded-full bg-[#E8EEF4]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#3A2119]/15 bg-[#D2E2EC] px-6 py-12 text-center">
        <p className="text-sm font-medium text-[#3A2119]">
          No matching furniture found.
        </p>

        <p className="mt-1 text-xs text-[#957662]">
          Try another style, room type, color or budget.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <FurnitureCard
          key={item.id}
          item={item}
          onAdd={onAdd}
          isAdded={addedIds.includes(item.id)}
        />
      ))}
    </div>
  );
}