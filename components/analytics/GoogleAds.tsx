import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/analytics/googleAds";

/** Direct Google Ads routing; do not also configure these conversions in GTM. */
export function GoogleAds() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    // RootLayout renders this component; beforeInteractive is supported there.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="google-ads-init" strategy="beforeInteractive">
      {`(function(){
if(!['glycodepot.com','www.glycodepot.com'].includes(location.hostname))return;
var u=new URL(location.href);
['payment_intent_client_secret','payment_intent','redirect_status'].forEach(function(k){u.searchParams.delete(k)});
if(u.href!==location.href)history.replaceState(history.state,'',u.href);
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){dataLayer.push(arguments)};
gtag('js',new Date());
gtag('config','${GOOGLE_ADS_ID}',{
send_page_view:false,allow_ad_personalization_signals:false,allow_enhanced_conversions:false,
page_location:location.origin+location.pathname,
page_referrer:document.referrer?(new URL(document.referrer).origin+new URL(document.referrer).pathname):''
});
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}';document.head.appendChild(s);
})();`}
    </Script>
  );
}
