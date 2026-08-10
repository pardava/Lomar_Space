"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { buildAffiliateUrl, groupByRetailer } from "@/lib/affiliateLinks";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const grouped = groupByRetailer(items);
  const total = items.reduce((sum, i) => sum + i.price, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-[#33475A]">
          Your list is empty
        </h1>
        <p className="mt-2 text-[#8598A8]">
          Add furniture from your AI design first.
        </p>
        <Link
          href="/ai"
          className="mt-6 inline-block rounded-full bg-[#33475A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7EA6D8]"
        >
          Back to AI Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/ai"
        className="flex items-center gap-2 text-sm text-[#5B7186] hover:text-[#33475A]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to AI Studio
      </Link>

      <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-3xl text-[#33475A]">
        Complete your purchase
      </h1>
      <p className="mt-2 text-[#5B7186]">
        Lomar doesn&apos;t process payment directly — you&apos;ll check out
        with each store, since every item is sold and shipped by them.
        Total across stores: <strong>€{total.toLocaleString()}</strong>
      </p>

      <div className="mt-10 space-y-8">
        {Object.entries(grouped).map(([retailer, retailerItems]) => {
          const retailerTotal = retailerItems.reduce(
            (sum, i) => sum + i.price,
            0
          );
          return (
            <section
              key={retailer}
              className="rounded-3xl border border-[#33475A]/8 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[#33475A]">
                  {retailer}
                </h2>
                <span className="text-sm text-[#8598A8]">
                  €{retailerTotal.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {retailerItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl bg-[#F0F4F8] p-3"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#33475A]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#8598A8]">
                        €{item.price.toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={buildAffiliateUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1 rounded-full bg-[#33475A] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#7EA6D8]"
                    >
                      Buy
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      onClick={() => remove(item.id)}
                      className="shrink-0 text-xs text-[#8598A8] hover:text-[#B5533C]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-[#8598A8]">
                Each item opens its own {retailer} product page — most
                retailers don&apos;t support adding several items to your
                cart via one link, so you&apos;ll add each to your{" "}
                {retailer} cart individually.
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
