"use client";

import {
  ExternalLink,
  Ruler,
  Star,
  Plus,
  Check,
} from "lucide-react";

import type { Furniture } from "./types";

interface FurnitureCardProps {
  item: Furniture;
  onRemove?: (id: string) => void;
  onAdd?: (item: Furniture) => void;
  isAdded?: boolean;
}

export default function FurnitureCard({
  item,
  onRemove,
  onAdd,
  isAdded = false,
}: FurnitureCardProps) {
  const dimensions =
    item.width_cm &&
    item.depth_cm &&
    item.height_cm
      ? `${item.width_cm} × ${item.depth_cm} × ${item.height_cm} cm`
      : null;

  const imageUrl =
    item.image_url &&
    (
      item.image_url.startsWith("/") ||
      item.image_url.startsWith("http://") ||
      item.image_url.startsWith("https://")
    )
      ? item.image_url
      : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#33475A]/8 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#33475A]/10">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-[#F0F4F8]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-[#33475A]">
                LOMAR
              </div>

              <div className="text-xs tracking-[0.25em] text-[#7EA6D8]">
                SPACE
              </div>
            </div>
          </div>
        )}

        {/* BRAND */}
        {item.brand_name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#33475A] shadow-sm backdrop-blur">
            {item.brand_name}
          </span>
        )}

        {/* ADDED */}
        {isAdded && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#33475A] px-3 py-1 text-xs font-semibold text-white">
            <Check className="h-3 w-3" />
            Added
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-snug text-[#33475A]">
          {item.name}
        </h3>

        {/* RATING */}
        {typeof item.rating === "number" && (
          <p className="mt-2 flex items-center gap-1 text-xs text-[#8598A8]">
            <Star className="h-3 w-3 fill-[#F2E6D6] text-[#F2E6D6]" />

            {item.rating.toFixed(1)}

            {typeof item.review_count === "number" &&
              ` (${item.review_count})`}
          </p>
        )}

        {/* BRAND */}
        {item.brand_name && (
          <p className="mt-1 text-xs text-[#8598A8]">
            {item.brand_name}
          </p>
        )}

        {/* COLOR */}
        {item.color && (
          <p className="mt-2 text-xs text-[#8598A8]">
            Color:{" "}
            <span className="font-medium text-[#5B7186]">
              {item.color}
            </span>
          </p>
        )}

        {/* DIMENSIONS */}
        {dimensions && (
          <p className="mt-2 flex items-center gap-1 text-xs text-[#8598A8]">
            <Ruler className="h-3 w-3" />
            {dimensions}
          </p>
        )}

        {/* PRICE */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-fraunces)] text-xl text-[#33475A]">
            {item.currency ?? "EUR"}{" "}
            {item.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          {item.product_url && (
            <a
              href={item.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-[#33475A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7EA6D8]"
            >
              View
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* ADD */}
        {onAdd && (
          <button
            type="button"
            onClick={() => onAdd(item)}
            disabled={isAdded}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#33475A]/12 py-2.5 text-xs font-semibold text-[#33475A] transition hover:bg-[#33475A] hover:text-white disabled:cursor-default disabled:bg-[#F0F4F8] disabled:text-[#8598A8]"
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                In shopping list
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to shopping list
              </>
            )}
          </button>
        )}

        {/* REMOVE */}
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="mt-2 w-full rounded-full py-2 text-xs font-medium text-[#B5533C] transition hover:bg-[#B5533C]/5"
          >
            Remove
          </button>
        )}
      </div>
    </article>
  );
}