"use client";

import {
  Upload,
  WandSparkles,
  Download,
  ArrowLeftRight,
  Sofa,
  Palette,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";

const STYLES = [
  "Modern",
  "Minimal",
  "Luxury",
  "Scandinavian",
];

const ROOMS = [
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "dining_room", label: "Dining Room" },
  { value: "office", label: "Office" },
  { value: "bathroom", label: "Bathroom" },
];

const COLORS = [
  "beige",
  "white",
  "green",
  "brown",
  "black",
  "terracotta",
  "emerald",
  "natural",
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
    <section className="relative overflow-hidden rounded-[32px] border border-[#3A2119]/10 bg-[#F7F3EE] p-5 shadow-sm md:p-7">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#79A3C3]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#EBCDB7]/25 blur-3xl" />

      <div className="relative">
        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3A2119]/10 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A2119]">
              <Sparkles size={12} className="text-[#79A3C3]" />
              Furniture AI
            </div>

            <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl text-[#3A2119]">
              Redesign your furniture
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#957662]">
              Keep your room exactly as it is. Lomar AI changes the furniture,
              style and colors — not the architecture.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#3A2119]/12 bg-white px-4 py-2 text-sm font-medium text-[#3A2119] transition hover:bg-[#D2E2EC]"
            >
              <ArrowLeftRight size={15} />
              Compare
            </button>

            <button
              type="button"
              disabled={!hasResultImage}
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-full bg-[#3A2119] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#513025] disabled:cursor-not-allowed disabled:opacity-40"
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
            className="group overflow-hidden rounded-[26px] border border-[#3A2119]/10 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-[#D2E2EC]">
              {hasUploadedImage ? (
                <>
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded room"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                    onError={() => setUploadedImageError(true)}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#3A2119]/40 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3A2119] shadow-sm">
                    Before
                  </span>

                  <span className="absolute bottom-4 left-4 rounded-full bg-[#3A2119]/80 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur">
                    Original room
                  </span>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Upload size={28} className="text-[#957662]" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-[#3A2119]">
                    Upload your room
                  </h3>

                  <p className="mt-2 text-sm text-[#957662]">
                    Click or drag a room photo here
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#957662]">
                  Starting point
                </p>

                <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl text-[#3A2119]">
                  Your existing room
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EBCDB7]">
                <Sofa size={18} className="text-[#3A2119]" />
              </div>
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
          <div className="overflow-hidden rounded-[26px] bg-[#3A2119] shadow-lg">
            <div className="relative aspect-square overflow-hidden">
              {hasResultImage ? (
                <>
                  <img
                    src={resultImageUrl}
                    alt="AI furniture redesign"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => {
                      console.error(
                        "AI result image failed:",
                        resultImageUrl
                      );

                      setResultImageError(true);
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#3A2119]/50 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#3A2119]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                    <Sparkles size={12} className="text-[#79A3C3]" />
                    Furniture AI
                  </span>

                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-[#3A2119]">
                    Same room · new furniture
                  </span>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                    <WandSparkles size={30} className="text-[#D2E2EC]" />
                  </div>

                  <p className="mt-5 text-sm font-medium text-white/80">
                    {generating
                      ? "Redesigning your furniture..."
                      : "Your furniture redesign will appear here"}
                  </p>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-white/45">
                    Walls, windows, doors and room structure stay unchanged.
                  </p>

                  {generating && (
                    <div className="mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-[#79A3C3]" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79A3C3]">
                  AI transformation
                </p>

                <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl text-white">
                  Same room, new look
                </h3>
              </div>

              <div className="flex -space-x-2">
                <span className="h-8 w-8 rounded-full border-2 border-[#3A2119] bg-[#79A3C3]" />
                <span className="h-8 w-8 rounded-full border-2 border-[#3A2119] bg-[#EBCDB7]" />
                <span className="h-8 w-8 rounded-full border-2 border-[#3A2119] bg-[#957662]" />
              </div>
            </div>
          </div>
        </div>

        {/* ROOM TYPE */}
        <div className="mt-8 rounded-2xl border border-[#3A2119]/8 bg-white/70 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#3A2119]">
              Room type
            </h3>

            <p className="mt-1 text-xs text-[#957662]">
              Helps Lomar choose furniture that fits your room.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {ROOMS.map((room) => {
              const active = roomType === room.value;

              return (
                <button
                  type="button"
                  key={room.value}
                  onClick={() => onSelectRoom(room.value)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-[#3A2119] bg-[#3A2119] text-white"
                      : "border-[#3A2119]/10 bg-white text-[#3A2119] hover:border-[#79A3C3]/60 hover:bg-[#D2E2EC]/30"
                  }`}
                >
                  <p className="text-sm font-semibold">{room.label}</p>

                  <p
                    className={`mt-0.5 text-[11px] ${
                      active ? "text-white/60" : "text-[#957662]"
                    }`}
                  >
                    Furniture matching
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* FURNITURE STYLE */}
        <div className="mt-6 rounded-2xl border border-[#3A2119]/8 bg-white/70 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#3A2119]">
              Furniture style
            </h3>

            <p className="mt-1 text-xs text-[#957662]">
              Choose the look for your new furniture.
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            {STYLES.map((style) => {
              const active = selectedStyle === style;

              return (
                <button
                  type="button"
                  key={style}
                  onClick={() => onSelectStyle(style)}
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-[#3A2119] bg-[#3A2119] text-white shadow-sm"
                      : "border-[#3A2119]/10 bg-white text-[#3A2119] hover:border-[#79A3C3]/50 hover:bg-[#D2E2EC]/20"
                  }`}
                >
                  <p className="text-sm font-semibold">{style}</p>

                  <p
                    className={`mt-1 text-[11px] ${
                      active ? "text-white/60" : "text-[#957662]"
                    }`}
                  >
                    Furniture only
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLOR */}
        <div className="mt-6 rounded-2xl border border-[#3A2119]/8 bg-white/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Palette size={16} className="text-[#79A3C3]" />

            <div>
              <h3 className="text-sm font-semibold text-[#3A2119]">
                Furniture color palette
              </h3>

              <p className="mt-1 text-xs text-[#957662]">
                Colors apply to furniture and decor only.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => {
              const active = selectedColor === color;

              const dotClass: Record<string, string> = {
                beige: "bg-[#D8C1A0]",
                white: "border border-[#CBD5DF] bg-white",
                green: "bg-[#6F8068]",
                brown: "bg-[#3A2119]",
                black: "bg-[#20211F]",
                terracotta: "bg-[#C47B5A]",
                emerald: "bg-[#477A68]",
                natural: "bg-[#C9C1B8]",
              };

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() => onSelectColor(color)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium capitalize transition ${
                    active
                      ? "border-[#3A2119] bg-[#3A2119] text-white"
                      : "border-[#3A2119]/10 bg-white text-[#3A2119] hover:border-[#79A3C3]/50"
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full ${
                      dotClass[color] ?? "bg-[#D6D3D1]"
                    }`}
                  />

                  {color}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI RULE */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#79A3C3]/25 bg-[#D2E2EC]/40 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <Sparkles size={16} className="text-[#79A3C3]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#3A2119]">
              Furniture-only redesign
            </p>

            <p className="mt-1 text-xs leading-5 text-[#5C554F]">
              Lomar preserves your walls, windows, doors, ceiling, flooring,
              room dimensions and camera perspective. Only furniture,
              placement, style, color and decor are redesigned.
            </p>
          </div>
        </div>

        {/* GENERATE */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!hasUploadedImage || generating}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#3A2119] py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(58,33,25,0.15)] transition hover:bg-[#513025] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <WandSparkles size={18} />

          {generating
            ? "Redesigning furniture..."
            : "Redesign furniture"}
        </button>
      </div>
    </section>
  );
}