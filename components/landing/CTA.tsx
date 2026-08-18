import Link from "next/link";

export default function CTA() {
  return (
    <section id="cta" className="bg-[#33475A] py-28 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F2E6D6]">
          Ready when you are
        </span>

        <h2 className="mt-6 font-[family-name:var(--font-fraunces)] text-4xl leading-tight md:text-5xl">
          Design with AI.
          <br />
          Shop with confidence.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Upload your room, get an AI redesign, and buy the pieces you love —
          all in one place.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/ai"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#33475A] transition hover:bg-[#F2E6D6] hover:text-[#33475A]"
          >
            Start designing
          </Link>

          <Link
            href="/catalog"
            className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Browse catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
