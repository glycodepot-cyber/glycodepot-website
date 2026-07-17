import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/site-url";

// Clerk's dashboard has SignIn/SignUp configured to run on the hosted
// Account Portal (accounts.<domain>), not embedded in-app — so send
// unauthenticated visitors there directly instead of trying to render
// <SignIn> on this page. Avoids the embedded-routing/OAuth-callback
// complexity entirely; Clerk's own domain already has valid DNS/SSL/CSP.
export default async function MyAccountPage() {
  const { userId } = await auth();
  if (userId) redirect("/my-account/dashboard");

  const returnUrl = `${SITE_URL}/my-account/dashboard`;
  redirect(
    `https://accounts.glycodepot.com/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`,
  );
}
