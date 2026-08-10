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
        set((state) =>
          state.items.some((i) => i.id === item.id)
            ? state
            : { items: [...state.items, item] }
        ),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "lomar-cart" } // localStorage key
  )
);
