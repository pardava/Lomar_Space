# Lomar Space — complete project (ready to run)

This is a full Next.js project: your original config (package.json,
tsconfig, middleware, Clerk setup) combined with everything built in our
conversation — landing page, AI Studio, marketplace, admin panel,
checkout — already wired together and rebranded to your blue/tan palette.

## Quick start

```bash
npm install
cp .env.local.example .env.local
# now open .env.local and fill in real values — see below
npm run dev
```

`npm install` needs no new packages — everything used here (Supabase,
Cloudinary, Clerk, Zustand, Framer Motion, lucide-react) was already in
your original `package.json`.

## Important — what will and won't work immediately

`npm run dev` will start the server fine. But:
- **Pages will error until you fill in `.env.local`** — Clerk in
  particular throws at render time without a real publishable key, since
  `ClerkProvider` wraps the whole app in `app/layout.tsx`.
- **The furniture catalog will be empty** until you run `supabase/schema.sql`
  then `supabase/seed.sql` in your Supabase project's SQL Editor.
- **AI generation** falls back to the public FLUX Kontext Pro model until
  you set `REPLICATE_API_TOKEN` (and, later, your own trained
  `REPLICATE_LORA_MODEL`).
- **The logo** at `public/logo.svg` is a placeholder — swap it for the
  real one exported from your brand kit.

None of this is optional setup I could do for you — it all needs your
actual account credentials, which I don't have and shouldn't have.

## Full setup checklist
1. `npm install`
2. Copy `.env.local.example` → `.env.local`, fill in every value (see
   comments in that file for what's new vs. what you already had)
3. Supabase SQL Editor → run `supabase/schema.sql`, then `supabase/seed.sql`
4. Clerk Dashboard → your user → Public metadata → `{"role": "admin"}`
   (needed for `/admin` access)
5. Export your real logo as `public/logo.svg`, replacing the placeholder
6. `npm run dev` → http://localhost:3000

## What's already fixed in this version
- `ShoppingList.tsx`'s broken import path (`./types` → the correct
  `@/components/furniture/types`)
- Your original `BrandSelect.tsx`, `CategorySelect.tsx`,
  `FurnitureImageUpload.tsx` are included (were missing from the last
  package — my mistake, sorry)
- Font variables in `globals.css` now correctly point to Fraunces/Inter
  (the old file still referenced Geist, which we removed)
- `next.config.ts` now allows images from Cloudinary and the seed data's
  placeholder image host

## Still unresolved — need your input
`features/auth/LoginForm.tsx`, `features/landing/*.tsx`, and the three
files under `hooks/` weren't included here because I've never seen their
contents — they're not part of anything built in this conversation. If
you still need them, share the files and I'll fix the mismatches; if
they're leftover/unused scaffolding, you can likely just delete them.
