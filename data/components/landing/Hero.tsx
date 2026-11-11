import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[720px] w-full overflow-hidden bg-[#F7F3EC] md:min-h-[780px]">
      {/* Background image */}
      <img
        src="/images/hero.png"
        alt="Warm contemporary living space designed with LOMAR"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Warm overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(35,32,25,0.68) 0%, rgba(35,32,25,0.38) 42%, rgba(35,32,25,0.04) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[720px] max-w-[1440px] items-end px-6 pb-20 pt-32 sm:px-10 md:min-h-[780px] md:px-16 md:pb-28">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
            <Sparkles size={15} />
            <span>AI-powered interior design</span>
          </div>

          <h1 className="max-w-3xl text-5xl font-normal leading-[1.08] tracking-[-0.04em] text-white sm:text-6xl md:text-8xl">
            Make room for
            <br />
            <span className="font-serif italic text-[#E8DCCB]">
              better living.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
            Discover your style, reimagine your space with AI, and find
            furniture that makes your house feel like home.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/ai"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#656B4E] px-7 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#51573D]"
            >
              Design your space
              <ArrowUpRight size={17} />
            </Link>

            <Link
              href="/catalog"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/60 bg-white/5 px-7 py-4 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-[#29291F]"
            >
              Explore furniture
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-3 text-sm text-white/75">
            <span className="h-px w-10 bg-[#E8DCCB]" />
            <span>Thoughtful spaces. Timeless living.</span>
          </div>
        </div>
      </div>
    </section>
  );
}