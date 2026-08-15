import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Furniture } from "@/components/furniture/types";

interface CartState {
  items: Furniture[];
  add: (item: Furniture) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (item) =>
        set((state) => {
          const exists = state.items.some(
            (existing) => existing.id === item.id
          );

          if (exists) {
            return state;
          }

          return {
            items: [...state.items, item],
          };
        }),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clear: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "lomar-cart",
      skipHydration: true,
    }
  )
);