"use client";

import Image from "next/image";
import { ShoppingCart, X } from "lucide-react";
import type { Furniture } from "@/components/furniture/types";

interface ShoppingListProps {
  items: Furniture[];
  budget: number;
  onRemove?: (id: string) => void;
  onBuyEverything?: () => void;
}

export default function ShoppingList({
  items,
  budget,
  onRemove,
  onBuyEverything,
}: ShoppingListProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const percentUsed = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const overBudget = total > budget;

  return (
    <aside className="rounded-3xl border border-[#33475A]/8 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[#33475A]">
          Shop the look
        </h2>
        <span className="text-sm text-[#8598A8]">{items.length} items</span>
      </div>

      {/* Budget bar */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-[#5B7186]">Total</span>
          <span
            className={`font-[family-name:var(--font-fraunces)] text-2xl ${
              overBudget ? "text-[#B5533C]" : "text-[#33475A]"
            }`}
          >
            €{total.toLocaleString()}
            <span className="ml-1 text-sm text-[#8598A8]">
              / €{budget.toLocaleString()}
            </span>
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#D6E4F3]">
          <div
            className={`h-full rounded-full transition-all ${
              overBudget ? "bg-[#B5533C]" : "bg-[#7EA6D8]"
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        {overBudget && (
          <p className="mt-2 text-xs text-[#B5533C]">
            €{(total - budget).toLocaleString()} over your budget
          </p>
        )}
      </div>

      {/* Item list */}
      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-[#8598A8]">
            Your picks will appear here.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 rounded-xl bg-[#F0F4F8] p-2.5"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#33475A]">
                {item.name}
              </p>
              <p className="text-xs text-[#8598A8]">{item.brand_name}</p>
            </div>

            <span className="shrink-0 text-sm font-semibold text-[#33475A]">
              €{item.price.toLocaleString()}
            </span>

            {onRemove && (
              <button
                onClick={() => onRemove(item.id)}
                className="shrink-0 text-[#8598A8] opacity-0 transition hover:text-[#B5533C] group-hover:opacity-100"
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onBuyEverything}
        disabled={items.length === 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#33475A] py-3.5 text-sm font-semibold text-white transition hover:bg-[#7EA6D8] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShoppingCart className="h-4 w-4" />
        Buy everything
      </button>
    </aside>
  );
}
