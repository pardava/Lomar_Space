"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FurnitureGrid from "@/components/furniture/FurnitureGrid";
import CatalogFiltersSidebar from "@/components/catalog/CatalogFiltersSidebar";
import CategoryIconRow from "@/components/catalog/CategoryIconRow";
import TrustBadges from "@/components/catalog/TrustBadges";
import AIDesignerBanner from "@/components/catalog/AIDesignerBanner";
import { getFilteredFurniture, getFilterOptions } from "@/services/furniture.service";
import { useCartStore } from "@/store/cartStore";
import type { Furniture } from "@/components/furniture/types";

export default function CatalogPage() {
  const [items, setItems] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);

  const [category, setCategory] = useState<string>();
  const [style, setStyle] = useState<string>();
  const [sort, setSort] = useState("newest");

  const addToCart = useCartStore((s) => s.add);

  useEffect(() => {
    getFilterOptions().then(({ categories, styles }) => {
      setCategories(categories);
      setStyles(styles);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getFilteredFurniture({
      category,
      style,
      sort: sort as "price_asc" | "price_desc" | "newest",
    })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [category, style, sort]);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7EA6D8]">
            Marketplace
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl text-[#33475A] md:text-5xl">
            Browse the full catalog
          </h1>
          <p className="mt-4 text-lg text-[#5B7186]">
            Every piece here is real and shoppable — no AI design needed to
            explore.
          </p>
        </div>

        <div className="mt-10">
          <CategoryIconRow
            categories={categories}
            selected={category}
            onSelect={setCategory}
          />
        </div>

        <div className="mt-10">
          <TrustBadges />
        </div>

        <div className="mt-12 flex flex-col gap-10 lg:flex-row">
          <CatalogFiltersSidebar
            categories={categories}
            styles={styles}
            selectedCategory={category}
            selectedStyle={style}
            sort={sort}
            onCategoryChange={setCategory}
            onStyleChange={setStyle}
            onSortChange={setSort}
          />

          <div className="flex-1">
            <p className="mb-5 text-sm text-[#8598A8]">
              {loading ? "Loading…" : `${items.length} items`}
            </p>
            <FurnitureGrid items={items} loading={loading} onAdd={addToCart} />
          </div>
        </div>

        <AIDesignerBanner />
      </main>

      <Footer />
    </>
  );
}
