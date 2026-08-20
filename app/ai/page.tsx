"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/ai/Sidebar";
import Workspace from "@/components/ai/Workspace";
import BudgetPanel from "@/components/ai/BudgetPanel";
import ShoppingList from "@/components/ai/ShoppingList";
import FurnitureGrid from "@/components/furniture/FurnitureGrid";

import { getMatchedFurniture } from "@/services/furniture.service";
import { useCartStore } from "@/store/cartStore";

import type { Furniture } from "@/components/furniture/types";

const STYLE_MAP: Record<string, string> = {
  Modern: "modern",
  Minimal: "minimalist",
  Luxury: "luxury",
  Scandinavian: "scandinavian",
};

export default function AiStudioPage() {
  const router = useRouter();

  /*
   * UPLOAD / AI
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
   * DESIGN SETTINGS
   */
  const [selectedStyle, setSelectedStyle] =
    useState("Scandinavian");

  const [roomType, setRoomType] =
    useState("living_room");

  const [selectedColor, setSelectedColor] =
    useState("beige");

  /*
   * LOADING / ERROR
   */
  const [generating, setGenerating] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string>();

  /*
   * BUDGET
   */
  const [budget, setBudget] =
    useState(3500);

  /*
   * MATCHED FURNITURE
   */
  const [matches, setMatches] =
    useState<Furniture[]>([]);

  const [matchesLoading, setMatchesLoading] =
    useState(false);

  /*
   * CART
   */
  const cart = useCartStore((state) => state.items);

  const addToCartStore = useCartStore(
    (state) => state.add
  );

  const removeFromCartStore = useCartStore(
    (state) => state.remove
  );

  /*
   * HYDRATION
   *
   * Important because cart uses localStorage.
   */
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  /*
   * UPLOAD
   */
  async function handleUpload(file: File) {
    setUploadedFile(file);

    setUploadedImageUrl(
      URL.createObjectURL(file)
    );

    setResultImageUrl(undefined);
    setCloudinaryUrl(undefined);
    setMatches([]);
    setError(undefined);

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          text || "Upload failed"
        );
      }

      const data = JSON.parse(text);

      if (!data.url) {
        throw new Error(
          "Upload response does not contain image URL."
        );
      }

      setCloudinaryUrl(data.url);
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      setError(
        "Rasmni yuklashda xatolik. Qaytadan urinib ko‘ring."
      );
    } finally {
      setUploading(false);
    }
  }

  /*
   * GENERATE DESIGN
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

    try {
      /*
       * 1. GENERATE AI ROOM
       */
      const response = await fetch(
        "/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            imageUrl: cloudinaryUrl,
            style:
              STYLE_MAP[selectedStyle],
            roomType,
            color: selectedColor,
          }),
        }
      );

      const text =
        await response.text();

      if (!response.ok) {
        throw new Error(
          text || "AI generation failed"
        );
      }

      const data = JSON.parse(text);

      if (!data.imageUrl) {
        throw new Error(
          "AI did not return an image."
        );
      }

      setResultImageUrl(
        data.imageUrl
      );

      /*
       * 2. FIND REAL FURNITURE
       * FROM SUPABASE
       */
      const furniture =
        await getMatchedFurniture({
          style:
            STYLE_MAP[selectedStyle],

          roomType,

          color: selectedColor,

          maxBudget: budget,

          limit: 12,
        });

      setMatches(furniture);

      /*
       * 3. AUTOMATICALLY ADD
       * FURNITURE TO SHOPPING LIST
       */
      furniture.forEach((item) => {
        addToCartStore(item);
      });

      /*
       * 4. IF NOTHING FOUND
       */
      if (furniture.length === 0) {
        setError(
          "AI dizayn yaratildi, lekin tanlangan xona, style va rang bo‘yicha mebel topilmadi."
        );
      }
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
   * ADD MANUALLY
   */
  function addToCart(item: Furniture) {
    addToCartStore(item);
  }

  /*
   * REMOVE
   */
  function removeFromCart(id: string) {
    removeFromCartStore(id);
  }

  return (
    <div className="flex min-h-screen bg-[#D2E2EC]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_320px]">
          {/* LEFT */}
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
              roomType={roomType}
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

            {/* MATCHED FURNITURE */}
            {(matches.length > 0 ||
              matchesLoading) && (
              <section className="rounded-3xl border border-[#3A2119]/8 bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3A2119]">
                      AI matched products
                    </p>

                    <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl text-[#3A2119]">
                      Shop the look
                    </h2>

                    <p className="mt-1 text-sm text-[#957662]">
                      Real furniture from your
                      Supabase catalog.
                    </p>
                  </div>

                  {matches.length > 0 && (
                    <span className="rounded-full bg-[#D2E2EC] px-3 py-1.5 text-xs font-medium text-[#3A2119]">
                      {matches.length} products
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <FurnitureGrid
                    items={matches}
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

          {/* RIGHT */}
          <div className="space-y-6">
            <BudgetPanel
              estimatedItemCount={
                matches.length ||
                undefined
              }
              onGenerate={({
                budget: selectedBudget,
              }) => {
                setBudget(
                  selectedBudget
                );
              }}
            />

            <ShoppingList
              items={cart}
              budget={budget}
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