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

    color: "#79A3C3",
  },

  {
    id: "kitchen",
    name: "Kitchen",
    icon: CookingPot,

    before: "/images/before-after/kitchen-before.png",
    after: "/images/before-after/kitchen-after.png",

    description:
      "A fresh kitchen transformation with thoughtful details.",

    color: "#957662",
  },

  {
    id: "royal",
    name: "Royal Living Room",
    icon: Crown,

    before:
      "/images/before-after/royal-living-room-before-no-curtains.png",

    after:
      "/images/before-after/royal-living-room-after.png",

    description:
      "A luxurious royal-inspired living room with timeless elegance.",

    color: "#C6A15B",
  },
];

const palette = [
  "#79A3C3",
  "#3A2119",
  "#D2E2EC",
  "#EBCDB7",
  "#957662",
];

export default function BeforeAfter() {
  const [activeRoom, setActiveRoom] = useState("living");

  const room =
    rooms.find((item) => item.id === activeRoom) ?? rooms[0];

  const Icon = room.icon;

  return (
    <section className="relative overflow-hidden bg-[#D2E2EC] py-24 md:py-32">
      {/* Background decoration */}

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#79A3C3]/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#EBCDB7]/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#3A2119]/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3A2119] shadow-sm backdrop-blur">

            <Sparkles className="h-3.5 w-3.5 text-[#79A3C3]" />

            AI transformation

          </div>

          <h2 className="mt-6 font-[family-name:var(--font-fraunces)] text-4xl leading-[1.05] text-[#3A2119] md:text-6xl">

            See the room

            <br />

            <span className="text-[#957662]">
              before & after.
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#5C554F] md:text-lg">
            Upload your room, choose your style and let
            LOMAR transform your space into a room you
            can actually shop.
          </p>

        </div>

        {/* Room selector */}

        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">

          {rooms.map((item) => {
            const ItemIcon = item.icon;

            const active = activeRoom === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveRoom(item.id)}
                className={`
                  flex items-center gap-2
                  rounded-full
                  px-5 py-3
                  text-sm font-semibold
                  transition-all duration-300
                  ${
                    active
                      ? "bg-[#3A2119] text-white shadow-lg -translate-y-0.5"
                      : "border border-[#3A2119]/10 bg-white/75 text-[#3A2119] hover:bg-white hover:-translate-y-0.5"
                  }
                `}
              >
                <ItemIcon
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                {item.name}
              </button>
            );
          })}

        </div>

        {/* Showcase */}

        <div className="mx-auto mt-10 max-w-6xl">

          <div className="relative">

            {/* Floating palette */}

            <div className="absolute -right-3 -top-5 z-30 hidden rounded-2xl border border-white/70 bg-white/90 p-3 shadow-xl backdrop-blur md:block">

              <div className="flex items-center gap-2">

                <div className="flex -space-x-2">

                  {palette.map((color) => (
                    <span
                      key={color}
                      className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}

                </div>

                <Palette className="ml-1 h-4 w-4 text-[#957662]" />

              </div>

            </div>

            {/* Before / After slider */}

            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/60 p-2 shadow-[0_25px_80px_rgba(58,33,25,0.16)] backdrop-blur">

              <BeforeAfterSlider
                key={room.id}
                before={room.before}
                after={room.after}
                alt={`${room.name} before and after AI interior transformation`}
              />

            </div>

          </div>

          {/* Room information */}

          <div className="mt-8 flex flex-col gap-5 rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">

            <div className="flex items-start gap-4">

              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                style={{
                  backgroundColor: room.color,
                }}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>

              <div>

                <h3 className="text-xl font-bold text-[#3A2119]">
                  {room.name}
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5C554F]">
                  {room.description}
                </p>

              </div>

            </div>

            <div className="shrink-0">

              <span className="inline-flex items-center rounded-full bg-[#3A2119] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                AI designed
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}