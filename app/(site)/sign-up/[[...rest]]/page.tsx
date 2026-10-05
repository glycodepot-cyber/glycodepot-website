import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { userId } = await auth();
  if (userId) redirect("/my-account/dashboard");

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/my-account"
        forceRedirectUrl="/my-account/dashboard"
      />
    </main>
  );
}
