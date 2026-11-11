"use client";

import { useState } from "react";
import {
  Sparkles,
  Palette,
  CookingPot,
  Sofa,
  Crown,
} from "lucide-react";

import BeforeAfterSlider from "./BeforeAfterSlider";

type Room = {
  id: string;
  name: string;
  icon: React.ElementType;
  before: string;
  after: string;
  description: string;
  color: string;
};

const rooms: Room[] = [
  {
    id: "living",
    name: "Living Room",
    icon: Sofa,
    before: "/images/before-after/living-room-before.png",
    after: "/images/before-after/living-room-after.png",
    description:
      "A calm, warm living room redesigned around your lifestyle.",
    color: "#656B4E",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: CookingPot,
    before: "/images/before-after/kitchen-before.png",
    after: "/images/before-after/kitchen-after.png",
    description:
      "A fresh kitchen transformation with thoughtful details.",
    color: "#B89572",
  },
  {
    id: "royal",
    name: "Royal Living Room",
    icon: Crown,
    before: "/images/before-after/royal-living-room-before-no-curtains.png",
    after: "/images/before-after/royal-living-room-after.png",
    description:
      "A luxurious living room with refined details and timeless elegance.",
    color: "#8B7355",
  },
];

const palette = [
  "#F7F3EC",
  "#E8DCCB",
  "#B89572",
  "#656B4E",
  "#29291F",
];

export default function BeforeAfter() {
  const [activeRoom, setActiveRoom] = useState("living");

  const room =
    rooms.find((item) => item.id === activeRoom) ?? rooms[0];

  const Icon = room.icon;

  return (
    <section className="relative overflow-hidden bg-[#F7F3EC] py-20 md:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#E8DCCB]/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#B89572]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#656B4E]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#656B4E]">
            <Sparkles className="h-3.5 w-3.5" />
            AI transformation
          </div>

          <h2 className="mt-6 font-[family-name:var(--font-fraunces)] text-4xl leading-[1.08] tracking-tight text-[#29291F] md:text-6xl">
            Every room has
            <br />
            <span className="text-[#8B7355]">a new possibility.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#777467] md:text-lg">
            See how thoughtful design can transform a space. Explore
            before-and-after interiors and imagine what your room could become
            with LOMAR.
          </p>
        </div>

        {/* Room selector */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3 md:mt-12">
          {rooms.map((item) => {
            const ItemIcon = item.icon;
            const active = activeRoom === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveRoom(item.id)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "-translate-y-0.5 bg-[#656B4E] text-white shadow-lg"
                    : "border border-[#29291F]/10 bg-white/70 text-[#29291F] hover:-translate-y-0.5 hover:bg-white"
                }`}
              >
                <ItemIcon className="h-4 w-4" strokeWidth={1.8} />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Showcase */}
        <div className="mx-auto mt-10 max-w-6xl">
          <div className="relative">
            {/* Floating palette */}
            <div className="absolute -right-3 -top-5 z-30 hidden rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur md:block">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {palette.map((color) => (
                    <span
                      key={color}
                      className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <Palette className="ml-1 h-4 w-4 text-[#656B4E]" />
              </div>
            </div>

            {/* Before / After slider */}
            <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/60 p-2 shadow-[0_25px_80px_rgba(41,41,31,0.12)] backdrop-blur md:rounded-[32px]">
              <BeforeAfterSlider
                key={room.id}
                before={room.before}
                after={room.after}
                alt={`${room.name} before and after interior transformation`}
              />
            </div>
          </div>

          {/* Room information */}
          <div className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#29291F]/5 bg-white/75 p-5 shadow-sm backdrop-blur md:mt-8 md:flex-row md:items-center md:justify-between md:rounded-[28px] md:p-8">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                style={{ backgroundColor: room.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>

              <div>
                <h3 className="font-[family-name:var(--font-fraunces)] text-xl text-[#29291F] md:text-2xl">
                  {room.name}
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777467]">
                  {room.description}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAE9DF] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#656B4E]">
                <Sparkles className="h-3.5 w-3.5" />
                AI designed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}