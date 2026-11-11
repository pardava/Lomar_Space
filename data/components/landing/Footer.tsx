import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#29291F] text-[#F7F3EC]">
      <div className="mx-auto max-w-7xl px-6 pt-16 md:px-10 md:pt-20">
        {/* Main footer */}
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#656B4E]">
                <Sparkles className="h-5 w-5 text-white" />
              </span>

              <span className="font-[family-name:var(--font-fraunces)] text-2xl tracking-tight">
                LOMAR <span className="text-[#B89572]">Space</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#F7F3EC]/60 md:text-base">
              Thoughtful interiors, powered by AI. Discover new possibilities
              for your space and explore furniture to bring your vision to life.
            </p>

            <Link
              href="/ai"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#D6C6AE] transition hover:text-white"
            >
              Create your design
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Explore */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B89572]">
              Explore
            </h3>

            <Link
              href="/"
              className="text-sm text-[#F7F3EC]/70 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/ai"
              className="text-sm text-[#F7F3EC]/70 transition hover:text-white"
            >
              AI Studio
            </Link>

            <Link
              href="/catalog"
              className="text-sm text-[#F7F3EC]/70 transition hover:text-white"
            >
              Furniture Catalog
            </Link>
          </div>

          {/* Company */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B89572]">
              Discover
            </h3>

            <Link
              href="/#features"
              className="text-sm text-[#F7F3EC]/70 transition hover:text-white"
            >
              Features
            </Link>

            <Link
              href="/#how-it-works"
              className="text-sm text-[#F7F3EC]/70 transition hover:text-white"
            >
              How it works
            </Link>

            <Link
              href="/#interior-styles"
              className="text-sm text-[#F7F3EC]/70 transition hover:text-white"
            >
              Interior styles
            </Link>
          </div>
        </div>

        {/* Large brand wordmark */}
        <div className="overflow-hidden pt-10 md:pt-14">
          <p
            aria-hidden="true"
            className="select-none text-center font-[family-name:var(--font-fraunces)] text-[23vw] leading-[0.78] tracking-[-0.07em] text-[#F7F3EC]/[0.07] sm:text-[21vw] lg:text-[18vw]"
          >
            LOMAR
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 py-6 text-xs text-[#F7F3EC]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} LOMAR Space. All rights reserved.
          </p>

          <p className="tracking-wide">
            Thoughtful spaces. Better living.
          </p>
        </div>
      </div>
    </footer>
  );
}