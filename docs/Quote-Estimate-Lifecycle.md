# Website quote to estimate lifecycle

## Implemented preparation

Quote intake now snapshots separate billing and shipping addresses, selected
product/variant identifiers, SKU, pack name, quantity, catalog unit price,
product URL and dry-ice flag from the authoritative website catalog.

The draft-estimate worker is gated by `GHL_ESTIMATES_ENABLED` and an explicit
`GHL_ESTIMATES_FROM_AT` activation timestamp. It processes only new structured
quotes with confirmed CRM contact/opportunity IDs. A durable request mapping,
leases, backoff, and exact request-name lookup protect retries. Existing
estimates are returned without overwriting a sales rep's price edits.

Estimate creation omits send instructions and recurring schedules. The
estimate is an unsent draft. Billing populates the estimate address; shipping
is preserved separately in metadata and notes. Catalog prices are editable;
items without a price are flagged for review. The sales rep must review price,
shipping, tax, availability, dates and terms before using GHL's Send action.
Auto-invoice and direct-payment options are included for acceptance.

## Prepared policy, not yet scheduled

The tested policy starts the quote clock at the first actual send, not RFQ
submission or draft creation. Follow-ups are on days 2, 7, 14 and 28. Closing
as lost requires day 35 or later and at least seven days since the last actual
follow-up. Outage recovery sends one latest due reminder rather than a burst
of all missed messages. Drafts, replies, pauses and manually closed
opportunities stop follow-ups. Accepted/invoiced estimates leave the quote
sequence; declined estimates leave it as lost.

Payment reminders are proposed for days 2, 7 and 14 after invoice delivery.
Processing payments wait; partial payments remain unpaid. Only verified live
paid invoices can start fulfillment. Actual status normalization, reply
detection, scheduling, invoice reconciliation and order creation are pending
live API validation; the pure policy does not send messages itself.

## Remaining integration work

- Expand the location private integration to estimate read/write and invoice
  read/write permissions, then verify the protected estimate access check.
- Validate draft creation with a marked test RFQ, including native price edits
  and draft retry behavior. Enable the gate only after validation.
- Confirm GHL payment-email sending authentication and reply routing. Website
  Resend authentication does not authenticate the separate GHL email service.
- Connect native estimate events to follow-ups and acceptance/invoice handling,
  stopping on acceptance, decline, payment, reply or manual pause.
- Reconcile a verified paid invoice into one fulfillment order using final
  approved invoice items and the retained shipping address.
- Confirm a shipping-provider account and configure a manual label action.
  Weight, dimensions, carrier, service, dry ice and customs details must be
  reviewed by staff. Labels must not be bought automatically on payment.

Native GHL invoice payment uses the location's existing payment processor;
website Stripe checkout is a separate flow. Do not infer invoice payment from
a browser success page or create a second payment collection for an invoice.

## Validation

`npm run test:crm` covers structured billing/shipping mapping, cent conversion,
unsent drafts, draft retry reuse, generic provider failures, quote follow-up
dates, closure timing, terminal events and live paid versus partial/processing
payment policy. Live API checks and full end-to-end acceptance/payment/label
tests remain required before activating the full lifecycle.
