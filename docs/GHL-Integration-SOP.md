# GHL Integration SOP — Milestones 1A & 1B

Standard operating procedure for the GoHighLevel + Google Ads work in the
revised SOW (Rev. 1). Covers everything that lives **outside this codebase** —
GHL, GTM, Google Ads, n8n — plus the exact contract the website already emits.

> **Split of work.** The website (this repo) emits conversion events and posts a
> structured webhook. Everything else is dashboard configuration. This document
> is the build guide for that dashboard side and the required per-automation SOP
> (SOW §7).

---

## 0. Blockers & dependencies (read first)

| # | Blocker | Owner | Why it matters |
|---|---------|-------|----------------|
| B1 | **BysonHub must fire outbound webhooks** on new RFQ + every status change. Its partner API currently exposes no webhook capability (`/webhooks`, `/quote-requests`, `/orders`, `/statuses` all 404). | **Nihar / BysonHub** | The whole of Milestone 1A's status-sync (§3.3) has nothing to receive until this exists. The website's own RFQ submit posts to GHL, but per-status transitions (Under Review → Quote Sent → …) can only come from BysonHub. |
| B2 | GHL inbound webhook URLs must be created and pasted into Vercel env (below). | You (GHL) + deploy | Until set, the site logs the payload and no-ops — safe, but nothing reaches GHL. |
| B3 | GTM container ID. | You (GTM) | Until `NEXT_PUBLIC_GTM_ID` is set, no tags fire. |
| B4 | Vercel **Pro** plan. Hobby forbids commercial use and caps deploys/day. | Client | Compliance + headroom once webhooks drive frequent rebuilds. |

---

## 1. Environment variables (activate the website side)

Set in Vercel → Project → Settings → Environment Variables (Production), then
redeploy. All are read at runtime except `NEXT_PUBLIC_GTM_ID` (build-time).

| Variable | Purpose | Source |
|----------|---------|--------|
| `NEXT_PUBLIC_GTM_ID` | GTM container, e.g. `GTM-XXXXXXX` | GTM dashboard |
| `GHL_QUOTE_WEBHOOK_URL` | Receives RFQ submissions from the site | GHL inbound webhook |
| `GHL_CONTACT_WEBHOOK_URL` | Contact-form submissions | GHL inbound webhook |
| `GHL_NEWSLETTER_WEBHOOK_URL` | Newsletter signups | GHL inbound webhook |

Absent = graceful no-op. Nothing breaks; the feature simply stays dark.

---

## 2. Webhook contract — what the site POSTs to GHL

On RFQ submit, the site posts JSON to `GHL_QUOTE_WEBHOOK_URL`. These **top-level
keys** are what you map to GHL custom fields (§3.2). Map by these exact keys:

| Payload key | GHL custom field (§3.2) | Notes |
|-------------|--------------------------|-------|
| `name`, `email` | Contact name / email | Standard contact fields |
| `company`, `phone` | Company / Phone | |
| `product_category_interest` | Product category interest | Array of group names: `Glycochemistry` / `Glycobiology` / `Glyco-analysis` |
| `product_details` | Product details | Formatted line items (`2× Name (variant)`) |
| `bh_quotation_id` | BH Quotation ID | BysonHub order/quote id — the cross-ref key |
| `lead_source` | Lead source | Derived: Google Ads / LinkedIn / Organic / Referral / Website submission / Direct |
| `google_ads_campaign` | Google Ads campaign | from `utm_campaign` (first-touch) |
| `google_ads_ad_group` | Google Ads ad group | from `utm_content` |
| `landing_page_url` | Landing page URL | first-touch landing path |
| `gclid` | (store on contact) | Google click id, for offline conversion import |
| `message` | (activity note) | Human-readable summary |

> The **status-change** webhooks (Under Review, Quote Sent, …) come from
> **BysonHub** (blocker B1), not the site. Their payload shape is Nihar's to
> define; agree it to also carry `bh_quotation_id` so GHL can match the
> opportunity, plus `quote_number` and `quoted_value` at the Quote Sent event.

---

## 3. GHL — RFQ Pipeline (§3.1)

Create pipeline **"RFQ Pipeline"** with these 7 stages, named exactly:

1. New RFQ
2. Under Review
3. Quote Sent
4. Negotiation
5. Quotation Accepted
6. Paid & Won
7. Abandoned

Opportunity card shows: contact + company, product category, BH Quotation ID,
estimated value, lead source, date submitted.

### 3.1 Custom fields (§3.2) — create exactly these, no more

| Field | Type |
|-------|------|
| Product category interest | Dropdown (multi): Glycochemistry, Glycobiology, Glyco-analysis |
| Product details | Long text |
| BH Quotation ID | Text |
| Lead source | Dropdown: Website submission, Google Ads, Organic, LinkedIn, Referral, Direct |
| Google Ads campaign | Text |
| Google Ads ad group | Text |
| Landing page URL | URL |
| Quote number | Text |
| Quoted value (USD) | Currency |
| Follow-up count | Number |
| Assigned sales rep | Dropdown (team list — client to provide) |

**Do NOT** recreate the obsolete per-SKU fields (specific SKU, quantity, purity,
application, budget, timeline, custom-synthesis, regulatory) — those are owned by
BysonHub now (§3.2).

### 3.2 Status → stage mapping (§3.3)

| BysonHub status | GHL stage |
|-----------------|-----------|
| New Enquiry / RFQ Received | New RFQ |
| Under Review | Under Review |
| Quotation Sent | Quote Sent |
| Negotiation | Negotiation |
| Accepted | Quotation Accepted |
| Completed / Order Paid | Paid & Won |
| _(no BH status — GHL inactivity logic)_ | Abandoned |

Direct-order (Flow B) entries with no RFQ stages: create opportunity, land
directly at **Paid & Won** once BysonHub marks the order Paid.

---

## 4. GHL — Automations (§3.4)

**Ownership boundary (non-negotiable, SOW §7):** BysonHub owns ALL
quotation/PDF/payment-link/invoice delivery. No GHL automation may send a
quotation, payment link, or invoice — that would duplicate client comms.

| Trigger (BH status) | GHL actions | Customer email? |
|---------------------|-------------|-----------------|
| **New RFQ** | create/update contact + opportunity at New RFQ; map all §3.2 fields; tag `RFQ-New` + `Cat-<Category>`; rep task "Review new RFQ" (due 4h) | **No** (BH sends confirmation) |
| **Under Review** | swap tag → `Under-Review`; Day 1 internal reminder; Day 2 escalate to rep + manager | No |
| **Quote Sent** | set Quote sent date; sync Quote number + Quoted value; tag → `Quote-Sent`; Day 2 customer nudge ("did our quote cover your needs?"); Day 3 second nudge + datasheet link; increment Follow-up count; rep reminder if stalled | Yes — nudges only, never a re-send |
| **Negotiation** | tag → `Negotiation`; **pause** nudges; rep task; reminder if no move in 5 business days | No |
| **Quotation Accepted** | tag → `Quotation-Accepted`; **stop** all nudges; notify rep "awaiting payment" + monitor task | No (BH sends payment link) |
| **No reply after Quote Sent Day 3** _(GHL inactivity)_ | auto-move to Abandoned; tag `Nurture-Abandoned`; enrol in monthly nurture; **push to Google Ads Customer Match** (§4.2); 90-day rep task | Nurture only |
| **Paid & Won** | stop all sequences; tag `Customer` + `Closed-Won`; post-purchase nurture Day 3 / 14 / 30; **send offline conversion to Google Ads** (§4.3) | Nurture only — **no invoice** (BH owns it) |

### 4.1 Backup form (§3.3.1)
Build a lightweight native GHL form (contact + product category only) for manual
lead logging by the team. **Not embedded on the website.** Not the primary path.

---

## 5. Milestone 1B — Google Tag Manager (§4.1)

The website already pushes these 5 events to `dataLayer`. In GTM, create a
**Custom Event trigger** per event name, then the tags below.

| dataLayer event | Fires when | GTM tag → destination |
|-----------------|-----------|------------------------|
| `RFQ_Submit` | RFQ cart submitted | Google Ads conversion + GA4 event |
| `Purchase` | order confirmed on-site | Google Ads conversion + GA4 event |
| `High_Intent_Visit` | >60s on a product page | GA4 event (audience) |
| `Add_To_Cart` | item added to cart/quote | GA4 event (micro-conversion) |
| `Quote_Page_View` | `/quote-request` viewed | GA4 event (micro-conversion) |

Extra keys ride on each event (e.g. `value`, `currency`, `transaction_id`,
`product_categories`, `bh_quote_id`) — wire them as GTM Data Layer Variables and
pass into the GA4 / Google Ads tags.

**Setup steps:**
1. Create a GTM container; put its ID in `NEXT_PUBLIC_GTM_ID`; redeploy.
2. Add GA4 Configuration tag (Measurement ID) on All Pages.
3. Add the 5 custom-event triggers + tags above.
4. Link Google Ads; create conversion actions; map `RFQ_Submit` and `Purchase`.
5. Verify in **GTM Preview** + **GA4 Realtime** (all 5 should appear).

> CSP already allowlists `googletagmanager.com`, `google-analytics.com`, and
> the DoubleClick/Google Ads domains (see `next.config.ts`). No CSP change
> needed for standard GA4 + Google Ads tags. If you add a tag from another
> vendor, add its host to the CSP or it will be blocked.

### 5.1 UTM capture (already built)
First-touch `utm_*` + `gclid` are captured on landing and persisted in
`localStorage` (`lib/analytics/utm.ts`), then forwarded on the RFQ webhook
(§2). No GTM work needed for the GHL field population — it's server-side.

---

## 6. Google Ads — Customer Match (§4.2)

- Audience name: **`GHL-Abandoned-RFQ`**.
- Push contact email when opportunity hits **Abandoned** (GHL native Google Ads
  integration or n8n → Customer Match API).
- Auto-remove on conversion (stage = Paid & Won).

## 7. Google Ads — Offline conversion import (§4.3)

- On **Paid & Won**: send closed value back to Google Ads as an offline
  conversion so Smart Bidding optimises for revenue, not just form fills.
- Path: GHL webhook → n8n → Google Ads Conversions API.
- Map: contact email (or `gclid`) + order value + timestamp.
- Conversion action name: **`GHL_Closed_Won`**.
- This is also how **paid Stripe orders** get their Purchase conversion — the
  browser leaves our domain for Stripe, so the on-site `Purchase` pixel only
  covers on-site confirmations; paid orders are attributed here.

---

## 8. Deliverable acceptance (SOW §6) — quick map

- Website side (this repo): GTM install, 5 dataLayer events, UTM capture,
  structured RFQ webhook — **done, env-gated.**
- GHL pipeline, fields, mapping, 12 automations, backup form — **dashboard, per
  §3–4 above.**
- GTM tags, conversions, Customer Match, offline import, GA4 goals — **dashboard,
  per §5–7 above.**
- BysonHub status webhooks — **blocked on Nihar (B1).**
