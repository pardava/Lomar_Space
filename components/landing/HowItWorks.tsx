import { Upload, Sparkles, Sofa, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload your room",
    description: "Take a photo of your room, exactly as it looks today.",
  },
  {
    icon: Sparkles,
    title: "Generate with AI",
    description: "Lomar redesigns it in the style and budget you set.",
  },
  {
    icon: Sofa,
    title: "Review the picks",
    description: "See the real furniture behind every piece in the design.",
  },
  {
    icon: ShoppingCart,
    title: "Buy what you like",
    description: "Purchase individually, or the whole look at once.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7EA6D8]">
            How it works
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl text-[#33475A] md:text-5xl">
            From empty room to dream interior
          </h2>

          <p className="mt-5 text-lg text-[#5B7186]">
            Four steps, start to finish.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-[#33475A]/8 bg-[#F0F4F8] p-7"
              >
                <span className="font-[family-name:var(--font-fraunces)] text-sm text-[#F2E6D6]">
                  0{index + 1}
                </span>

                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#33475A] text-white">
                  <Icon size={20} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#33475A]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#5B7186]">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-full bg-[#33475A]/10 lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
