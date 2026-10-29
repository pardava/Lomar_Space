'use client';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { hoverLift } from '../../lib/motion';

/**
 * Glass surface with optional lift (hover) and 3D tilt (projects dashboard).
 * Extra props (variants, initial, whileInView, onClick...) pass through to the motion element.
 */
export default function GlassCard({
  as = 'div',
  lift = false,
  tilt = false,
  strong = false,
  className = '',
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), spring);

  const Comp = motion[as] ?? motion.div;
  const canTilt = tilt && !reduce;

  const onPointerMove = (e) => {
    if (!canTilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onPointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Comp
      className={`${strong ? 'glass-strong' : 'glass'} ${className}`}
      style={canTilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      whileHover={lift && !reduce ? hoverLift : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </Comp>
  );
}
