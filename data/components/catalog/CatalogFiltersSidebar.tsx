"use client";

interface CatalogFiltersSidebarProps {
  categories: string[];
  styles: string[];
  selectedCategory?: string;
  selectedStyle?: string;
  sort: string;
  onCategoryChange: (category?: string) => void;
  onStyleChange: (style?: string) => void;
  onSortChange: (sort: string) => void;
}

export default function CatalogFiltersSidebar({
  categories,
  styles,
  selectedCategory,
  selectedStyle,
  sort,
  onCategoryChange,
  onStyleChange,
  onSortChange,
}: CatalogFiltersSidebarProps) {
  return (
    <aside className="w-full shrink-0 space-y-8 lg:w-64">
      <div>
        <p className="mb-3 text-sm font-semibold text-[#3A2119]">Sort by</p>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-xl border border-[#3A2119]/12 bg-white px-3.5 py-2.5 text-sm text-[#3A2119] outline-none focus:border-[#3A2119]"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#3A2119]">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition ${
              !selectedCategory
                ? "border-[#3A2119] bg-[#3A2119] text-white"
                : "border-[#3A2119]/15 text-[#957662] hover:border-[#3A2119]/30"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition ${
                selectedCategory === cat
                  ? "border-[#3A2119] bg-[#3A2119] text-white"
                  : "border-[#3A2119]/15 text-[#957662] hover:border-[#3A2119]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#3A2119]">Style</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStyleChange(undefined)}
            className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition ${
              !selectedStyle
                ? "border-[#3A2119] bg-[#3A2119] text-white"
                : "border-[#3A2119]/15 text-[#957662] hover:border-[#3A2119]/30"
            }`}
          >
            All
          </button>
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition ${
                selectedStyle === style
                  ? "border-[#3A2119] bg-[#3A2119] text-white"
                  : "border-[#3A2119]/15 text-[#957662] hover:border-[#3A2119]/30"
              }`}
            >
              {style.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
