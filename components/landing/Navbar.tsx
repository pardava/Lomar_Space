"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Sparkles, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const links = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/catalog" },
  { name: "AI Studio", href: "/ai" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-50 border-b border-[#29291F]/10 bg-[#F7F3EC]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="LOMAR Space"
            width={38}
            height={38}
            className="h-[38px] w-[38px] object-contain"
          />

          <div className="leading-none">
            <span className="font-[family-name:var(--font-fraunces)] text-[25px] tracking-[-0.06em] text-[#29291F]">
              LOMAR
              <span className="ml-1.5 font-normal text-[#656B4E]">Space</span>
            </span>
            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.19em] text-[#827B6D]">
              Thoughtful spaces
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-2 text-[13px] transition-colors duration-200 ${
                  active
                    ? "font-semibold text-[#29291F]"
                    : "font-medium text-[#777366] hover:text-[#29291F]"
                }`}
              >
                {link.name}

                {active && (
                  <span className="absolute -bottom-[2px] left-0 h-[2px] w-full rounded-full bg-[#656B4E]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/checkout"
            className="relative rounded-full p-2.5 text-[#29291F] transition hover:bg-[#E8DCCB]/60"
            aria-label={`Shopping list${cartCount ? `, ${cartCount} items` : ""}`}
          >
            <ShoppingCart size={19} strokeWidth={1.6} />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#656B4E] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/register"
            className="rounded-full px-4 py-2.5 text-[13px] font-medium text-[#29291F] transition hover:bg-[#E8DCCB]/60"
          >
            Sign in
          </Link>

          <Link
            href="/ai"
            className="inline-flex items-center gap-2 rounded-full bg-[#656B4E] px-5 py-3 text-[13px] font-medium text-white transition duration-300 hover:bg-[#51573D]"
          >
            <Sparkles size={15} />
            Design with AI
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/checkout"
            className="relative rounded-full p-2.5 text-[#29291F]"
            aria-label="View shopping list"
          >
            <ShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#656B4E] px-1 text-[9px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="rounded-full p-2.5 text-[#29291F] transition hover:bg-[#E8DCCB]/70"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-[#29291F]/10 bg-[#F7F3EC] md:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-6 py-5 sm:px-8">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-[#29291F]/[0.06] py-4 text-[15px] ${
                    active
                      ? "font-semibold text-[#656B4E]"
                      : "font-medium text-[#29291F]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-full border border-[#29291F]/15 px-5 py-3.5 text-center text-sm font-medium text-[#29291F]"
            >
              Sign in
            </Link>

            <Link
              href="/ai"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#656B4E] px-5 py-3.5 text-sm font-medium text-white"
            >
              <Sparkles size={16} />
              Design with AI
              <ArrowUpRight size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}