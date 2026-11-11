'use client';

import { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Menu, Search, Upload, User, X } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';

const DEFAULT_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'AI Studio', href: '/studio' },
];

export default function FloatingNav({
  links = DEFAULT_LINKS,
  currentPath = '/',
  LinkComponent,
  uploadHref = '/studio',
  onSearch = () => {},
  onProfile = () => {},
}) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setCompact(y > 48);
  });

  const linkProps = (href) => ({ href });

  const isActive = (href) =>
    href === '/'
      ? currentPath === '/'
      : currentPath.startsWith(href);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-4">
      <motion.nav
        aria-label="Main"
        animate={{
          maxWidth: compact ? 860 : 1120,
          paddingTop: compact ? 6 : 10,
          paddingBottom: compact ? 6 : 10,
        }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 28,
        }}
        className="glass pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full px-3 sm:px-5"
      >
        <LinkComponent
          {...linkProps('/')}
          className="flex items-center gap-2 pl-1 text-lg font-semibold tracking-[0.18em] text-lomar-ivory"
        >
          <span
            className="h-2 w-2 rounded-full bg-lomar-champagne shadow-glow-champagne"
            aria-hidden="true"
          />
          LOMAR
        </LinkComponent>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href} className="relative">
              <LinkComponent
                {...linkProps(link.href)}
                aria-current={
                  isActive(link.href) ? 'page' : undefined
                }
                className={`relative z-10 block rounded-full px-4 py-2 text-[15px] transition-colors ${
                  isActive(link.href)
                    ? 'text-lomar-ivory'
                    : 'text-lomar-muted hover:text-lomar-ivory'
                }`}
              >
                {link.label}
              </LinkComponent>

              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 32,
                  }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            onClick={onSearch}
            className="grid h-10 w-10 place-items-center rounded-full text-lomar-muted transition-colors hover:bg-white/10 hover:text-lomar-ivory"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            aria-label="Profile"
            onClick={onProfile}
            className="grid h-10 w-10 place-items-center rounded-full text-lomar-muted transition-colors hover:bg-white/10 hover:text-lomar-ivory"
          >
            <User className="h-[18px] w-[18px]" />
          </button>

          <MagneticButton
            href={uploadHref}
            size="sm"
            className="ml-1"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">
              Upload Room
            </span>
          </MagneticButton>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((previous) => !previous)}
            className="grid h-10 w-10 place-items-center rounded-full text-lomar-ivory hover:bg-white/10 md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass pointer-events-auto mt-2 w-full max-w-[1120px] p-2 md:hidden"
          >
            {links.map((link) => (
              <li key={link.href}>
                <LinkComponent
                  {...linkProps(link.href)}
                  onClick={() => setOpen(false)}
                  className={`block rounded-2xl px-5 py-4 text-lg ${
                    isActive(link.href)
                      ? 'bg-white/10 text-lomar-ivory'
                      : 'text-lomar-muted'
                  }`}
                >
                  {link.label}
                </LinkComponent>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}