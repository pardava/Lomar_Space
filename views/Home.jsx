'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Play, RotateCcw, Sofa, Upload } from 'lucide-react';
import MagneticButton from '../components/ui/MagneticButton';
import GlassCard from '../components/ui/GlassCard';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import RenderReveal from '../components/studio/RenderReveal';
import { ease, fadeUp, stagger, viewportOnce } from '../lib/motion';
import { AI_DEMO, FEATURED_ROOMS, HERO_PICKS, HERO_RENDER, ROOM_CATEGORIES, STATS } from '../data/homeContent';

const formatEUR = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

/* ------------------------------------------------------------------ Hero */

function FloatingPick({ pick, className, delay = 0 }) {
  return (
    <GlassCard
      strong
      className={`absolute flex w-[13.5rem] animate-float items-center gap-3 p-2.5 sm:w-60 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <ImageWithFallback src={pick.image} alt="" icon={Sofa} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
      <div className="min-w-0">
        <p className="truncate text-[15px] text-lomar-ivory">{pick.name}</p>
        <p className="mt-0.5 flex items-center gap-2 text-sm">
          <span className="text-lomar-ivory">{formatEUR(pick.price)}</span>
          <span className="text-lomar-champagne">{pick.match}% match</span>
        </p>
      </div>
    </GlassCard>
  );
}

function Hero({ onUpload, onDemo }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '16%']);
  const frameY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-7%']);

  return (
    <section ref={ref} className="relative isolate min-h-screen overflow-hidden">
      {/* Cinematic backdrop: dimmed render + soft glow. The sharp render on the right stays the brightest thing. */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 scale-110">
        <ImageWithFallback src={HERO_RENDER} alt="" loading="eager" className="h-full w-full object-cover opacity-35 blur-[3px]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_35%,rgba(37,99,235,0.16),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgba(124,58,237,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-lomar-bg via-lomar-bg/85 to-lomar-bg/25" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-lomar-bg to-transparent" />
      </motion.div>

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-5 pb-20 pt-32 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <motion.div variants={stagger(0.12, 0.1)} initial="hidden" animate="show">
          <motion.h1 variants={fadeUp} className="text-balance text-hero font-display text-lomar-ivory">
            Your dream room. Designed in 30 seconds.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-[30rem] text-body text-lomar-muted">
            Upload a photo. AI redesigns it using real furniture you can actually buy.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton size="lg" onClick={onUpload}>
              <Upload className="h-5 w-5" />
              Upload Room
            </MagneticButton>
            <MagneticButton size="lg" variant="glass" onClick={onDemo}>
              <Play className="h-5 w-5" />
              Watch Demo
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: frameY }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
            className="glass p-2 shadow-glow-blue"
          >
            <div className="group aspect-[4/3] overflow-hidden rounded-[22px]">
              <ImageWithFallback
                src={HERO_RENDER}
                alt="A living room redesigned by LOMAR AI"
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
            <FloatingPick pick={HERO_PICKS[0]} className="-left-3 top-[10%] sm:-left-10" />
            <FloatingPick pick={HERO_PICKS[1]} className="-right-2 top-[42%] sm:-right-8" delay={1.4} />
            <FloatingPick pick={HERO_PICKS[2]} className="bottom-[6%] left-[10%] hidden sm:flex" delay={2.6} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Stats */

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(0, to, { duration: 1.6, ease, onUpdate: (n) => setValue(Math.round(n)) });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8">
      <motion.dl
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="glass grid divide-white/10 py-4 sm:grid-cols-3 sm:divide-x"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="flex flex-col px-8 py-6 text-center sm:text-left">
            <dt className="order-2 mt-2 text-lomar-muted">{s.label}</dt>
            <dd className="text-section text-lomar-ivory">
              <CountUp to={s.value} suffix={s.suffix} />
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}

/* --------------------------------------------------------- Featured rooms */

function FeaturedRooms({ onOpenRoom }) {
  const [active, setActive] = useState('All');
  const rooms = active === 'All' ? FEATURED_ROOMS : FEATURED_ROOMS.filter((r) => r.category === active);

  return (
    <section className="mx-auto max-w-7xl px-5 py-32 lg:px-8">
      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <motion.h2 variants={fadeUp} className="text-balance text-section text-lomar-ivory">
          Rooms designed with real furniture
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-xl text-body text-lomar-muted">
          Every piece in these renders is in the marketplace. Pick a style and see what it looks like.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Room styles">
          {ROOM_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2.5 text-[15px] backdrop-blur-lomar transition-all ${
                active === c
                  ? 'border-lomar-blue/60 bg-lomar-blue/20 text-lomar-ivory shadow-glow-blue'
                  : 'border-white/10 bg-white/5 text-lomar-muted hover:text-lomar-ivory'
              }`}
            >
              {c}
            </button>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        key={active}
        variants={stagger(0.07)}
        initial="hidden"
        animate="show"
        className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3"
      >
        {rooms.map((room) => (
          <motion.button
            key={room.id}
            type="button"
            variants={fadeUp}
            onClick={() => onOpenRoom?.(room)}
            className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-lomar text-left"
          >
            <ImageWithFallback
              src={room.image}
              alt={room.title}
              className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${room.ratio}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-lomar-bg/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
              <p className="text-card text-lomar-ivory">{room.title}</p>
              <p className="mt-1 text-sm text-lomar-champagne">{room.category}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------ AI section */

function AiSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const [run, setRun] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-32 lg:px-8">
      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} className="max-w-2xl">
        <motion.h2 variants={fadeUp} className="text-balance text-section text-lomar-ivory">
          From your photo to a room you can buy
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-body text-lomar-muted">
          LOMAR maps your room, places catalog furniture, and shows you exactly what is in the scene.
        </motion.p>
      </motion.div>

      <div ref={ref} className="mt-12">
        <RenderReveal src={AI_DEMO.image} items={AI_DEMO.items} play={inView} runKey={run} pinChips className="shadow-glow-blue" />
        <div className="mt-6 flex justify-end">
          <MagneticButton variant="glass" size="sm" onClick={() => setRun((r) => r + 1)}>
            <RotateCcw className="h-4 w-4" />
            Replay
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Page */

export default function Home({ onUpload, onDemo, onOpenRoom }) {
  return (
    <main>
      <Hero onUpload={onUpload} onDemo={onDemo} />
      <Stats />
      <FeaturedRooms onOpenRoom={onOpenRoom} />
      <AiSection />
    </main>
  );
}
