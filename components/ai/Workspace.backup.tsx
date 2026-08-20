"use client";

import {
  Upload,
  WandSparkles,
  Download,
  ArrowLeftRight,
  Check,
  Sparkles,
  Sofa,
  BedDouble,
  CookingPot,
  Utensils,
  BriefcaseBusiness,
  Bath,
} from "lucide-react";
import { useRef, useState } from "react";

const STYLES = [
  {
    value: "Modern",
    description: "Clean & contemporary",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
  },
  {
    value: "Minimal",
    description: "Calm & uncluttered",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
  },
  {
    value: "Luxury",
    description: "Rich & sophisticated",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80",
  },
  {
    value: "Scandinavian",
    description: "Warm & natural",
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=600&q=80",
  },
];

const ROOMS = [
  {
    value: "living_room",
    label: "Living Room",
    icon: Sofa,
    description: "Relax & entertain",
  },
  {
    value: "bedroom",
    label: "Bedroom",
    icon: BedDouble,
    description: "Rest & recharge",
  },
  {
    value: "kitchen",
    label: "Kitchen",
    icon: CookingPot,
    description: "Cook & gather",
  },
  {
    value: "dining_room",
    label: "Dining Room",
    icon: Utensils,
    description: "Dine & connect",
  },
  {
    value: "office",
    label: "Office",
    icon: BriefcaseBusiness,
    description: "Focus & create",
  },
  {
    value: "bathroom",
    label: "Bathroom",
    icon: Bath,
    description: "Refresh & unwind",
  },
];

const COLORS = [
  {
    value: "beige",
    label: "Bisque",
    hex: "#EBCDB7",
    secondary: "#F5E8DE",
  },
  {
    value: "chambray",
    label: "Chambray",
    hex: "#79A3C3",
    secondary: "#D2E2EC",
  },
  {
    value: "espresso",
    label: "Espresso",
    hex: "#3A2119",
    secondary: "#6A4A3D",
  },
  {
    value: "glacier",
    label: "Glacier",
    hex: "#D2E2EC",
    secondary: "#EDF4F8",
  },
  {
    value: "clay",
    label: "Clay",
    hex: "#957662",
    secondary: "#D9CBC2",
  },
  {
    value: "sage",
    label: "Sage",
    hex: "#879B92",
    secondary: "#DCE5E1",
  },
  {
    value: "greige",
    label: "Greige",
    hex: "#C9C1B8",
    secondary: "#EEEAE5",
  },
  {
    value: "terracotta",
    label: "Terracotta",
    hex: "#C96535",
    secondary: "#EBC0AD",
  },
];

interface WorkspaceProps {
  uploadedImageUrl?: string;
  resultImageUrl?: string;

  selectedStyle: string;
  onSelectStyle: (style: string) => void;

  roomType: string;
  onSelectRoom: (room: string) => void;

  selectedColor: string;
  onSelectColor: (color: string) => void;

  onUpload: (file: File) => void;
  onGenerate: () => void;

  generating?: boolean;
}

export default function Workspace({
  uploadedImageUrl,
  resultImageUrl,
  selectedStyle,
  onSelectStyle,
  roomType,
  onSelectRoom,
  selectedColor,
  onSelectColor,
  onUpload,
  onGenerate,
  generating = false,
}: WorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedImageError, setUploadedImageError] = useState(false);
  const [resultImageError, setResultImageError] = useState(false);

  const hasUploadedImage =
    typeof uploadedImageUrl === "string" &&
    uploadedImageUrl.trim().length > 0 &&
    !uploadedImageError;

  const hasResultImage =
    typeof resultImageUrl === "string" &&
    resultImageUrl.trim().length > 0 &&
    !resultImageError;

  function handleDownload() {
    if (!resultImageUrl) return;

    const link = document.createElement("a");
    link.href = resultImageUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#3A2119]/10 bg-[#F7F3EE] p-5 shadow-[0_20px_70px_rgba(58,33,25,0.08)] md:p-8">
      {/* Decorative organic shapes */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#79A3C3]/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#EBCDB7]/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[32%] top-[28%] h-20 w-20 rounded-full border-[18px] border-[#D2E2EC]/50" />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#79A3C3]/30 bg-[#D2E2EC]/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#3A2119]">
              <Sparkles size={13} />
              AI Interior Studio
            </div>

            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl leading-tight text-[#3A2119] md:text-5xl">
              Design a space
              <br />
              <span className="text-[#957662]">that feels like home.</span>
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#957662]">
              Upload your room, choose a style and palette, and let Lomar AI
              create a beautiful, shoppable interior.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#3A2119]/15 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#3A2119] transition hover:bg-[#EBCDB7]"
            >
              <ArrowLeftRight size={15} />
              Compare
            </button>

            <button
              type="button"
              disabled={!hasResultImage}
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-full bg-[#3A2119] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5A3629] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        {/* BEFORE / AFTER */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* BEFORE */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group overflow-hidden rounded-[28px] border border-[#3A2119]/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[4/3]">
              {hasUploadedImage ? (
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded room"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={() => setUploadedImageError(true)}
                />
              ) : (
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#D2E2EC] px-6">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#79A3C3]/30" />
                  <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/40" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-white shadow-sm">
                    <Upload size={28} className="text-[#3A2119]" />
                  </div>

                  <h3 className="relative mt-5 text-base font-semibold text-[#3A2119]">
                    Upload your room
                  </h3>

                  <p className="relative mt-1 text-sm text-[#957662]">
                    Click or drag a photo here
                  </p>

                  <span className="relative mt-4 rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#957662]">
                    JPG · PNG · WEBP
                  </span>
                </div>
              )}

              {hasUploadedImage && (
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3A2119] shadow-sm backdrop-blur">
                  Before
                </span>
              )}
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) return;

              setUploadedImageError(false);
              setResultImageError(false);

              onUpload(file);

              event.target.value = "";
            }}
          />

          {/* AFTER */}
          <div className="overflow-hidden rounded-[28px] bg-[#3A2119] shadow-sm">
            <div className="relative aspect-[4/3]">
              {hasResultImage ? (
                <>
                  <img
                    src={resultImageUrl}
                    alt="AI generated room design"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => {
                      console.error(
                        "AI result image failed:",
                        resultImageUrl
                      );
                      setResultImageError(true);
                    }}
                  />

                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3A2119] shadow-sm backdrop-blur">
                    <Sparkles size={12} />
                    AI generated
                  </span>
                </>
              ) : (
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
                  <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border-[28px] border-[#79A3C3]/20" />
                  <div className="absolute -bottom-24 -left-12 h-52 w-52 rounded-full bg-[#EBCDB7]/10" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10">
                    <WandSparkles size={30} className="text-[#EBCDB7]" />
                  </div>

                  <p className="relative mt-5 text-sm font-medium text-white">
                    {generating
                      ? "Creating your dream space..."
                      : "Your AI design will appear here"}
                  </p>

                  <p className="relative mt-1 text-xs text-white/45">
                    Lomar AI will transform your room
                  </p>

                  {generating && (
                    <div className="relative mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-[#79A3C3]" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROOM TYPE */}
        <div className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79A3C3]">
                Step 01
              </p>

              <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl text-[#3A2119]">
                What are we designing?
              </h3>

              <p className="mt-1 text-xs text-[#957662]">
                Select the room type for better AI matching.
              </p>
            </div>

            <span className="hidden rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-[#957662] shadow-sm md:block">
              {ROOMS.find((room) => room.value === roomType)?.label ??
                "Choose a room"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {ROOMS.map((room) => {
              const active = roomType === room.value;
              const Icon = room.icon;

              return (
                <button
                  type="button"
                  key={room.value}
                  onClick={() => onSelectRoom(room.value)}
                  className={`group relative overflow-hidden rounded-[22px] border p-4 text-left transition duration-300 ${
                    active
                      ? "border-[#79A3C3] bg-[#D2E2EC] shadow-[0_10px_30px_rgba(121,163,195,0.18)]"
                      : "border-[#3A2119]/10 bg-white hover:-translate-y-0.5 hover:border-[#79A3C3]/50 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`absolute -right-5 -top-5 h-20 w-20 rounded-full transition ${
                      active ? "bg-[#79A3C3]/25" : "bg-[#D2E2EC]/40"
                    }`}
                  />

                  <div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${
                      active
                        ? "bg-[#3A2119] text-white"
                        : "bg-[#F4ECE6] text-[#957662]"
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  <p className="relative mt-4 text-sm font-semibold text-[#3A2119]">
                    {room.label}
                  </p>

                  <p className="relative mt-1 text-[11px] text-[#957662]">
                    {room.description}
                  </p>

                  {active && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#79A3C3] text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* DESIGN STYLE */}
        <div className="mt-10">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79A3C3]">
              Step 02
            </p>

            <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl text-[#3A2119]">
              Choose your design language
            </h3>

            <p className="mt-1 text-xs text-[#957662]">
              Pick the visual mood you want your room to have.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STYLES.map((style) => {
              const active = selectedStyle === style.value;

              return (
                <button
                  type="button"
                  key={style.value}
                  onClick={() => onSelectStyle(style.value)}
                  className={`group relative overflow-hidden rounded-[24px] border text-left transition duration-300 ${
                    active
                      ? "border-[#79A3C3] shadow-[0_12px_35px_rgba(121,163,195,0.22)]"
                      : "border-[#3A2119]/10 bg-white hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={style.image}
                      alt={style.value}
                      className={`h-full w-full object-cover transition duration-500 ${
                        active ? "scale-105" : "group-hover:scale-105"
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#3A2119]/55 via-transparent to-transparent" />

                    {active && (
                      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#79A3C3] text-white shadow-sm">
                        <Check size={15} strokeWidth={3} />
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3A2119] backdrop-blur">
                      AI Style
                    </span>
                  </div>

                  <div
                    className={`p-4 ${
                      active ? "bg-[#D2E2EC]" : "bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#3A2119]">
                      {style.value}
                    </p>

                    <p className="mt-1 text-[11px] text-[#957662]">
                      {style.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLOR PALETTE */}
        <div className="mt-10">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79A3C3]">
              Step 03
            </p>

            <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl text-[#3A2119]">
              Set the color mood
            </h3>

            <p className="mt-1 text-xs text-[#957662]">
              Choose the palette that should guide your AI-generated interior.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COLORS.map((color) => {
              const active = selectedColor === color.value;

              return (
                <button
                  type="button"
                  key={color.value}
                  onClick={() => onSelectColor(color.value)}
                  className={`group relative overflow-hidden rounded-[20px] border p-3 text-left transition duration-300 ${
                    active
                      ? "border-[#79A3C3] bg-white shadow-[0_10px_30px_rgba(121,163,195,0.18)]"
                      : "border-[#3A2119]/10 bg-white hover:-translate-y-0.5 hover:border-[#79A3C3]/40 hover:shadow-md"
                  }`}
                >
                  <div
                    className="relative h-14 overflow-hidden rounded-[14px]"
                    style={{
                      background: `linear-gradient(135deg, ${color.hex} 0%, ${color.secondary} 100%)`,
                    }}
                  >
                    <div
                      className="absolute -right-3 -top-5 h-16 w-16 rounded-full opacity-30"
                      style={{ backgroundColor: color.hex }}
                    />

                    {active && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#3A2119] shadow-sm">
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#3A2119]">
                      {color.label}
                    </span>

                    <span
                      className="h-3 w-3 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="relative mt-10 overflow-hidden rounded-[28px] bg-[#3A2119] p-5 text-white md:p-6">
          <div className="absolute -right-10 -top-16 h-36 w-36 rounded-full border-[24px] border-[#79A3C3]/20" />
          <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#EBCDB7]/10" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#79A3C3]">
                  <Sparkles size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#EBCDB7]">
                    Your design recipe
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-white">
                    {ROOMS.find((room) => room.value === roomType)?.label ??
                      "Room"}{" "}
                    · {selectedStyle || "Style"} ·{" "}
                    {COLORS.find((color) => color.value === selectedColor)
                      ?.label ?? "Palette"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onGenerate}
              disabled={!hasUploadedImage || generating}
              className="flex items-center justify-center gap-2 rounded-full bg-[#EBCDB7] px-7 py-3.5 text-sm font-bold text-[#3A2119] shadow-sm transition hover:bg-[#F3DCCD] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <WandSparkles size={18} />

              {generating ? "Creating your design..." : "Generate design"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}