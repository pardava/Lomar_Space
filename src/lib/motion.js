// Shared motion language for LOMAR: one easing curve, one set of variants.
export const ease = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const hoverLift = {
  y: -6,
  scale: 1.02,
  transition: { type: 'spring', stiffness: 300, damping: 22 },
};

export const viewportOnce = { once: true, amount: 0.25 };
