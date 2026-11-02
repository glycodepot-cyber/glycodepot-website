# Direct website → GHL sales connection

This connection uses the website's own catalog database and Stripe payment
verification. BysonHub is not called by the direct RFQ path. Enable it only
after validating the target environment and credentials below.

## Configuration

| Server environment variable | Value |
| --- | --- |
| `GHL_DIRECT_ENABLED` | `true` to activate; omit or `false` to retain the legacy path |
| `GHL_API_TOKEN` | Secret token for **GlycoDepot Website Sales Connection** |
| `GHL_LOCATION_ID` | `8WV7PDrONMk3WR8fwyNo` |
| `GHL_PIPELINE_NAME` | `Website Sales` |
| `GHL_API_VERSION` | `v3` (validate against the connected account before activation) |
| `GHL_SYNC_FROM_AT` | Activation timestamp in ISO 8601 UTC; bounds order recovery so old orders are not silently imported |
| `DATABASE_URL` | Existing website catalog/order database; keep secret |
| `CRON_SECRET` | Existing secret; protects `/api/ghl/sync`; missing configuration fails closed |

The private integration needs only `contacts.readonly`, `contacts.write`,
`opportunities.readonly`, and `opportunities.write`. Do not put its token in
source control, a `NEXT_PUBLIC_` variable, a product link, or browser code.
Old quote/contact webhook variables are not needed for the direct sales path;
contact and newsletter forms retain their existing integrations.

## Data and stages

- RFQ submission: validate quantities, resolve authoritative product names,
  SKUs and product URLs from the website database, durably save the request,
  then create a contact and an open opportunity at **New Quote Request**.
- Checkout prepared: preserve the durable website order; create an open
  opportunity at **Awaiting Payment**.
- Verified Stripe payment: update that same opportunity to **Paid & Won**,
  status **won**, with the website order total. A browser success URL and an
  unpaid `checkout.session.completed` event do not prove payment.
- Product snapshots and request/order references are retained in a GHL note,
  with a catalog link. No entire native GHL payment-product import is performed.
- Opportunities use the immutable website request/order UUID in their name.
  Retries search for the exact name and contact; another request by the same
  customer gets another opportunity. Existing contact tags and consent are
  preserved. Retrying an initial event does not reset a manually advanced stage.

## Standard GHL workflows

Use **Opportunity created**, filter pipeline **Website Sales** and stage
**New Quote Request**, then add a task to review the RFQ (due in one day).
Use a separate **Pipeline stage changed** workflow, filter **Website Sales**
and **Paid & Won**, then add a fulfillment review task. Handle paid-first
opportunities with an **Opportunity created** trigger for the same paid stage.
Do not publish customer email/SMS actions as part of connection testing.

## Retry and operations

`website_sales_requests` is a durable outbox with unique source keys, leases,
versions, bounded backoff and recorded CRM IDs. Concurrent workers claim rows
with `FOR UPDATE SKIP LOCKED`. Paid updates increment the version so a worker
processing an earlier pending snapshot cannot accidentally acknowledge them.
Order recovery scans only orders created after `GHL_SYNC_FROM_AT`.

Immediate delivery runs after submissions/payment events. `/api/ghl/sync`
processes at most three records and returns counts only; invoke it with an
`Authorization: Bearer <CRON_SECRET>` header. The second Vercel cron retries
daily at 07:05 UTC (compatible with Hobby scheduling). For faster outage
recovery, configure a more frequent schedule only on a plan that supports it.
Requests remain saved when GHL is unavailable. Provider response bodies and
customer payloads are not logged. HTTP success alone is not acceptance: verify
the actual contact, opportunity, note and workflow task in GHL.

## Verification and activation

1. Run `npm run test:crm`, `npx tsc --noEmit`, and `npm run build`.
2. Install the secret and server configuration on the intended deployment.
3. Confirm pipeline discovery, required stages and API version with the token.
4. Deploy with direct intake enabled to a test environment; submit a clearly
   labeled RFQ. Confirm its exact product lines, single opportunity and task.
5. Use Stripe test mode to verify pending → paid, duplicate webhook delivery,
   and paid-first ordering. Never use a real charge for integration testing.
6. Publish the validated GHL workflows and enable the intended live deployment.

Roll back by setting `GHL_DIRECT_ENABLED=false` and redeploying, or restoring
the prior deployment. Outbox records remain in the database for reconciliation.
Live activation is pending until the token transfer and end-to-end tests pass.
