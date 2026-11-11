"use client";

import { useRef, useState } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  alt?: string;
};

export default function BeforeAfterSlider({
  before,
  after,
  alt = "Before and after interior transformation",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  const updatePosition = (clientX: number) => {
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    const value =
      ((clientX - rect.left) / rect.width) * 100;

    setPosition(Math.min(100, Math.max(0, value)));
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setIsDragging(true);

    updatePosition(event.clientX);

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;

    updatePosition(event.clientX);
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] bg-[#E8E1D8] select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setIsDragging(false)}
    >
      {/* =========================================
          AFTER IMAGE
      ========================================= */}

      {!afterError ? (
        <img
          src={after}
          alt={alt}
          draggable={false}
          onError={() => setAfterError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#3A2119] p-6 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D2E2EC]">
              After image
            </p>

            <p className="mt-2 text-sm text-white/80">
              Image not found
            </p>

            <p className="mt-1 break-all text-xs text-white/50">
              {after}
            </p>
          </div>
        </div>
      )}

      {/* AFTER LABEL */}

      <div className="absolute right-5 top-5 z-10 rounded-full bg-[#3A2119]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur">
        After
      </div>

      {/* =========================================
          BEFORE IMAGE
      ========================================= */}

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        {!beforeError ? (
          <img
            src={before}
            alt=""
            draggable={false}
            onError={() => setBeforeError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#E8E1D8] p-6 text-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#957662]">
                Before image
              </p>

              <p className="mt-2 text-sm text-[#3A2119]/70">
                Image not found
              </p>

              <p className="mt-1 break-all text-xs text-[#3A2119]/50">
                {before}
              </p>
            </div>
          </div>
        )}

        {/* BEFORE LABEL */}

        <div className="absolute left-5 top-5 z-10 rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A2119] shadow-lg backdrop-blur">
          Before
        </div>
      </div>

      {/* =========================================
          SLIDER LINE
      ========================================= */}

      <div
        className="pointer-events-none absolute inset-y-0 z-20"
        style={{
          left: `${position}%`,
        }}
      >
        {/* Vertical line */}

        <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.35)]" />

        {/* Handle */}

        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#3A2119] text-white shadow-xl">
          <div className="flex items-center gap-0.5 text-xl leading-none">
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
      </div>

      {/* =========================================
          DRAG HINT
      ========================================= */}

      {!isDragging && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
          Drag to compare
        </div>
      )}
    </div>
  );
}