// Domain types are safe to re-export anywhere.
// Runtime functions live in:
//   - lib/cart/client.ts  → server-only catalog adapter (RSC use)
//   - lib/cart/actions.ts → "use server" actions (client comps can call)
// Import those explicitly to keep server code out of the client bundle.
export * from "./types";
