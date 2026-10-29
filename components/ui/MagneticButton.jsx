'use client';
import { useRef, useState } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-gradient-to-r from-lomar-blue to-lomar-aurora text-white shadow-glow-blue',
  glass: 'border border-white/15 bg-white/5 text-lomar-ivory backdrop-blur-lomar hover:bg-white/10',
  champagne: 'bg-lomar-champagne text-[#1b150c] shadow-glow-champagne',
};

const SIZES = {
  sm: 'h-10 px-4 text-sm gap-2',
  md: 'h-12 px-6 text-base gap-2.5',
  lg: 'h-14 px-8 text-lg gap-3',
};

/** Pill button that leans toward the cursor and emits a ripple on press. */
export default function MagneticButton({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  onClick,
  ...rest
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const [ripples, setRipples] = useState([]);

  const Comp = href ? motion.a : motion.button;

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e) => {
    if (!reduce && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setRipples((rs) => [...rs, { id: crypto.randomUUID(), x: e.clientX - r.left, y: e.clientY - r.top }]);
    }
    onClick?.(e);
  };

  return (
    <Comp
      ref={ref}
      href={href}
      type={href ? undefined : rest.type ?? 'button'}
      onClick={handleClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y }}
      whileHover={reduce ? undefined : { scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={`relative inline-flex select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-medium tracking-tight transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-[inherit]">{children}</span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute h-24 w-24 rounded-full bg-white/40"
          style={{ left: r.x - 48, top: r.y - 48 }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          onAnimationComplete={() => setRipples((rs) => rs.filter((x2) => x2.id !== r.id))}
        />
      ))}
    </Comp>
  );
}
