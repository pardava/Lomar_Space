"use client";

import Image from "next/image";
import { ExternalLink, Ruler, Star } from "lucide-react";
import type { Furniture } from "./types";

interface FurnitureCardProps {
  item: Furniture;
  onRemove?: (id: string) => void;
  onAdd?: (item: Furniture) => void;
}

export default function FurnitureCard({ item, onRemove, onAdd }: FurnitureCardProps) {
  const dimensions =
    item.width_cm && item.depth_cm && item.height_cm
      ? `${item.width_cm} × ${item.depth_cm} × ${item.height_cm} cm`
      : null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#33475A]/8 bg-white transition hover:shadow-lg hover:shadow-[#33475A]/5">
      <div className="relative aspect-square w-full overflow-hidden bg-[#F0F4F8]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#8598A8]">
            No image
          </div>
        )}

        {item.brand_name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#33475A] backdrop-blur">
            {item.brand_name}
          </span>
        )}

        {onRemove && (
          <button
            onClick={() => onRemove(item.id)}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#33475A] opacity-0 transition hover:bg-white group-hover:opacity-100"
            aria-label={`Remove ${item.name}`}
          >
            ×
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold leading-snug text-[#33475A]">
          {item.name}
        </h3>

        {/* Only renders if real rating data exists on the item — never
            fabricated. Most items won't have this yet, and that's fine,
            the card just omits the row. */}
        {typeof item.rating === "number" && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#8598A8]">
            <Star className="h-3 w-3 fill-[#F2E6D6] text-[#F2E6D6]" />
            {item.rating.toFixed(1)}
            {typeof item.review_count === "number" && ` (${item.review_count})`}
          </p>
        )}

        {dimensions && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#8598A8]">
            <Ruler className="h-3 w-3" />
            {dimensions}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-[family-name:var(--font-fraunces)] text-lg text-[#33475A]">
            {item.currency ?? "€"}
            {item.price.toLocaleString()}
          </span>

          {item.product_url && (
            <a
              href={item.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-[#7EA6D8] hover:underline"
            >
              View
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {onAdd && (
          <button
            onClick={() => onAdd(item)}
            className="mt-3 w-full rounded-full border border-[#33475A]/12 py-2 text-xs font-semibold text-[#33475A] transition hover:bg-[#33475A] hover:text-white"
          >
            Add to list
          </button>
        )}
      </div>
    </div>
  );
}
