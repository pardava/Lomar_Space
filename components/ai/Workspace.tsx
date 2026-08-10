"use client";

import Image from "next/image";
import { Upload, WandSparkles, Download, ArrowLeftRight } from "lucide-react";
import { useRef } from "react";

const STYLES = ["Modern", "Minimal", "Luxury", "Scandinavian"];

interface WorkspaceProps {
  uploadedImageUrl?: string;
  resultImageUrl?: string;
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
  onUpload: (file: File) => void;
  onGenerate: () => void;
  generating?: boolean;
}

export default function Workspace({
  uploadedImageUrl,
  resultImageUrl,
  selectedStyle,
  onSelectStyle,
  onUpload,
  onGenerate,
  generating,
}: WorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-3xl border border-[#33475A]/8 bg-white p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7EA6D8]">
            AI workspace
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl text-[#33475A]">
            Before &amp; after
          </h2>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-full border border-[#33475A]/12 px-5 py-2.5 text-sm font-medium text-[#33475A] transition hover:bg-[#F0F4F8]">
            <ArrowLeftRight size={16} />
            Compare
          </button>
          <button
            disabled={!resultImageUrl}
            className="flex items-center gap-2 rounded-full bg-[#33475A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7EA6D8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="overflow-hidden rounded-2xl border-2 border-dashed border-[#33475A]/15 bg-[#F0F4F8] transition hover:border-[#7EA6D8]/40"
        >
          <div className="relative flex aspect-square flex-col items-center justify-center">
            {uploadedImageUrl ? (
              <Image
                src={uploadedImageUrl}
                alt="Uploaded room"
                fill
                className="object-cover"
              />
            ) : (
              <>
                <Upload size={40} className="text-[#8598A8]" />
                <h3 className="mt-5 text-base font-semibold text-[#33475A]">
                  Upload your room
                </h3>
                <p className="mt-1 text-sm text-[#8598A8]">
                  Click, or drag a photo here
                </p>
              </>
            )}
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
        />

        <div className="overflow-hidden rounded-2xl bg-[#33475A]">
          <div className="relative flex aspect-square items-center justify-center">
            {resultImageUrl ? (
              <>
                <Image
                  src={resultImageUrl}
                  alt="AI generated result"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#33475A] backdrop-blur">
                  AI generated
                </span>
              </>
            ) : (
              <p className="px-8 text-center text-sm text-white/50">
                {generating
                  ? "Generating your design…"
                  : "Your AI design will appear here"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        {STYLES.map((style) => {
          const active = selectedStyle === style;
          return (
            <button
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[#7EA6D8] bg-[#7EA6D8]/5"
                  : "border-[#33475A]/10 hover:border-[#33475A]/25"
              }`}
            >
              <h3 className="text-sm font-semibold text-[#33475A]">{style}</h3>
              <p className="mt-1 text-xs text-[#8598A8]">AI-matched style</p>
            </button>
          );
        })}
      </div>

      <button
        onClick={onGenerate}
        disabled={!uploadedImageUrl || generating}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#33475A] py-4 text-base font-semibold text-white transition hover:bg-[#7EA6D8] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <WandSparkles size={18} />
        {generating ? "Generating…" : "Generate design"}
      </button>
    </section>
  );
}
