/**
 * Lightweight bot filter for public forms (RFQ, contact, newsletter).
 *
 * Runs on the server inside the Server Actions. A submission flagged here is
 * dropped silently: the caller returns a normal-looking success so the bot
 * learns nothing, but nothing is saved, emailed or pushed to the CRM.
 *
 * Signals, any one of which is enough:
 *  1. Honeypot — a visually hidden field real visitors never see or fill.
 *  2. Speed   — the form was submitted less than MIN_FILL_MS after it rendered,
 *               or the timing stamp is missing (direct action replay).
 *  3. Gibberish — random mixed-case strings like "YonccviNLYuFKuXBSmzf" in
 *               the name or company, or a long single "word" as the message.
 *  4. Dot-padded Gmail — "k.c.s.i.e.f.f@gmail.com"-style addresses that bots
 *               use to mint endless unique aliases of one inbox.
 */

export interface FormGuard {
  /** Value of the hidden honeypot input — must be empty. */
  hp?: string;
  /** Date.now() captured on the client when the form first rendered. */
  t?: number;
}

export interface GuardInput {
  guard?: FormGuard;
  email?: string;
  /** Short free-text fields where real people write names/words. */
  names?: Array<string | undefined>;
  /** Longer free text (message / notes). */
  message?: string;
}

export const HONEYPOT_FIELD = "website_url";
const MIN_FILL_MS = 3_000;
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 24; // a tab left open for a day is fine

/**
 * A "word" with several lower→upper case flips inside it is not a real name.
 * In strict mode (free-text messages, where glycan shorthand like
 * "STolGlcNAcFmoc" is normal) only the capital-run test applies.
 */
function looksRandom(word: string, strict = false): boolean {
  // Only pure-letter tokens. Glycan/chemistry shorthand such as
  // "GlcNAcβ1-4GlcNAc" or "Neu5Ac" always carries digits, Greek letters or
  // punctuation, so it is never judged here.
  const w = word.replace(/[.,;:!?)"']+$/, "").replace(/^[("']+/, "");
  if (!/^[A-Za-z]+$/.test(w)) return false;
  if (w.length < 8) return false;
  // A run of 4+ capitals right after a lowercase letter ("raRDDXADT",
  // "hiWKYY") does not occur in names or in carbohydrate shorthand.
  if (/[a-z][A-Z]{4,}/.test(w)) return true;
  // 7+ consonants in a row ("zlCVRcxhb") — sugar abbreviations top out at 5
  // ("GalNAcGlcNAc" → "cglcn"), so this is safe for glycan shorthand.
  if (/[bcdfghjklmnpqrstvwxyz]{7,}/i.test(w)) return true;
  if (strict) return false;
  // Names/companies: 3+ lower→upper flips inside one word.
  // "McDonald", "GlycoWorks", "BioGlycoTech" stay under the bar.
  const flips = (w.match(/[a-z][A-Z]/g) ?? []).length;
  return flips >= 3;
}

function hasRandomWord(text: string | undefined): boolean {
  if (!text) return false;
  return text.split(/\s+/).some((w) => looksRandom(w));
}

/** "k.c.s.i.e.f.f@gmail.com" — 4+ single-character segments in the local part. */
function isDotPaddedGmail(email: string | undefined): boolean {
  if (!email) return false;
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!local || !domain) return false;
  if (domain !== "gmail.com" && domain !== "googlemail.com") return false;
  const singles = local.split(".").filter((s) => s.length === 1).length;
  return singles >= 4;
}

export function spamReason(input: GuardInput): string | null {
  const g = input.guard;
  if (!g) return "missing-guard";
  if (g.hp && g.hp.trim() !== "") return "honeypot";
  if (typeof g.t !== "number" || !Number.isFinite(g.t)) return "missing-timing";
  const age = Date.now() - g.t;
  if (age < MIN_FILL_MS) return "too-fast";
  if (age > MAX_FORM_AGE_MS) return "stale-form";
  if (isDotPaddedGmail(input.email)) return "dot-padded-gmail";
  if (input.names?.some(hasRandomWord)) return "gibberish-name";
  const msg = input.message?.trim();
  if (msg && !/\s/.test(msg) && looksRandom(msg, true)) return "gibberish-message";
  return null;
}

export function logBlocked(form: string, reason: string, email?: string) {
  const domain = email?.split("@")[1] ?? "?";
  console.warn(`[spam] blocked ${form} submission: ${reason} (email domain ${domain})`);
}
