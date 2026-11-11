'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import ImageWithFallback from '../ui/ImageWithFallback';

/**
 * The signature LOMAR moment.
 *
 * 1. screen darkens            (phase: dark)
 * 2. blue scan line passes     (phase: scan)
 * 3. room becomes holographic wireframe (revealed under the scan line)
 * 4. furniture silhouettes appear (phase: silhouettes)
 * 5. real furniture fades into place (phase: materialize)
 * 6. soft champagne glow finishes (phase: glow) -> done
 *
 * Props
 *  src       final render URL
 *  items     [{ id, label, image, box: { x, y, w, h } }]  boxes are % of the render
 *  play      start the sequence when true
 *  runKey    change it to replay while `play` stays true
 *  pinChips  keep product chips visible after the sequence ends
 *  onComplete
 *
 * The wireframe is generated from the render itself with an SVG edge-detect filter,
 * so it works for any image without extra assets.
 */
const WIRE_FILTER_ID = 'lomar-wire';
const WIRE_PHASES = ['dark', 'scan', 'silhouettes'];

export default function RenderReveal({
  src,
  alt = 'AI-designed room',
  items = [],
  play = false,
  runKey = 0,
  pinChips = false,
  onComplete,
  className = '',
}) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState('done');
  const scan = useMotionValue(0);
  const wireClip = useTransform(scan, (v) => `inset(0% 0% ${100 - v}% 0%)`);
  const scanTop = useTransform(scan, (v) => `${v}%`);

  useEffect(() => {
    if (!play || reduce) {
      setPhase('done');
      if (play && reduce) onComplete?.();
      return undefined;
    }
    const timers = [];
    let scanAnim;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    scan.set(0);
    setPhase('dark');
    at(500, () => {
      setPhase('scan');
      scanAnim = animate(scan, 100, { duration: 1.7, ease: 'linear' });
    });
    at(2300, () => setPhase('silhouettes'));
    at(3300, () => setPhase('materialize'));
    at(4500, () => setPhase('glow'));
    at(6000, () => {
      setPhase('done');
      onComplete?.();
    });

    return () => {
      timers.forEach(clearTimeout);
      scanAnim?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, runKey, reduce]);

  const wireOn = WIRE_PHASES.includes(phase);
  const chipsOn = phase === 'materialize' || phase === 'glow' || (phase === 'done' && pinChips);

  return (
    <div
      className={`relative isolate aspect-[4/3] overflow-hidden rounded-lomar bg-lomar-surface shadow-float ${className}`}
      aria-busy={phase !== 'done'}
    >
      {/* Edge-detect filter: grayscale -> Laplacian edges -> blue with alpha from edge strength */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <filter id={WIRE_FILTER_ID} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
            <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" bias="0" preserveAlpha="true" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.62  0 0 0 0 1  7 0 0 0 0" />
          </filter>
        </defs>
      </svg>

      {/* Final render: always the brightest layer once the sequence ends */}
      <motion.div
        className="absolute inset-0"
        animate={{ filter: wireOn ? 'brightness(0.5) saturate(0.6)' : 'brightness(1) saturate(1)' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <ImageWithFallback src={src} alt={alt} loading="eager" className="h-full w-full object-cover" />
      </motion.div>

      {/* 1. Darken */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-lomar-bg"
        initial={false}
        animate={{ opacity: wireOn ? 0.7 : 0 }}
        transition={{ duration: wireOn ? 0.6 : 1.1 }}
      />

      {/* 3. Holographic wireframe, revealed top-down by the scan line */}
      <motion.div
        aria-hidden="true"
        className="holo-grid absolute inset-0 bg-[#05080f]/90"
        style={{ clipPath: wireClip }}
        initial={false}
        animate={{ opacity: wireOn ? 1 : 0 }}
        transition={{ duration: 0.9 }}
      >
        <ImageWithFallback
          src={src}
          alt=""
          loading="eager"
          className="h-full w-full object-cover mix-blend-screen"
          style={{ filter: `url(#${WIRE_FILTER_ID})` }}
        />
      </motion.div>

      {/* 4. Furniture silhouettes */}
      <AnimatePresence>
        {phase === 'silhouettes' &&
          items.map((it, i) => (
            <motion.div
              key={`sil-${it.id}`}
              aria-hidden="true"
              className="absolute rounded-2xl border border-dashed border-blue-400/80 bg-lomar-blue/10 shadow-[0_0_28px_rgba(37,99,235,0.45)]"
              style={{ left: `${it.box.x}%`, top: `${it.box.y}%`, width: `${it.box.w}%`, height: `${it.box.h}%` }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            />
          ))}
      </AnimatePresence>

      {/* 2. Scan line */}
      <AnimatePresence>
        {phase === 'scan' && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-20"
            style={{ top: scanTop }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-blue-500/25 to-transparent" />
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent shadow-[0_0_28px_6px_rgba(37,99,235,0.75)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Real furniture chips fade into place */}
      <AnimatePresence>
        {chipsOn &&
          items.map((it, i) => (
            <motion.div
              key={`chip-${it.id}`}
              className="absolute z-10 flex items-center gap-2 rounded-full border border-white/15 bg-lomar-bg/65 p-1.5 pr-3 text-sm text-lomar-ivory backdrop-blur-lomar"
              style={{ left: `${it.box.x + it.box.w / 2}%`, top: `${it.box.y + it.box.h / 2}%`, translate: '-50% -50%' }}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.14 }}
            >
              <ImageWithFallback src={it.image} alt="" className="h-7 w-7 rounded-full object-cover" />
              <span className="max-w-[9rem] truncate">{it.label}</span>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 6. Champagne glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lomar shadow-[inset_0_0_120px_rgba(200,169,126,0.32)]"
        initial={false}
        animate={{ opacity: phase === 'glow' ? 1 : 0 }}
        transition={{ duration: phase === 'glow' ? 0.9 : 1.4 }}
      />

      <span className="sr-only" role="status">
        {phase === 'done' ? 'Render ready' : 'Rendering your room'}
      </span>
    </div>
  );
}
