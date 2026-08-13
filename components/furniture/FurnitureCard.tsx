"use client";

import Image from "next/image";
import { ExternalLink, Ruler, Star } from "lucide-react";
import type { Furniture } from "./types";

interface FurnitureCardProps {
  item: Furniture;
  onRemove?: (id: string) => void;
  onAdd?: (item: Furniture) => void;
}

export default function FurnitureCard({
  item,
  onRemove,
  onAdd,
}: FurnitureCardProps) {
  const dimensions =
    item.width_cm && item.depth_cm && item.height_cm
      ? `${item.width_cm} × ${item.depth_cm} × ${item.height_cm} cm`
      : null;

  const productUrl = item.product_url || "#";

  // Supports both:
  // /placeholder-furniture.svg
  // https://res.cloudinary.com/...
  // https://...
  const hasValidImage =
    typeof item.image_url === "string" &&
    (
      item.image_url.startsWith("/") ||
      item.image_url.startsWith("http://") ||
      item.image_url.startsWith("https://")
    );

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#33475A]/8 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#33475A]/5">
      
      {/* PRODUCT IMAGE */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F0F4F8]">
        {hasValidImage ? (
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${item.name} on retailer website`}
            className="relative block h-full w-full"
          >
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </a>
        ) : (
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${item.name} on retailer website`}
            className="flex h-full items-center justify-center"
          >
            <div className="text-center">
              <div className="text-base font-semibold text-[#33475A]">
                LOMAR SPACE
              </div>

              <div className="mt-1 text-xs text-[#7EA6D8]">
                Furniture
              </div>
            </div>
          </a>
        )}

        {/* BRAND */}
        {item.brand_name && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#33475A] backdrop-blur">
            {item.brand_name}
          </span>
        )}

        {/* REMOVE */}
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#33475A] opacity-0 transition hover:bg-white group-hover:opacity-100"
            aria-label={`Remove ${item.name}`}
          >
            ×
          </button>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4">

        {/* NAME */}
        <h3 className="text-sm font-semibold leading-snug text-[#33475A]">
          {item.name}
        </h3>

        {/* RATING */}
        {typeof item.rating === "number" && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#8598A8]">
            <Star className="h-3 w-3 fill-[#F2E6D6] text-[#F2E6D6]" />

            {item.rating.toFixed(1)}

            {typeof item.review_count === "number" &&
              ` (${item.review_count})`}
          </p>
        )}

        {/* DIMENSIONS */}
        {dimensions && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#8598A8]">
            <Ruler className="h-3 w-3" />
            {dimensions}
          </p>
        )}

        {/* PRICE + VIEW PRODUCT */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-fraunces)] text-lg text-[#33475A]">
            {item.currency ?? "€"}
            {item.price.toLocaleString()}
          </span>

          {item.product_url && (
            <a
              href={item.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-[#33475A] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#7EA6D8]"
            >
              View Product
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* ADD TO LIST */}
        {onAdd && (
          <button
            type="button"
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