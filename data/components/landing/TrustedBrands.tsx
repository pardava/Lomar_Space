const stores = ["IKEA", "OTTO", "JYSK", "Desenio", "Home Centre", "Artel"];

export default function TrustedBrands() {
  return (
    <section className="border-y border-[#29291F]/10 bg-[#F7F3EC] py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <p className="mb-9 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[#827B6D] md:text-xs">
          Furniture inspiration from stores you know
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-7 sm:gap-x-12 lg:justify-between lg:gap-x-8">
          {stores.map((store) => (
            <span
              key={store}
              className="font-[family-name:var(--font-fraunces)] text-lg font-medium tracking-tight text-[#29291F]/45 transition-colors duration-300 hover:text-[#656B4E] sm:text-xl md:text-2xl"
            >
              {store}
            </span>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-[#827B6D]">
          Discover furniture inspiration and create a space that feels like you.
          Store availability and product links may vary.
        </p>
      </div>
    </section>
  );
}