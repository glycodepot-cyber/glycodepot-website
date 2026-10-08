import { NextResponse } from "next/server";

/**
 * Catalog refresh trigger.
 *
 * Hit by a Vercel cron once a day. Calls a Vercel Deploy Hook URL which
 * kicks off a fresh production build — that build re-runs the prebake
 * script and ships the latest BysonHub catalog data.
 *
 * Required env vars on Vercel:
 *   - VERCEL_DEPLOY_HOOK_URL  (create in Project Settings → Git → Deploy Hooks)
 *   - CRON_SECRET             (random string; Vercel cron sends it in Authorization)
 *
 * Configuration fails closed: without both values the route is unavailable,
 * and the deploy hook is never exposed to unauthenticated callers.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Catalog refresh is not configured" },
      { status: 503 },
    );
  }

  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return NextResponse.json(
      { ok: false, error: "Catalog refresh is not configured" },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(hookUrl, { method: "POST" });
    const body = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, status: res.status, body: body.slice(0, 200) },
        { status: 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      triggeredAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
