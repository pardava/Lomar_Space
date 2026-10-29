"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/ai/Sidebar";
import Workspace from "@/components/ai/Workspace";
import BudgetPanel from "@/components/ai/BudgetPanel";
import ShoppingList from "@/components/ai/ShoppingList";
import FurnitureGrid from "@/components/furniture/FurnitureGrid";

import { useCartStore } from "@/store/cartStore";

import type { Furniture } from "@/components/furniture/types";

import { Menu } from "lucide-react";

const STYLE_MAP: Record<string, string> = {
  Modern: "modern",
  Minimal: "minimalist",
  Luxury: "luxury",
  Scandinavian: "scandinavian",
};

type GeneratedProduct = {
  id: string;
  name: string;
  description?: string | null;

  price: number;
  currency?: string;

  image_url?: string | null;
  imageUrl?: string | null;

  product_url?: string | null;
  productUrl?: string | null;

  affiliate_url?: string | null;
  affiliateUrl?: string | null;

  category?: string;

  style?: string[];
  colors?: string[];
  rooms?: string[];
  materials?: string[];

  width?: number | null;
  height?: number | null;
  depth?: number | null;

  in_stock?: boolean;
  is_active?: boolean;
  render_ready?: boolean;
};

export default function AiStudioPage() {
  const router = useRouter();

  /*
   * ============================
   * UPLOAD / AI
   * ============================
   */

  const [uploadedFile, setUploadedFile] =
    useState<File | null>(null);

  const [uploadedImageUrl, setUploadedImageUrl] =
    useState<string>();

  const [cloudinaryUrl, setCloudinaryUrl] =
    useState<string>();

  const [resultImageUrl, setResultImageUrl] =
    useState<string>();

  /*
   * ============================
   * DESIGN SETTINGS
   * ============================
   */

  const [selectedStyle, setSelectedStyle] =
    useState("Scandinavian");

  const [roomType, setRoomType] =
    useState("living_room");

  const [selectedColor, setSelectedColor] =
    useState("beige");

  /*
   * ============================
   * LOADING / ERROR
   * ============================
   */

  const [generating, setGenerating] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string>();

  /*
   * ============================
   * BUDGET
   * ============================
   */

  const [budget, setBudget] =
    useState(3500);

  /*
   * ============================
   * REAL AI SELECTED PRODUCTS
   *
   * MUHIM:
   * Bu endi getMatchedFurniture()
   * orqali qayta qidirilmaydi.
   *
   * /api/generate qaytargan
   * products ishlatiladi.
   * ============================
   */

  const [matches, setMatches] =
    useState<Furniture[]>([]);

  const [matchesLoading, setMatchesLoading] =
    useState(false);

  /*
   * ============================
   * MOBILE SIDEBAR
   * ============================
   */

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /*
   * ============================
   * CART
   * ============================
   */

  const cart = useCartStore(
    (state) => state.items
  );

  const addToCartStore = useCartStore(
    (state) => state.add
  );

  const removeFromCartStore = useCartStore(
    (state) => state.remove
  );

  /*
   * ============================
   * CART HYDRATION
   * ============================
   */

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  /*
   * ============================
   * UPLOAD
   * ============================
   */

  async function handleUpload(file: File) {
    setUploadedFile(file);

    setUploadedImageUrl(
      URL.createObjectURL(file)
    );

    setResultImageUrl(undefined);
    setCloudinaryUrl(undefined);

    /*
     * Old AI productsni tozalaymiz.
     */
    setMatches([]);

    setError(undefined);

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const text =
        await response.text();

      if (!response.ok) {
        throw new Error(
          text ||
            "Upload failed"
        );
      }

      const data =
        JSON.parse(text);

      if (!data.url) {
        throw new Error(
          "Upload response does not contain image URL."
        );
      }

      setCloudinaryUrl(
        data.url
      );
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      setError(
        "Rasmni yuklashda xatolik. Qaytadan urinib ko'ring."
      );
    } finally {
      setUploading(false);
    }
  }

  /*
   * ============================
   * CONVERT API PRODUCT
   * TO EXISTING FURNITURE TYPE
   *
   * Biz FurnitureGrid va
   * ShoppingList'ni buzmaslik uchun
   * kerakli aliaslarni ham beramiz.
   * ============================
   */

  function mapGeneratedProduct(
    product: GeneratedProduct
  ): Furniture {
    return {
      ...product,

      id: String(
        product.id
      ),

      name:
        product.name ||
        "Lomar Product",

      price:
        Number(
          product.price || 0
        ),

      image_url:
        product.image_url ??
        null,

      imageUrl:
        product.image_url ??
        product.imageUrl ??
        null,

      product_url:
        product.product_url ??
        product.productUrl ??
        null,

      productUrl:
        product.product_url ??
        product.productUrl ??
        null,

      affiliate_url:
        product.affiliate_url ??
        product.affiliateUrl ??
        null,

      affiliateUrl:
        product.affiliate_url ??
        product.affiliateUrl ??
        null,

      currency:
        product.currency ??
        "EUR",

      category:
        product.category ??
        "furniture",

      style:
        product.style ??
        [],

      colors:
        product.colors ??
        [],

      rooms:
        product.rooms ??
        [],

      materials:
        product.materials ??
        [],
    } as Furniture;
  }

  /*
   * ============================
   * GENERATE DESIGN
   * ============================
   */

  async function handleGenerate() {
    if (!cloudinaryUrl) {
      setError(
        "Avval xona rasmini yuklang."
      );

      return;
    }

    setGenerating(true);
    setMatchesLoading(true);
    setError(undefined);

    /*
     * Juda muhim:
     *
     * Oldingi generate'dan qolgan
     * productlarni UI'dan olib tashlaymiz.
     *
     * Yangi generate faqat yangi
     * AI-selected productsni beradi.
     */
    setMatches([]);

    try {
      /*
       * ==================================
       * 1. GENERATE ROOM + SELECT PRODUCTS
       * ==================================
       */

      console.log(
        "Starting Lomar AI generation..."
      );

      const response =
        await fetch(
          "/api/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              imageUrl:
                cloudinaryUrl,

              style:
                STYLE_MAP[
                  selectedStyle
                ] ??
                "scandinavian",

              roomType,

              color:
                selectedColor,

              budget:
                String(budget),
            }),
          }
        );

      const text =
        await response.text();

      if (!response.ok) {
        throw new Error(
          text ||
            "AI generation failed"
        );
      }

      let data: any;

      try {
        data =
          JSON.parse(text);
      } catch {
        throw new Error(
          "AI server returned invalid JSON."
        );
      }

      if (
        !data.success
      ) {
        throw new Error(
          data.error ||
            "AI generation failed."
        );
      }

      if (!data.imageUrl) {
        throw new Error(
          "AI did not return an image."
        );
      }

      /*
       * ==================================
       * 2. GENERATED ROOM
       * ==================================
       */

      setResultImageUrl(
        data.imageUrl
      );

      /*
       * ==================================
       * 3. REAL PRODUCTS SELECTED BY AI
       * ==================================
       *
       * MUHIM:
       *
       * Bu yerda ENDI:
       *
       * getMatchedFurniture()
       *
       * YO'Q.
       *
       * /api/generate dagi products
       * ishlatiladi.
       */

      const generatedProducts:
        GeneratedProduct[] =
        Array.isArray(
          data.products
        )
          ? data.products
          : [];

      console.log(
        "REAL PRODUCTS FROM /api/generate:",
        generatedProducts
      );

      /*
       * Agar API products qaytarmagan
       * bo'lsa — Shopping List'ni
       * boshqa katalogdan to'ldirmaymiz.
       */

      if (
        generatedProducts.length === 0
      ) {
        throw new Error(
          "AI xona yaratdi, lekin real Supabase furniture products qaytmadi."
        );
      }

      /*
       * ==================================
       * 4. MAP TO FURNITURE
       * ==================================
       */

      const realFurniture =
        generatedProducts.map(
          mapGeneratedProduct
        );

      console.log(
        "FINAL SHOPPING PRODUCTS:",
        realFurniture
      );

      setMatches(
        realFurniture
      );

      /*
       * ==================================
       * 5. ADD EXACT SAME PRODUCTS
       * TO SHOPPING CART
       * ==================================
       *
       * Endi shopping list:
       *
       * generated room
       *       ↓
       * data.products
       *       ↓
       * cart
       *
       * bo'ladi.
       */

      realFurniture.forEach(
        (item) => {
          addToCartStore(item);
        }
      );

      /*
       * ==================================
       * 6. VALIDATION LOG
       * ==================================
       */

      console.log(
        "Lomar generation completed."
      );

      console.log(
        "Generated room image:",
        data.imageUrl
      );

      console.log(
        "Shopping list products:",
        realFurniture.map(
          (item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image:
              item.image_url,
            productUrl:
              item.product_url,
            affiliateUrl:
              item.affiliate_url,
          })
        )
      );
    } catch (error) {
      console.error(
        "Generate error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "AI dizayn yaratishda xatolik yuz berdi."
      );
    } finally {
      setGenerating(false);
      setMatchesLoading(false);
    }
  }

  /*
   * ============================
   * MANUAL ADD
   * ============================
   */

  function addToCart(
    item: Furniture
  ) {
    addToCartStore(item);
  }

  /*
   * ============================
   * REMOVE
   * ============================
   */

  function removeFromCart(
    id: string
  ) {
    removeFromCartStore(id);
  }

  /*
   * ============================
   * UI
   * ============================
   */

  return (
    <div className="flex min-h-screen bg-[#656B4E]">

      <Sidebar
        mobileOpen={
          sidebarOpen
        }
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">

        {/* MOBILE MENU */}

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="mb-4 flex items-center gap-2 rounded-xl border border-[#3A2119]/10 bg-[#F7F3EC] px-4 py-2 text-sm font-medium text-[#3A2119] md:hidden"
        >
          <Menu size={18} />

          Menu
        </button>

        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_320px]">

          {/* ================================= */}
          {/* LEFT */}
          {/* ================================= */}

          <div className="space-y-6">

            {/* ERROR */}

            {error && (
              <div className="rounded-2xl border border-[#B5533C]/20 bg-[#B5533C]/5 px-5 py-3 text-sm text-[#B5533C]">
                {error}
              </div>
            )}

            {/* WORKSPACE */}

            <Workspace
              uploadedImageUrl={
                uploadedImageUrl
              }

              resultImageUrl={
                resultImageUrl
              }

              selectedStyle={
                selectedStyle
              }

              onSelectStyle={
                setSelectedStyle
              }

              roomType={
                roomType
              }

              onSelectRoom={
                setRoomType
              }

              selectedColor={
                selectedColor
              }

              onSelectColor={
                setSelectedColor
              }

              onUpload={
                handleUpload
              }

              onGenerate={
                handleGenerate
              }

              generating={
                generating ||
                uploading
              }
            />

            {/* ================================= */}
            {/* EXACT AI SELECTED PRODUCTS */}
            {/* ================================= */}

            {(matches.length > 0 ||
              matchesLoading) && (
              <section className="rounded-3xl border border-[#3A2119]/8 bg-[#F7F3EC] p-6 shadow-sm md:p-8">

                <div className="flex flex-wrap items-end justify-between gap-3">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3A2119]">
                      AI selected products
                    </p>

                    <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl text-[#3A2119]">
                      Shop the exact look
                    </h2>

                    <p className="mt-1 text-sm text-[#957662]">
                      These are the exact real
                      Supabase products used as
                      furniture references for
                      your generated room.
                    </p>

                  </div>

                  {matches.length > 0 && (
                    <span className="rounded-full bg-[#656B4E] px-3 py-1.5 text-xs font-medium text-[#3A2119]">
                      {matches.length} products
                    </span>
                  )}

                </div>

                <div className="mt-6">

                  <FurnitureGrid
                    items={
                      matches
                    }

                    loading={
                      matchesLoading
                    }

                    onAdd={
                      addToCart
                    }
                  />

                </div>

              </section>
            )}

          </div>

          {/* ================================= */}
          {/* RIGHT */}
          {/* ================================= */}

          <div className="space-y-6">

            <BudgetPanel
              estimatedItemCount={
                matches.length ||
                undefined
              }

              onGenerate={({
                budget:
                  selectedBudget,
              }) => {
                setBudget(
                  selectedBudget
                );
              }}
            />

            {/* ================================= */}
            {/* SHOPPING LIST */}
            {/* ================================= */}

            <ShoppingList
              items={cart}

              budget={
                budget
              }

              onRemove={
                removeFromCart
              }

              onBuyEverything={() =>
                router.push(
                  "/checkout"
                )
              }
            />

          </div>

        </div>

      </main>

    </div>
  );
}