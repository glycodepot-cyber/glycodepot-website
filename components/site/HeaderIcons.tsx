"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CartButton } from "./CartButton";
import { QuoteButton } from "./QuoteButton";
import { utilityNav } from "@/lib/content";

export function HeaderIcons() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <HeaderIconContents isLoaded={false} isSignedIn={false} />;
  }

  return <ClerkHeaderIcons />;
}

function ClerkHeaderIcons() {
  const { isSignedIn, isLoaded } = useAuth();

  return <HeaderIconContents isLoaded={isLoaded} isSignedIn={isSignedIn} />;
}

function HeaderIconContents({
  isLoaded,
  isSignedIn,
}: {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
}) {

  return (
    <TooltipProvider delay={300}>
      <>
        {/* Contact CTA — desktop only */}
        <Link
          href="/contact"
          className="hidden items-center rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)] lg:inline-flex"
        >
          Contact
        </Link>

        {/* My Account — icon when signed out, avatar when signed in */}
        {isLoaded && isSignedIn ? (
          <span className="hidden lg:inline-flex items-center">
            <UserButton
              appearance={{
                elements: { avatarBox: "size-9" },
                variables: { colorPrimary: "#1a7a3e" },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link label="Account dashboard" labelIcon={<span aria-hidden>⌂</span>} href="/my-account/dashboard" />
                <UserButton.Link label="Admin dashboard" labelIcon={<span aria-hidden>⚙</span>} href="/admin" />
              </UserButton.MenuItems>
            </UserButton>
          </span>
        ) : (
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href={utilityNav.account.href}
                  aria-label={utilityNav.account.label}
                  className="hidden size-10 items-center justify-center rounded-full text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-brand)] lg:inline-flex"
                />
              }
            >
              <UserRound className="size-5" aria-hidden />
            </TooltipTrigger>
            <TooltipContent side="bottom">My Account</TooltipContent>
          </Tooltip>
        )}

        {/* Quote list */}
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <QuoteButton />
          </TooltipTrigger>
          <TooltipContent side="bottom">Quote List</TooltipContent>
        </Tooltip>

        {/* Cart */}
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <CartButton />
          </TooltipTrigger>
          <TooltipContent side="bottom">Cart</TooltipContent>
        </Tooltip>
      </>
    </TooltipProvider>
  );
}
