"use client";

import {
  Upload,
  WandSparkles,
  Download,
  ArrowLeftRight,
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

const COLOR_GROUPS = [
  {
    base: "beige",
    label: "Beige",
    baseDot: "#D8C1A0",
    shades: [
      { value: "beige-light", label: "Light beige", dot: "#EDE1CE" },
      { value: "beige", label: "Beige", dot: "#D8C1A0" },
      { value: "beige-dark", label: "Dark beige", dot: "#B89B72" },
    ],
  },
  {
    base: "white",
    label: "White",
    baseDot: "#FFFFFF",
    shades: [
      { value: "white", label: "White", dot: "#FFFFFF" },
      { value: "ivory", label: "Ivory", dot: "#F3EFE6" },
      { value: "warm-white", label: "Warm white", dot: "#EFE7DA" },
    ],
  },
  {
    base: "green",
    label: "Green",
    baseDot: "#6F8068",
    shades: [
      { value: "green-light", label: "Sage green", dot: "#9AAB93" },
      { value: "green", label: "Green", dot: "#6F8068" },
      { value: "green-dark", label: "Forest green", dot: "#43503E" },
    ],
  },
  {
    base: "brown",
    label: "Brown",
    baseDot: "#3A2119",
    shades: [
      { value: "brown-light", label: "Light brown", dot: "#6B4A38" },
      { value: "brown", label: "Brown", dot: "#3A2119" },
      { value: "brown-dark", label: "Dark brown", dot: "#241209" },
    ],
  },
  {
    base: "black",
    label: "Black",
    baseDot: "#20211F",
    shades: [
      { value: "charcoal", label: "Charcoal", dot: "#3A3B38" },
      { value: "black", label: "Black", dot: "#20211F" },
      { value: "jet-black", label: "Jet black", dot: "#0A0A09" },
    ],
  },
  {
    base: "terracotta",
    label: "Terracotta",
    baseDot: "#C47B5A",
    shades: [
      { value: "terracotta-light", label: "Light terracotta", dot: "#DDA184" },
      { value: "terracotta", label: "Terracotta", dot: "#C47B5A" },
      { value: "terracotta-dark", label: "Dark terracotta", dot: "#9C5A3D" },
    ],
  },
  {
    base: "emerald",
    label: "Emerald",
    baseDot: "#477A68",
    shades: [
      { value: "emerald-light", label: "Light emerald", dot: "#6FA08C" },
      { value: "emerald", label: "Emerald", dot: "#477A68" },
      { value: "emerald-dark", label: "Dark emerald", dot: "#2C5445" },
    ],
  },
  {
    base: "natural",
    label: "Natural",
    baseDot: "#C9C1B8",
    shades: [
      { value: "natural-light", label: "Light natural", dot: "#E2DCD2" },
      { value: "natural", label: "Natural", dot: "#C9C1B8" },
      { value: "natural-dark", label: "Dark natural", dot: "#A79E92" },
    ],
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
  const [openColorGroup, setOpenColorGroup] = useState<string | null>(null);

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
    <section className="rounded-3xl border border-[#3A2119]/8 bg-white p-6 shadow-sm md:p-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#79A3C3]">
            AI workspace
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl text-[#3A2119]">
            Before &amp; after
          </h2>
          <p className="mt-1 text-sm text-[#957662]">
            Transform your room with AI and shop the look.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#3A2119]/12 px-4 py-2 text-sm font-medium text-[#3A2119] transition hover:bg-[#FAF8F5]"
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
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="overflow-hidden rounded-2xl border-2 border-dashed border-[#3A2119]/15 bg-[#FAF8F5] transition hover:border-[#79A3C3]/50"
        >
          <div className="relative aspect-square">
            {hasUploadedImage ? (
              <img
                src={uploadedImageUrl}
                alt="Uploaded room"
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setUploadedImageError(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6">
                <Upload size={38} className="text-[#957662]" />
                <h3 className="mt-5 text-base font-semibold text-[#3A2119]">
                  Upload your room
                </h3>
                <p className="mt-1 text-sm text-[#957662]">
                  Click or drag a photo here
                </p>
              </div>
            )}
            {hasUploadedImage && (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3A2119] backdrop-blur">
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

        <div className="overflow-hidden rounded-2xl bg-[#3A2119]">
          <div className="relative aspect-square">
            {hasResultImage ? (
              <>
                <img
                  src={resultImageUrl}
                  alt="AI generated room design"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={() => {
                    console.error("AI result image failed:", resultImageUrl);
                    setResultImageError(true);
                  }}
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3A2119] backdrop-blur">
                  AI generated
                </span>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <WandSparkles size={38} className="text-white/40" />
                <p className="mt-4 text-sm text-white/60">
                  {generating
                    ? "Generating your design..."
                    : "Your AI design will appear here"}
                </p>
                {generating && (
                  <div className="mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-white/60" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROOM TYPE */}
      <div className="mt-7">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[#3A2119]">Room type</h3>
          <p className="mt-1 text-xs text-[#957662]">
            Choose the room so AI and furniture matching use the correct
            products.
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
                    ? "border-[#79A3C3] bg-[#79A3C3]/10"
                    : "border-[#3A2119]/10 hover:border-[#3A2119]/25"
                }`}
              >
                <p className="text-sm font-semibold text-[#3A2119]">
                  {room.label}
                </p>
                <p className="mt-0.5 text-[11px] text-[#957662]">
                  AI matched room
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STYLE */}
      <div className="mt-7">
        <h3 className="text-sm font-semibold text-[#3A2119]">Design style</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          {STYLES.map((style) => {
            const active = selectedStyle === style;
            return (
              <button
                type="button"
                key={style}
                onClick={() => onSelectStyle(style)}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-[#79A3C3] bg-[#79A3C3]/10"
                    : "border-[#3A2119]/10 hover:border-[#3A2119]/25"
                }`}
              >
                <p className="text-sm font-semibold text-[#3A2119]">
                  {style}
                </p>
                <p className="mt-1 text-[11px] text-[#957662]">
                  AI-matched style
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLOR */}
      <div className="mt-7">
        <h3 className="text-sm font-semibold text-[#3A2119]">
          Color palette
        </h3>

        <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4">
          {COLOR_GROUPS.map((group) => {
            const isGroupActive = group.shades.some(
              (s) => s.value === selectedColor
            );
            const isOpen = openColorGroup === group.base;
            return (
              <button
                type="button"
                key={group.base}
                onClick={() => setOpenColorGroup(isOpen ? null : group.base)}
                className="group flex flex-col items-center gap-2"
              >
                <div className="flex">
                  {group.shades.map((shade, i) => (
                    <span
                      key={shade.value}
                      className={`h-11 w-11 rounded-full border-2 border-white shadow-md ring-1 ring-black/10 transition-transform ${
                        i > 0 ? "-ml-4" : ""
                      } ${
                        isOpen || isGroupActive
                          ? "scale-105"
                          : "group-hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: shade.dot,
                        zIndex: 10 - i,
                      }}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-medium transition ${
                    isOpen || isGroupActive
                      ? "font-semibold text-[#3A2119]"
                      : "text-[#957662]"
                  }`}
                >
                  {group.label}
                </span>
              </button>
            );
          })}
        </div>

        {openColorGroup && (
          <div className="mt-5 rounded-2xl border border-[#3A2119]/8 bg-[#FAF8F5] p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#957662]">
              Choose a shade
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {COLOR_GROUPS.find(
                (g) => g.base === openColorGroup
              )?.shades.map((shade) => {
                const active = selectedColor === shade.value;
                return (
                  <button
                    type="button"
                    key={shade.value}
                    onClick={() => onSelectColor(shade.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition-all ${
                      active
                        ? "border-[#3A2119] bg-white shadow-md ring-2 ring-[#3A2119]/15"
                        : "border-[#3A2119]/10 bg-white hover:border-[#3A2119]/30"
                    }`}
                  >
                    <span
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm ring-1 ring-black/10"
                      style={{ backgroundColor: shade.dot }}
                    />
                    <span className="text-center text-[11px] font-medium leading-tight text-[#3A2119]">
                      {shade.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* GENERATE */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={!hasUploadedImage || generating}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#3A2119] py-4 text-sm font-semibold text-white transition hover:bg-[#513025] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <WandSparkles size={18} />
        {generating ? "Generating design..." : "Generate design"}
      </button>
    </section>
  );
}