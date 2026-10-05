import type { Metadata } from "next";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { AccountDashboard } from "@/components/site/account/AccountDashboard";

export const metadata: Metadata = {
  title: "My account",
  description: "Track your GlycoDepot orders and manage quote requests.",
  alternates: { canonical: "/my-account/dashboard" },
  robots: { index: false, follow: false },
};

export default async function AccountDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/my-account");

  const user = await currentUser();
  const email = user?.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress
    ?? user?.emailAddresses[0]?.emailAddress;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = Boolean(email && adminEmails.includes(email.toLowerCase()));

  return (
    <>
      <PageHero
        title="My account"
        description="Orders, quote requests, addresses, and profile — all in one place."
        breadcrumbs={[
          { label: "My account", href: "/my-account" },
          { label: "Dashboard" },
        ]}
      />
      <Section spacing="default">
        <Container>
          {isAdmin ? (
            <div className="mb-6 flex justify-end">
              <Link
                href="/admin"
                className="inline-flex rounded-full bg-[var(--color-brand)] px-5 py-3 font-semibold text-white"
              >
                Open Admin Dashboard
              </Link>
            </div>
          ) : null}
          <AccountDashboard />
        </Container>
      </Section>
    </>
  );
}
