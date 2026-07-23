import { NextResponse } from "next/server";
import catalog from "@/lib/data/catalog.json";

export const maxDuration = 60;

/**
 * Rolling image-cache warmer.
 *
 * Product images are fetched live from Supabase (BysonHub's origin) through
 * Vercel's Image Optimizer — there's no CDN mirror in front of them. Under
 * concurrent load (a full product grid loading ~20 images at once) some of
 * those live fetches are slow enough to fail outright, showing a blank
 * image that only "heals" once any single request for that image succeeds
 * and gets cached (minimumCacheTTL: 30 days in next.config.ts).
 *
 * This warms a rotating slice of the catalog once a day by requesting each
 * image through our own /_next/image endpoint — same optimizer, but as an
 * isolated low-concurrency background call instead of a real user's
 * page-load burst. At BATCH_SIZE/day the full catalog cycles well inside
 * the 30-day cache TTL, so steady state stays warm indefinitely.
 */

const BATCH_SIZE = 400;
const WARM_WIDTH = 384; // matches the imageSizes bucket ProductCard's `sizes` hint resolves to on a grid
const CONCURRENCY = 12;
const FETCH_TIMEOUT_MS = 8000;

async function warmOne(siteUrl: string, src: string): Promise<boolean> {
  const url = `${siteUrl}/_next/image?url=${encodeURIComponent(src)}&w=${WARM_WIDTH}&q=75`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return NextResponse.json({ ok: true, skipped: true, reason: "NEXT_PUBLIC_SITE_URL not set" });
  }
  const site: string = siteUrl;

  const allSrcs = Array.from(
    new Set(
      (catalog as { products: Array<{ images: Array<{ src: string }> }> }).products.flatMap((p) =>
        p.images.map((i) => i.src),
      ),
    ),
  );

  const totalBatches = Math.max(1, Math.ceil(allSrcs.length / BATCH_SIZE));
  const batchIndex = Math.floor(Date.now() / 86_400_000) % totalBatches;
  const batch = allSrcs.slice(batchIndex * BATCH_SIZE, batchIndex * BATCH_SIZE + BATCH_SIZE);

  let warmed = 0;
  let failed = 0;
  let i = 0;
  async function worker() {
    while (i < batch.length) {
      const src = batch[i++];
      if (!src) continue;
      const ok = await warmOne(site, src);
      if (ok) warmed++;
      else failed++;
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, batch.length) }, worker));

  return NextResponse.json({
    ok: true,
    batchIndex,
    totalBatches,
    batchSize: batch.length,
    warmed,
    failed,
  });
}
