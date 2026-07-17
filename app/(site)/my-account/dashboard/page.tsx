import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
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
          <AccountDashboard />
        </Container>
      </Section>
    </>
  );
}
