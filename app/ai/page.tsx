"use client";

import { useState } from "react";
import Sidebar from "@/components/ai/Sidebar";
import Workspace from "@/components/ai/Workspace";
import BudgetPanel from "@/components/ai/BudgetPanel";
import ShoppingList from "@/components/ai/ShoppingList";
import FurnitureGrid from "@/components/furniture/FurnitureGrid";
import { getMatchedFurniture } from "@/services/furniture.service";
import { useCartStore } from "@/store/cartStore";
import type { Furniture } from "@/components/furniture/types";
import { useRouter } from "next/navigation";

// Map the Workspace's display style names to the lowercase tags
// stored in Supabase's furniture.style column (see schema.sql).
const STYLE_MAP: Record<string, string> = {
  Modern: "modern",
  Minimal: "minimalist",
  Luxury: "luxury",
  Scandinavian: "scandinavian",
};

export default function AiStudioPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>();
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>();
  const [resultImageUrl, setResultImageUrl] = useState<string>();
  const [selectedStyle, setSelectedStyle] = useState("Scandinavian");
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();

  const [budget, setBudget] = useState(3500);
  const [matches, setMatches] = useState<Furniture[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const cart = useCartStore((s) => s.items);
  const addToCartStore = useCartStore((s) => s.add);
  const removeFromCartStore = useCartStore((s) => s.remove);
  const router = useRouter();

  async function handleUpload(file: File) {
    setUploadedFile(file);
    setUploadedImageUrl(URL.createObjectURL(file)); // instant local preview
    setResultImageUrl(undefined);
    setError(undefined);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setCloudinaryUrl(url); // real hosted URL, needed for Replicate
    } catch (err) {
      console.error(err);
      setError("Rasmni yuklashda xatolik. Qaytadan urinib ko'ring.");
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerate() {
    if (!cloudinaryUrl) return;
    setGenerating(true);
    setMatchesLoading(true);
    setError(undefined);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: cloudinaryUrl,
          style: STYLE_MAP[selectedStyle],
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const { imageUrl } = await res.json();
      setResultImageUrl(imageUrl);

      const results = await getMatchedFurniture({
        style: STYLE_MAP[selectedStyle],
        maxBudget: budget,
        limit: 12,
      });
      setMatches(results);
    } catch (err) {
      console.error(err);
      setError("AI dizayn yaratishda xatolik. Qaytadan urinib ko'ring.");
    } finally {
      setGenerating(false);
      setMatchesLoading(false);
    }
  }

  function addToCart(item: Furniture) {
    addToCartStore(item);
  }

  function removeFromCart(id: string) {
    removeFromCartStore(id);
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-[#B5533C]/20 bg-[#B5533C]/5 px-5 py-3 text-sm text-[#B5533C]">
                {error}
              </div>
            )}

            <Workspace
              uploadedImageUrl={uploadedImageUrl}
              resultImageUrl={resultImageUrl}
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
              onUpload={handleUpload}
              onGenerate={handleGenerate}
              generating={generating || uploading}
            />

            {(matches.length > 0 || matchesLoading) && (
              <section className="rounded-3xl border border-[#33475A]/8 bg-white p-8">
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl text-[#33475A]">
                  Matched furniture
                </h2>
                <p className="mt-1 text-sm text-[#8598A8]">
                  Tap a piece to add it to your shopping list.
                </p>

                <div className="mt-6">
                  <FurnitureGrid
                    items={matches}
                    loading={matchesLoading}
                    onAdd={addToCart}
                  />
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <BudgetPanel
              estimatedItemCount={matches.length || undefined}
              onGenerate={({ budget: b }) => setBudget(b)}
            />

            <ShoppingList
              items={cart}
              budget={budget}
              onRemove={removeFromCart}
              onBuyEverything={() => router.push("/checkout")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
