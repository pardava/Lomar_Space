import { Home, Trees, Building2, Crown } from "lucide-react";

const styles = [
  {
    title: "Modern",
    icon: Home,
    bg: "bg-[#3A2119]",
    text: "text-white",
    sub: "text-white/60",
  },
  {
    title: "Scandinavian",
    icon: Trees,
    bg: "bg-[#EFEBE1]",
    text: "text-[#3A2119]",
    sub: "text-[#957662]",
  },
  {
    title: "Minimal",
    icon: Building2,
    bg: "bg-[#3A2119]/10",
    text: "text-[#3A2119]",
    sub: "text-[#957662]",
  },
  {
    title: "Luxury",
    icon: Crown,
    bg: "bg-[#F2E6D6]/15",
    text: "text-[#3A2119]",
    sub: "text-[#957662]",
  },
];

export default function InteriorStyles() {
  return (
    <section className="bg-[#D2E2EC] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3A2119]">
            Interior styles
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl text-[#3A2119] md:text-5xl">
            Choose your style
          </h2>

          <p className="mt-5 text-lg text-[#957662]">
            Every design adapts to the aesthetic you pick.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {styles.map((style) => {
            const Icon = style.icon;
            return (
              <div
                key={style.title}
                className={`rounded-2xl p-8 transition duration-300 hover:-translate-y-1 ${style.bg}`}
              >
                <Icon className={`h-8 w-8 ${style.text}`} />

                <h3
                  className={`mt-8 font-[family-name:var(--font-fraunces)] text-2xl ${style.text}`}
                >
                  {style.title}
                </h3>

                <p className={`mt-3 text-sm leading-6 ${style.sub}`}>
                  Redesign your room in this style with AI.
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
