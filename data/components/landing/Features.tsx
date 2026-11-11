import {
  Sparkles,
  Sofa,
  ShoppingBag,
  ScanSearch,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    number: "01",
    icon: Sparkles,
    title: "Your room, reimagined",
    description:
      "Upload a photo of your room and let AI explore a fresh look tailored to your taste.",
    label: "AI DESIGN",
  },
  {
    number: "02",
    icon: Sofa,
    title: "Furniture that fits",
    description:
      "Explore furniture ideas and discover pieces that complement your space and style.",
    label: "REAL PRODUCTS",
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "From vision to reality",
    description:
      "Keep track of the furniture in your design and make shopping easier.",
    label: "SHOP YOUR LOOK",
  },
  {
    number: "04",
    icon: ScanSearch,
    title: "Designed around you",
    description:
      "Choose your preferred style, colors and budget to guide your design journey.",
    label: "YOUR PREFERENCES",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#F7F3EC] py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Section heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#656B4E]">
              A more thoughtful way to design
            </span>

            <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl font-normal leading-tight tracking-[-0.04em] text-[#29291F] sm:text-5xl md:text-6xl">
              Your space.
              <br />
              <span className="italic text-[#656B4E]">
                Your kind of living.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-[#777366] md:pb-2 md:text-lg">
            Great interiors begin with understanding how you want to live.
            LOMAR brings design inspiration and furniture discovery together.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group flex min-h-[290px] flex-col rounded-2xl border border-[#29291F]/10 bg-[#FBF9F5] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#656B4E]/40 hover:shadow-xl hover:shadow-[#29291F]/[0.04] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DCCB]/65 text-[#656B4E] transition-colors duration-300 group-hover:bg-[#656B4E] group-hover:text-white">
                    <Icon size={21} strokeWidth={1.6} />
                  </div>

                  <span className="font-[family-name:var(--font-fraunces)] text-sm text-[#A59D8E]">
                    {feature.number}
                  </span>
                </div>

                <span className="mt-8 text-[9px] font-semibold tracking-[0.2em] text-[#8A8876]">
                  {feature.label}
                </span>

                <h3 className="mt-3 text-xl font-medium tracking-tight text-[#29291F]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#777366]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#E8DCCB]/55 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-[family-name:var(--font-fraunces)] text-2xl text-[#29291F]">
              Ready to rethink your room?
            </p>
            <p className="mt-2 text-sm text-[#777366]">
              Start with your space. Discover what it could become.
            </p>
          </div>

          <Link
            href="/ai"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-[#656B4E] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#51573D] sm:self-auto"
          >
            Try AI Studio
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}