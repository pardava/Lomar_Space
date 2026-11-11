/**
 * Replace the 200x200 Awin thumbnail in furniture.image_url with the full-size
 * merchant image, for the products imported from lomar_furniture_filtered.csv.
 *
 * Run:
 *   npx tsx fix_image_urls.ts ./lomar_furniture_filtered.csv
 */

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const csvPath = process.argv.find((a) => a.endsWith(".csv"));
if (!csvPath) {
  console.error("Usage: npx tsx fix_image_urls.ts <file.csv>");
  process.exit(1);
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const supabase = createClient(url, key);

type Row = Record<string, string>;
const CONCURRENCY = 20;

async function main() {
  const { data } = Papa.parse<Row>(fs.readFileSync(csvPath!, "utf-8"), {
    header: true,
    skipEmptyLines: true,
  });

  const jobs = data
    .filter((r) => r.merchant_id && r.merchant_product_id && r.merchant_image_url)
    .map((r) => ({ sku: `${r.merchant_id}_${r.merchant_product_id}`, image: r.merchant_image_url }));
  console.log(`Updating ${jobs.length} products...`);

  let done = 0;
  let failed = 0;
  let next = 0;

  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      const { error } = await supabase.from("furniture").update({ image_url: job.image }).eq("sku", job.sku);
      if (error) {
        failed++;
        if (failed <= 3) console.error(`Failed ${job.sku}: ${error.message}`);
      }
      done++;
      if (done % 500 === 0) console.log(`${done}/${jobs.length}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`Finished. Updated: ${done - failed}. Failed: ${failed}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
