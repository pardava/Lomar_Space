import Link from "next/link";
import { ArrowRight, Sparkles, Palette } from "lucide-react";

const beforeImage =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85";

const afterImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85";

const palette = [
  { name: "Chambray", hex: "#79A3C3" },
  { name: "Espresso", hex: "#3A2119" },
  { name: "Glacier", hex: "#D2E2EC" },
  { name: "Bisque", hex: "#EBCDB7" },
  { name: "Clay", hex: "#957662" },
];

export default function BeforeAfter() {
  return (
    <section className="relative overflow-hidden bg-[#D2E2EC] py-24 md:py-32">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#79A3C3]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#EBCDB7]/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3A2119]/10 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3A2119] shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#79A3C3]" />
            AI transformation
          </div>

          <h2 className="mt-6 font-[family-name:var(--font-fraunces)] text-4xl leading-[1.05] text-[#3A2119] md:text-6xl">
            See the room
            <br />
            <span className="text-[#957662]">before & after.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#5C554F] md:text-lg">
            Lomar turns your existing space into a room that feels considered,
            personal and ready to shop.
          </p>
        </div>

        {/* Showcase */}
        <div className="relative mx-auto mt-16 max-w-6xl">
          {/* Decorative floating palette */}
          <div className="absolute -right-4 -top-8 z-20 hidden rounded-2xl border border-white/70 bg-white/90 p-3 shadow-xl backdrop-blur md:block">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {palette.map((color) => (
                  <div
                    key={color.hex}
                    title={`${color.name} — ${color.hex}`}
                    className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              <Palette className="ml-1 h-4 w-4 text-[#957662]" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* BEFORE */}
            <article className="group overflow-hidden rounded-[30px] border border-[#3A2119]/10 bg-[#F7F3EE] shadow-[0_20px_60px_rgba(58,33,25,0.10)]">
              <div className="relative h-[380px] overflow-hidden md:h-[460px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url("${beforeImage}")` }}
                />

                {/* subtle image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A2119]/35 via-transparent to-transparent" />

                {/* Before badge */}
                <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A2119] shadow-lg backdrop-blur">
                  Before
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                      Starting point
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl text-white">
                      Your original room
                    </p>
                  </div>

                  <div className="hidden rounded-full bg-[#3A2119]/80 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur sm:block">
                    Original photo
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#957662]">
                    Your space
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl text-[#3A2119]">
                    Where you start
                  </h3>
                </div>

                <div className="h-11 w-11 rounded-full bg-[#EBCDB7]" />
              </div>
            </article>

            {/* AFTER */}
            <article className="group overflow-hidden rounded-[30px] border border-white/60 bg-[#3A2119] shadow-[0_25px_70px_rgba(58,33,25,0.20)]">
              <div className="relative h-[380px] overflow-hidden md:h-[460px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url("${afterImage}")` }}
                />

                {/* premium dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A2119]/60 via-transparent to-transparent" />

                {/* AI badge */}
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#3A2119]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-[#79A3C3]" />
                  After — AI generated
                </div>

                {/* Floating color chips */}
                <div className="absolute right-5 top-5 hidden rounded-2xl bg-white/90 p-2 shadow-xl backdrop-blur sm:block">
                  <div className="flex gap-1.5">
                    {palette.slice(0, 4).map((color) => (
                      <div
                        key={color.hex}
                        className="h-6 w-6 rounded-full border border-white"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D2E2EC]">
                    Lomar AI transformation
                  </p>

                  <div className="mt-1 flex items-end justify-between gap-4">
                    <p className="font-[family-name:var(--font-fraunces)] text-2xl text-white">
                      Your space, reimagined.
                    </p>

                    <div className="hidden rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#3A2119] sm:block">
                      Ready to shop
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#79A3C3]">
                    AI Studio
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl text-white">
                    Designed around you
                  </h3>
                </div>

                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-[#3A2119] bg-[#79A3C3]" />
                  <div className="h-8 w-8 rounded-full border-2 border-[#3A2119] bg-[#EBCDB7]" />
                  <div className="h-8 w-8 rounded-full border-2 border-[#3A2119] bg-[#957662]" />
                </div>
              </div>
            </article>
          </div>

          {/* Palette label */}
          <div className="mx-auto mt-8 flex max-w-fit items-center gap-3 rounded-full border border-[#3A2119]/10 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur">
            <div className="flex -space-x-1.5">
              {palette.map((color) => (
                <span
                  key={color.hex}
                  className="h-5 w-5 rounded-full border-2 border-white"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>

            <span className="text-xs font-medium text-[#5C554F]">
              AI-selected color palette
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center text-center">
          <p className="mb-4 text-sm text-[#957662]">
            Your room could look like this.
          </p>

          <Link
            href="/ai"
            className="group flex items-center gap-3 rounded-full bg-[#3A2119] px-7 py-4 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(58,33,25,0.20)] transition duration-300 hover:-translate-y-1 hover:bg-[#513025]"
          >
            Design your room
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}