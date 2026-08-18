import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Sparkles } from "lucide-react";

export default function BeforeAfter() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7EA6D8]">
            AI transformation
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl text-[#33475A] md:text-5xl">
            Before &amp; after
          </h2>

          <p className="mt-5 text-lg text-[#5B7186]">
            Upload a room photo and let AI redesign it end to end.
          </p>
        </div>

        {/* Swap the two placeholder panels below for real <Image> pairs
            once you have generated results to show. */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-[#33475A]/8 bg-[#F0F4F8]">
            <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-[#8598A8]">
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm font-medium uppercase tracking-wide">
                Before
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#7EA6D8]/20 bg-[#7EA6D8]/5">
            <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-[#7EA6D8]">
              <Sparkles className="h-8 w-8" />
              <span className="text-sm font-medium uppercase tracking-wide">
                After — AI generated
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/ai"
            className="flex items-center gap-2 rounded-full bg-[#33475A] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7EA6D8]"
          >
            Try it on your room
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
