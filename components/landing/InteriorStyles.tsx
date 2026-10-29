import Link from "next/link";
import { Home, Trees, Building2, Crown, ArrowUpRight } from "lucide-react";

const styles = [
  {
    title: "Modern",
    description: "Clean lines, bold shapes, and timeless simplicity.",
    icon: Home,
    bg: "bg-[#E8DCCB]",
    text: "text-[#29291F]",
    sub: "text-[#656B4E]",
  },
  {
    title: "Scandinavian",
    description: "Natural textures, soft tones, and everyday comfort.",
    icon: Trees,
    bg: "bg-[#EAE9DF]",
    text: "text-[#29291F]",
    sub: "text-[#656B4E]",
  },
  {
    title: "Minimal",
    description: "Less clutter, more space, and a calmer atmosphere.",
    icon: Building2,
    bg: "bg-[#E3E0D6]",
    text: "text-[#29291F]",
    sub: "text-[#656B4E]",
  },
  {
    title: "Luxury",
    description: "Refined details, rich materials, and elevated living.",
    icon: Crown,
    bg: "bg-[#D8C7B2]",
    text: "text-[#29291F]",
    sub: "text-[#514638]",
  },
];

export default function InteriorStyles() {
  return (
    <section className="bg-[#F7F3EC] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#656B4E] md:text-sm">
            Find your aesthetic
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl leading-tight tracking-tight text-[#29291F] md:text-5xl lg:text-6xl">
            A style that feels
            <br className="hidden sm:block" /> like you.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#777467] md:text-lg">
            Discover your look and reimagine your space with AI-powered
            interior design.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {styles.map((style, index) => {
            const Icon = style.icon;

            return (
              <Link
                key={style.title}
                href={`/ai?style=${encodeURIComponent(style.title)}`}
                className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl md:min-h-[290px] md:p-8 ${style.bg}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/50">
                    <Icon className={`h-6 w-6 ${style.text}`} strokeWidth={1.5} />
                  </div>

                  <ArrowUpRight
                    className={`h-5 w-5 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${style.sub}`}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="mt-auto pt-10">
                  <span className={`text-xs font-medium tracking-widest ${style.sub}`}>
                    STYLE 0{index + 1}
                  </span>

                  <h3
                    className={`mt-2 font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl ${style.text}`}
                  >
                    {style.title}
                  </h3>

                  <p className={`mt-3 text-sm leading-6 ${style.sub}`}>
                    {style.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 rounded-full bg-[#656B4E] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#50563D]"
          >
            Create your design
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}