export default function TrustedBrands() {
  // NOTE: Reframed from "Trusted Brands" (implies existing partnerships)
  // to a roadmap-style statement, since these integrations aren't live yet.
  // Swap this copy the moment real retailer links go live.
  const stores = ["IKEA", "Otto", "JYSK", "Desenio", "Home Centre", "Artel"];

  return (
    <section className="border-y border-[#3A2119]/8 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-[0.25em] text-[#957662]">
          Built to shop from stores like
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {stores.map((store) => (
            <span
              key={store}
              className="font-[family-name:var(--font-fraunces)] text-xl text-[#3A2119]/40 transition hover:text-[#3A2119]"
            >
              {store}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
