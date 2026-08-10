import type { Furniture } from "@/components/furniture/types";

// Map each retailer to its affiliate program's tracking param.
// Fill these in once you've signed up for each program:
// - IKEA: usually via an affiliate network like Awin or Partnerize
// - Otto: Otto Partnerprogramm (Awin)
// - Desenio, Wayfair: often direct affiliate programs
//
// Until you have real partner IDs, this appends nothing and just
// returns the plain product URL — links still work, you just won't
// earn commission yet.
const AFFILIATE_PARAMS: Record<string, { param: string; id?: string }> = {
  IKEA: { param: "awc", id: process.env.NEXT_PUBLIC_AFFILIATE_ID_IKEA },
  Otto: { param: "awc", id: process.env.NEXT_PUBLIC_AFFILIATE_ID_OTTO },
  Desenio: { param: "aff", id: process.env.NEXT_PUBLIC_AFFILIATE_ID_DESENIO },
  Wayfair: { param: "aff", id: process.env.NEXT_PUBLIC_AFFILIATE_ID_WAYFAIR },
};

/**
 * Builds an outbound link to the retailer's product page, tagged with
 * your affiliate ID when one is configured for that retailer.
 */
export function buildAffiliateUrl(item: Furniture): string {
  if (!item.product_url) return "#";

  const brand = item.brand_name ?? "";
  const config = AFFILIATE_PARAMS[brand];

  if (!config?.id) return item.product_url;

  try {
    const url = new URL(item.product_url);
    url.searchParams.set(config.param, config.id);
    return url.toString();
  } catch {
    return item.product_url;
  }
}

/** Groups cart items by retailer, since checkout happens per-store. */
export function groupByRetailer(
  items: Furniture[]
): Record<string, Furniture[]> {
  return items.reduce<Record<string, Furniture[]>>((groups, item) => {
    const key = item.brand_name ?? "Other";
    groups[key] = groups[key] ? [...groups[key], item] : [item];
    return groups;
  }, {});
}
