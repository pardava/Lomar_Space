"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const links = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/catalog" },
  { name: "AI Studio", href: "/ai" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-50 border-b border-[#3A2119]/8 bg-[#D2E2EC]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* Export the logo mark from your brand kit as an SVG and
              place it at public/logo.svg — falls back gracefully to
              just the wordmark if the file isn't there yet. */}
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <div className="leading-none">
            <span className="font-[family-name:var(--font-fraunces)] text-2xl tracking-tight text-[#3A2119]">
              Lomar <span className="text-[#3A2119]">Space</span>
            </span>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#957662]">
              Turn inspiration into reality
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition ${
                  active
                    ? "text-[#3A2119]"
                    : "text-[#957662] hover:text-[#3A2119]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/ai"
            className="flex items-center gap-1.5 rounded-full border border-[#3A2119]/25 px-4 py-2 text-sm font-medium text-[#3A2119] transition hover:bg-[#3A2119]/5"
          >
            <Sparkles className="h-4 w-4" />
            AI Designer
          </Link>

          <Link
            href="/checkout"
            className="relative rounded-full p-2.5 text-[#3A2119] transition hover:bg-white"
            aria-label="View shopping list"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#3A2119] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-[#3A2119] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3A2119]"
          >
            Sign in
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/checkout" className="relative p-2 text-[#3A2119]">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#3A2119] text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="text-[#3A2119]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#3A2119]/8 bg-[#D2E2EC] md:hidden">
          <nav className="flex flex-col p-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-3 text-[#3A2119]"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/register"
              className="mt-3 rounded-full bg-[#3A2119] px-5 py-3 text-center font-semibold text-white"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
