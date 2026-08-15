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
  {
    value: "living_room",
    label: "Living Room",
  },
  {
    value: "bedroom",
    label: "Bedroom",
  },
  {
    value: "kitchen",
    label: "Kitchen",
  },
  {
    value: "dining_room",
    label: "Dining Room",
  },
  {
    value: "office",
    label: "Office",
  },
  {
    value: "bathroom",
    label: "Bathroom",
  },
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

  const [uploadedImageError, setUploadedImageError] =
    useState(false);

  const [resultImageError, setResultImageError] =
    useState(false);

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
    <section className="rounded-3xl border border-[#33475A]/8 bg-white p-6 shadow-sm md:p-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7EA6D8]">
            AI workspace
          </p>

          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl text-[#33475A]">
            Before &amp; after
          </h2>

          <p className="mt-1 text-sm text-[#8598A8]">
            Transform your room with AI and shop the look.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#33475A]/12 px-4 py-2 text-sm font-medium text-[#33475A] transition hover:bg-[#F0F4F8]"
          >
            <ArrowLeftRight size={15} />
            Compare
          </button>

          <button
            type="button"
            disabled={!hasResultImage}
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-full bg-[#33475A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7EA6D8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {/* BEFORE */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="overflow-hidden rounded-2xl border-2 border-dashed border-[#33475A]/15 bg-[#F0F4F8] transition hover:border-[#7EA6D8]/50"
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
                <Upload
                  size={38}
                  className="text-[#8598A8]"
                />

                <h3 className="mt-5 text-base font-semibold text-[#33475A]">
                  Upload your room
                </h3>

                <p className="mt-1 text-sm text-[#8598A8]">
                  Click or drag a photo here
                </p>
              </div>
            )}

            {hasUploadedImage && (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#33475A] backdrop-blur">
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
        <div className="overflow-hidden rounded-2xl bg-[#33475A]">
          <div className="relative aspect-square">
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

                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#33475A] backdrop-blur">
                  AI generated
                </span>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <WandSparkles
                  size={38}
                  className="text-white/40"
                />

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
          <h3 className="text-sm font-semibold text-[#33475A]">
            Room type
          </h3>

          <p className="mt-1 text-xs text-[#8598A8]">
            Choose the room so AI and furniture matching use
            the correct products.
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
                    ? "border-[#7EA6D8] bg-[#7EA6D8]/10"
                    : "border-[#33475A]/10 hover:border-[#33475A]/25"
                }`}
              >
                <p className="text-sm font-semibold text-[#33475A]">
                  {room.label}
                </p>

                <p className="mt-0.5 text-[11px] text-[#8598A8]">
                  AI matched room
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STYLE */}
      <div className="mt-7">
        <h3 className="text-sm font-semibold text-[#33475A]">
          Design style
        </h3>

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
                    ? "border-[#7EA6D8] bg-[#7EA6D8]/10"
                    : "border-[#33475A]/10 hover:border-[#33475A]/25"
                }`}
              >
                <p className="text-sm font-semibold text-[#33475A]">
                  {style}
                </p>

                <p className="mt-1 text-[11px] text-[#8598A8]">
                  AI-matched style
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLOR */}
      <div className="mt-7">
        <h3 className="text-sm font-semibold text-[#33475A]">
          Color palette
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const active = selectedColor === color;

            const dotClass: Record<string, string> = {
              beige: "bg-[#D8C1A0]",
              white: "bg-white border border-[#CBD5DF]",
              green: "bg-[#15803D]",
              brown: "bg-[#78350F]",
              black: "bg-black",
              terracotta: "bg-[#C2410C]",
              emerald: "bg-[#047857]",
              natural: "bg-[#D6D3D1]",
            };

            return (
              <button
                type="button"
                key={color}
                onClick={() => onSelectColor(color)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium capitalize transition ${
                  active
                    ? "border-[#33475A] bg-[#33475A] text-white"
                    : "border-[#33475A]/10 bg-white text-[#33475A] hover:border-[#33475A]/25"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full ${
                    dotClass[color] ?? "bg-[#D6D3D1]"
                  }`}
                />

                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* GENERATE */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={!hasUploadedImage || generating}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#33475A] py-4 text-sm font-semibold text-white transition hover:bg-[#7EA6D8] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <WandSparkles size={18} />

        {generating
          ? "Generating design..."
          : "Generate design"}
      </button>
    </section>
  );
}