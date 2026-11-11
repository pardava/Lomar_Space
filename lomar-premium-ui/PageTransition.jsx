import { motion, useReducedMotion } from 'framer-motion';

/**
 * Cinematic fade + blue glow sweep. Wrap each route's element and give it a `key`
 * (the pathname) so it replays on navigation, ideally inside <AnimatePresence mode="wait">.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, filter: reduce ? 'none' : 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 left-0 z-[60] w-[45vw] bg-gradient-to-r from-transparent via-lomar-blue/25 to-transparent blur-2xl"
          initial={{ x: '-60vw', opacity: 1 }}
          animate={{ x: '120vw', opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      )}
      {children}
    </motion.div>
  );
}
