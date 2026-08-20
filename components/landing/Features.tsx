import { Sparkles, Sofa, ShoppingBag, ScanSearch } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI room design",
    description: "Upload a photo and get a redesigned room in seconds.",
  },
  {
    icon: Sofa,
    title: "Real furniture",
    description: "Every item is sourced from stores you already trust.",
  },
  {
    icon: ShoppingBag,
    title: "One-click shopping",
    description: "Buy the exact pieces used in your design, no hunting around.",
  },
  {
    icon: ScanSearch,
    title: "Budget aware",
    description: "Set a budget once — every suggestion respects it.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#D2E2EC] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3A2119]">
            Features
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl text-[#3A2119] md:text-5xl">
            Everything in one platform
          </h2>

          <p className="mt-5 text-lg text-[#957662]">
            Design, visualize and shop furniture without leaving the page.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#3A2119]/8 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3A2119]/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3A2119]/10 text-[#3A2119]">
                  <Icon size={22} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#3A2119]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#957662]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
