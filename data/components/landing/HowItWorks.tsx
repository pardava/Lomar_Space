import Link from "next/link";
import {
  ArrowUpRight,
  Upload,
  Palette,
  Sofa,
} from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Upload,
    label: "START WITH YOUR SPACE",
    title: "Upload your room",
    text: "Start with a photo of your room. No complicated measurements or floor plans needed.",
  },
  {
    n: "02",
    icon: Palette,
    label: "MAKE IT YOURS",
    title: "Choose your style",
    text: "Explore interior styles, colors and furniture ideas that reflect your taste.",
  },
  {
    n: "03",
    icon: Sofa,
    label: "SEE THE POSSIBILITIES",
    title: "Reimagine your room",
    text: "Generate a new interior concept and explore furniture options for your space.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#EDE6DA] py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#656B4E]">
              How it works
            </p>

            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl font-normal leading-tight tracking-[-0.04em] text-[#29291F] sm:text-5xl md:text-6xl">
              From empty space
              <br />
              to <span className="italic text-[#656B4E]">inspired living.</span>
            </h2>
          </div>

          <p className="max-w-sm text-base leading-7 text-[#777366] md:pb-2">
            A simpler way to explore what your room could become. Your space,
            your style, your next idea.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.n}
                className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-[#29291F]/10 bg-[#F7F3EC] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#29291F]/[0.05] sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-fraunces)] text-5xl font-normal tracking-tight text-[#656B4E]/30 transition-colors group-hover:text-[#656B4E]">
                    {step.n}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DCCB] text-[#656B4E] transition-colors duration-300 group-hover:bg-[#656B4E] group-hover:text-white">
                    <Icon size={21} strokeWidth={1.6} />
                  </div>
                </div>

                <div className="mt-auto pt-14">
                  <p className="text-[9px] font-semibold tracking-[0.18em] text-[#8A8876]">
                    {step.label}
                  </p>

                  <h3 className="mt-3 font-[family-name:var(--font-fraunces)] text-2xl font-medium tracking-tight text-[#29291F] sm:text-3xl">
                    {step.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-[#777366]">
                    {step.text}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#656B4E] transition-all duration-300 group-hover:w-full" />
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-5 rounded-2xl bg-[#656B4E] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="font-[family-name:var(--font-fraunces)] text-2xl text-white sm:text-3xl">
              Your next favorite room starts here.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Bring your ideas to life with LOMAR AI Studio.
            </p>
          </div>

          <Link
            href="/ai"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-[#F7F3EC] px-6 py-3 text-sm font-medium text-[#29291F] transition hover:bg-white sm:self-auto"
          >
            Start designing
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}