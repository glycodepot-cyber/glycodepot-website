import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Keep authentication on the same hostname as the application. Sending users
// through the hosted Account Portal caused the session cookie to be lost when
// returning to the staging subdomain, which produced an endless redirect loop.
export default async function MyAccountPage() {
  const { userId } = await auth();
  if (userId) redirect("/my-account/dashboard");

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <SignIn
        routing="path"
        path="/my-account"
        signUpUrl="/sign-up"
        forceRedirectUrl="/my-account/dashboard"
      />
    </main>
  );
}
