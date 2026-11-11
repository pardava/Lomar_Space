import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-[#F7F3EC] px-4 py-16 md:px-6 md:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#E8DCCB] px-6 py-20 text-center md:rounded-[36px] md:px-12 md:py-28">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#B89572]/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#656B4E]/20 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#656B4E]">
            <Sparkles className="h-3.5 w-3.5" />
            Your space, reimagined
          </div>

          <h2 className="mx-auto mt-7 font-[family-name:var(--font-fraunces)] text-4xl leading-[1.08] tracking-tight text-[#29291F] sm:text-5xl md:text-6xl lg:text-7xl">
            Your next room
            <br />
            <span className="text-[#656B4E]">
              starts with an idea.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6E6A5D] md:text-lg">
            Bring your vision to life with AI-powered interior design.
            Explore new possibilities for your space before you buy.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/ai"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#656B4E] px-7 py-4 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#50563D] hover:shadow-lg"
            >
              Open AI Studio
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/catalog"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#29291F]/15 bg-white/40 px-7 py-4 text-sm font-medium text-[#29291F] transition duration-300 hover:bg-white/70"
            >
              Explore furniture
            </Link>
          </div>

          <p className="mt-6 text-xs tracking-wide text-[#777467]">
            Thoughtful spaces. Better living.
          </p>
        </div>
      </div>
    </section>
  );
}