"use client";

import { ExternalLink, ShoppingCart, Trash2 } from "lucide-react";
import type { Furniture } from "@/components/furniture/types";

interface ShoppingListProps {
  items: Furniture[];
  budget: number;
  onRemove: (id: string) => void;
  onBuyEverything: () => void;
}

export default function ShoppingList({
  items,
  budget,
  onRemove,
  onBuyEverything,
}: ShoppingListProps) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const remaining = Math.max(budget - total, 0);

  const progress =
    budget > 0
      ? Math.min((total / budget) * 100, 100)
      : 0;

  return (
    <aside className="rounded-3xl border border-[#33475A]/8 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7EA6D8]">
            Your picks
          </p>

          <h2 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl text-[#33475A]">
            Shopping List
          </h2>
        </div>

        <span className="rounded-full bg-[#F0F4F8] px-3 py-1 text-xs font-medium text-[#33475A]">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* TOTAL */}
      <div className="mt-6 rounded-2xl bg-[#F0F4F8] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#8598A8]">
            Total
          </span>

          <span className="font-[family-name:var(--font-fraunces)] text-xl text-[#33475A]">
            €{total.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#D9E4EF]">
          <div
            className="h-full rounded-full bg-[#7EA6D8] transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-[#8598A8]">
          <span>Budget</span>

          <span>
            €{budget.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="mt-5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#33475A]/15 px-5 py-10 text-center">
            <ShoppingCart
              size={34}
              className="mx-auto text-[#B8C7D6]"
            />

            <p className="mt-4 text-sm font-medium text-[#33475A]">
              Your shopping list is empty
            </p>

            <p className="mt-1 text-xs leading-5 text-[#8598A8]">
              Generate your AI room design and matching
              furniture will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-[#33475A]/8 p-3 transition hover:border-[#7EA6D8]/40 hover:shadow-sm"
              >
                <div className="flex gap-3">
                  {/* IMAGE */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F0F4F8]">
                    {item.image_url &&
                    (item.image_url.startsWith("/") ||
                      item.image_url.startsWith("http://") ||
                      item.image_url.startsWith("https://")) ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-semibold text-[#8598A8]">
                        LOMAR
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#33475A]">
                        {item.name}
                      </h3>

                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="shrink-0 rounded-full p-1.5 text-[#9AA9B7] opacity-70 transition hover:bg-[#B5533C]/10 hover:text-[#B5533C] group-hover:opacity-100"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="font-[family-name:var(--font-fraunces)] text-base text-[#33475A]">
                        {item.currency === "EUR"
                          ? "€"
                          : item.currency || "€"}
                        {Number(item.price).toLocaleString(
                          "de-DE",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>

                      {item.product_url && (
                        <a
                          href={item.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#7EA6D8] hover:text-[#33475A]"
                        >
                          View
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BUDGET STATUS */}
      {items.length > 0 && (
        <div className="mt-5 rounded-2xl border border-[#33475A]/8 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8598A8]">
              Budget remaining
            </span>

            <span
              className={
                total > budget
                  ? "font-semibold text-[#B5533C]"
                  : "font-semibold text-[#33475A]"
              }
            >
              €
              {remaining.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {total > budget && (
            <p className="mt-1 text-xs text-[#B5533C]">
              Your selected furniture is above your budget.
            </p>
          )}
        </div>
      )}

      {/* BUY */}
      <button
        type="button"
        onClick={onBuyEverything}
        disabled={items.length === 0}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#33475A] py-3.5 text-sm font-semibold text-white transition hover:bg-[#7EA6D8] disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ShoppingCart size={16} />
        Buy everything
      </button>
    </aside>
  );
}