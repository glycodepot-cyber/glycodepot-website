import { timingSafeEqual } from "node:crypto";

export function syncAuthorized(header: string | null, secret: string | undefined): boolean {
  if (!secret?.trim()) return false;
  const supplied = Buffer.from(header ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
