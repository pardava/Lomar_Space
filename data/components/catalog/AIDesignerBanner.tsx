import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function AIDesignerBanner() {
  return (
    <section className="mt-16 overflow-hidden rounded-3xl bg-[#3A2119]">
      <div className="grid items-center gap-8 p-10 md:grid-cols-2 md:p-14">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F2E6D6]">
            Not sure where to start?
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl text-white md:text-4xl">
            Let AI design your room first
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Upload a photo of your space and get a full redesign — matched
            furniture from this catalog, picked for your style and budget.
          </p>
          <Link
            href="/ai"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#3A2119] transition hover:bg-[#F2E6D6] hover:text-[#3A2119]"
          >
            Try AI Designer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Swap for a real before/after generated pair once you have one
            worth showcasing — same placeholder approach as BeforeAfter.tsx
            on the landing page. */}
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/5">
          <div className="flex h-full items-center justify-center text-sm text-white/30">
            Before / after preview
          </div>
        </div>
      </div>
    </section>
  );
}
