"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Armchair, Lamp, Palette } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F0F4F8]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[#7EA6D8]/10 blur-3xl" />
        <div className="absolute -right-32 top-40 h-[400px] w-[400px] rounded-full bg-[#F2E6D6]/10 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#7EA6D8]/20 bg-white px-4 py-1.5 text-sm font-medium text-[#7EA6D8]">
            <Palette className="h-4 w-4" />
            AI interior design, made local
          </span>

          <h1 className="mt-8 font-[family-name:var(--font-fraunces)] text-5xl font-medium leading-[1.05] tracking-tight text-[#33475A] md:text-6xl">
            See your room
            <br />
            <span className="text-[#7EA6D8]">reimagined</span> — with
            furniture you can actually buy.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#5B7186]">
            Upload a photo of your space. Lomar redesigns it with AI, matched
            to your style and budget — from Munich to Samarkand.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/upload"
              className="rounded-full bg-[#33475A] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#7EA6D8]"
            >
              Design your room →
            </Link>
            <Link
              href="/catalog"
              className="rounded-full border border-[#33475A]/15 bg-transparent px-8 py-4 text-base font-semibold text-[#33475A] transition hover:bg-white"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm rounded-3xl border border-[#33475A]/10 bg-white p-6 shadow-xl"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[#8598A8]">
            Your budget
          </p>
          <p className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl text-[#33475A]">
            €2,400
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#D6E4F3]">
            <div className="h-full w-[78%] rounded-full bg-[#7EA6D8]" />
          </div>

          <div className="mt-6 space-y-3">
            {[
              { icon: Armchair, name: "Sectional sofa", price: "€1,290" },
              { icon: Lamp, name: "Floor lamp", price: "€89" },
              { icon: Palette, name: "Wall art set", price: "€79" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-xl bg-[#F0F4F8] p-3"
              >
                <item.icon className="h-5 w-5 text-[#7EA6D8]" />
                <span className="flex-1 text-sm text-[#33475A]">
                  {item.name}
                </span>
                <span className="text-sm font-medium text-[#33475A]">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-[#8598A8]">
            Example — your picks will vary
          </p>
        </motion.div>
      </div>
    </section>
  );
}
