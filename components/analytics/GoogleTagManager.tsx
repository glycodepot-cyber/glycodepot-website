import Script from "next/script";

/**
 * Google Tag Manager loader (SOW §4.1).
 *
 * Env-gated on NEXT_PUBLIC_GTM_ID — renders nothing until the client provides
 * a container ID, so this is safe to ship before GTM is set up. Once the ID is
 * present, the standard GTM snippet loads and all `dataLayer` events emitted by
 * lib/analytics/dataLayer.ts flow into whatever tags marketing configures in
 * the GTM dashboard (GA4, Google Ads conversions, etc.).
 *
 * NOTE: googletagmanager.com must be allowlisted in the CSP (next.config.ts),
 * or the container is blocked the same way Clerk's scripts were.
 */
export function GoogleTagManager() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

/** The <noscript> GTM fallback — belongs immediately after <body> opens. */
export function GoogleTagManagerNoScript() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="gtm"
      />
    </noscript>
  );
}
