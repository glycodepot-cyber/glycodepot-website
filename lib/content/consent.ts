/**
 * The exact wording shown beside each consent tick box.
 *
 * These live here, not in `lib/cart/actions.ts`, because that file is a
 * `"use server"` module and may only export async functions. They are needed
 * in two places at once — rendered next to the checkbox, and stored alongside
 * the signup — and both must be the same string: GDPR Art. 7(1) puts the
 * burden of demonstrating consent on us, which means being able to show what
 * the person actually agreed to, not a paraphrase of it.
 *
 * Changing the wording is a substantive change. Consent already recorded was
 * given to the old wording, so edit with that in mind.
 */

export const NEWSLETTER_CONSENT_TEXT =
  "I agree to receive glycoscience updates and product announcements from GlycoDepot by email, and I understand I can unsubscribe at any time.";

export const CONTACT_MARKETING_CONSENT_TEXT =
  "I'd also like to receive occasional glycoscience updates and product announcements from GlycoDepot by email.";
