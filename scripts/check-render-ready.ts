/**
 * scripts/check-render-ready.ts
 *
 * Checks every active, in-stock, classified product in the `furniture` table:
 *  - image_url opens (HTTP 200, content-type image/*)
 *  - the image is big enough for the render model
 * Then writes render_ready, image_width_px, image_height_px, last_render_check.
 *
 * Setup:
 *   npm i @supabase/supabase-js image-size@^2
 *   npm i -D tsx
 *
 * Env (e.g. in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   (server only, never ship to the browser)
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/check-render-ready.ts            # only never-checked rows
 *   npx tsx --env-file=.env.local scripts/check-render-ready.ts --all      # re-check everything
 *   npx tsx --env-file=.env.local scripts/check-render-ready.ts --limit 200
 */
import { createClient } from "@supabase/supabase-js";
import { imageSize } from "image-size";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const args = process.argv.slice(2);
const CHECK_ALL = args.includes("--all");
const limitIdx = args.indexOf("--limit");
const MAX_ROWS = limitIdx >= 0 ? Number(args[limitIdx + 1]) : Infinity;

const MIN_SIDE_PX = 400; // smallest side the render model should get
const MAX_BYTES = 15 * 1024 * 1024;
const TIMEOUT_MS = 15_000;
const CONCURRENCY = 8;
const PAGE_SIZE = 200;

type Row = { id: string; name: string; image_url: string | null };
type Result = {
  id: string;
  ok: boolean;
  width: number | null;
  height: number | null;
  reason: string;
};

async function checkImage(row: Row): Promise<Result> {
  const fail = (reason: string): Result => ({
    id: row.id,
    ok: false,
    width: null,
    height: null,
    reason,
  });

  if (!row.image_url) return fail("no image_url");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(row.image_url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LomarCatalogCheck/1.0)" },
    });
    if (!res.ok) return fail(`HTTP ${res.status}`);

    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return fail(`content-type ${type || "missing"}`);

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) return fail("empty body");
    if (buf.length > MAX_BYTES) return fail("file too large");

    const { width, height } = imageSize(buf);
    if (!width || !height) return fail("cannot read dimensions");
    if (Math.min(width, height) < MIN_SIDE_PX) {
      return { id: row.id, ok: false, width, height, reason: `too small ${width}x${height}` };
    }
    return { id: row.id, ok: true, width, height, reason: "ok" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return fail(`error: ${msg}`);
  } finally {
    clearTimeout(timer);
  }
}

async function saveResult(r: Result) {
  const { error } = await supabase
    .from("furniture")
    .update({
      render_ready: r.ok,
      image_width_px: r.width,
      image_height_px: r.height,
      last_render_check: new Date().toISOString(),
    })
    .eq("id", r.id);
  if (error) console.error(`  update failed for ${r.id}: ${error.message}`);
}

async function runPool<T, R>(items: T[], size: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (true) {
        const i = next++;
        if (i >= items.length) return;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

async function main() {
  let lastId = "00000000-0000-0000-0000-000000000000";
  let processed = 0;
  let okCount = 0;
  const failReasons = new Map<string, number>();

  while (processed < MAX_ROWS) {
    // keyset pagination by id, so updating rows never shifts the pages
    let q = supabase
      .from("furniture")
      .select("id, name, image_url")
      .eq("is_active", true)
      .eq("in_stock", true)
      .not("ai_product_type", "is", null)
      .gt("id", lastId)
      .order("id", { ascending: true })
      .limit(PAGE_SIZE);
    if (!CHECK_ALL) q = q.is("last_render_check", null);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    const rows = (data as Row[]).slice(0, MAX_ROWS - processed);
    const results = await runPool(rows, CONCURRENCY, checkImage);

    await runPool(results, CONCURRENCY, saveResult);

    for (const r of results) {
      if (r.ok) okCount++;
      else {
        const key = r.reason.replace(/\d+x\d+/, "WxH");
        failReasons.set(key, (failReasons.get(key) ?? 0) + 1);
      }
    }
    processed += rows.length;
    lastId = data[data.length - 1].id;
    console.log(`checked ${processed} (ok so far: ${okCount})`);
  }

  console.log("\nDone.");
  console.log(`  checked:      ${processed}`);
  console.log(`  render_ready: ${okCount}`);
  console.log(`  failed:       ${processed - okCount}`);
  for (const [reason, n] of [...failReasons.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(5)}  ${reason}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});