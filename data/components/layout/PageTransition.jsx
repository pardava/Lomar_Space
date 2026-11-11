ive(link.href) && (
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