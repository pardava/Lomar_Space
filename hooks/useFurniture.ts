"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface FurnitureOption {
  id: string;
  name: string;
}

export function useFurniture() {
  const [brands, setBrands] = useState<FurnitureOption[]>([]);
  const [categories, setCategories] = useState<FurnitureOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setLoading(true);

      try {
        const [brandsResult, categoriesResult] = await Promise.all([
          supabase
            .from("brands")
            .select("id, name")
            .order("name", { ascending: true }),

          supabase
            .from("categories")
            .select("id, name")
            .order("name", { ascending: true }),
        ]);

        if (brandsResult.error) {
          console.error("Failed to load brands:", brandsResult.error);
        }

        if (categoriesResult.error) {
          console.error(
            "Failed to load categories:",
            categoriesResult.error
          );
        }

        if (!cancelled) {
          setBrands(brandsResult.data ?? []);
          setCategories(categoriesResult.data ?? []);
        }
      } catch (error) {
        console.error("Failed to load furniture options:", error);

        if (!cancelled) {
          setBrands([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    brands,
    categories,
    loading,
  };
}