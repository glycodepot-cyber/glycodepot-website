"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Mail, Menu, Phone, UserRound } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";
import { mainNav, site, utilityNav } from "@/lib/content";
import type { Category } from "@/lib/cart";
import { groupCategories } from "@/lib/content/category-groups";

interface MobileNavProps {
  categories: Category[];
}

export function MobileNav({ categories }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="lg:hidden"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[88vw] max-w-[400px] gap-0 bg-white p-0 sm:max-w-[400px]"
      >
        <SheetHeader className="border-b border-[var(--color-border)] p-5">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block"
            aria-label="GlycoDepot home"
          >
            <Image
              src="/Glycodepot_Logo.jpeg"
              alt="GlycoDepot"
              width={1600}
              height={610}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-[var(--color-border)] p-5">
            <SearchBar variant="mobile" />
          </div>

          <nav aria-label="Mobile primary" className="p-2">
            <ul className="flex flex-col">
              {mainNav.map((item) => {
                const isProducts = item.href === "/products";
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                if (isProducts) {
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => setProductsOpen((v) => !v)}
                        aria-expanded={productsOpen}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-3 text-left text-[15px] font-medium",
                          isActive
                            ? "text-[var(--color-brand)]"
                            : "text-[var(--color-foreground)]",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            productsOpen && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                      {productsOpen ? (
                        <div className="mb-1 ml-3 border-l border-[var(--color-border)] pl-3">
                          <Link
                            href="/products"
                            onClick={() => setOpen(false)}
                            className="block rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-semibold text-[var(--color-brand)] hover:bg-[var(--color-surface)]"
                          >
                            All products →
                          </Link>
                          {groupCategories(categories).map(
                            ({ group, categories: groupCats }) => {
                              const totalCount = groupCats.reduce(
                                (n, c) => n + (c.productCount ?? 0),
                                0,
                              );
                              return (
                                <div key={group.slug} className="mt-3">
                                  <Link
                                    href={`/products?group=${group.slug}`}
                                    onClick={() => setOpen(false)}
                                    className="flex items-baseline justify-between gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] font-bold uppercase tracking-wider text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
                                  >
                                    {group.name}
                                    <span className="text-[11px] font-normal text-[var(--color-muted)]">
                                      {totalCount}
                                    </span>
                                  </Link>
                                  <ul className="mt-0.5">
                                    {groupCats.map((c) => (
                                      <li key={c.id}>
                                        <Link
                                          href={`/products/${c.slug}`}
                                          onClick={() => setOpen(false)}
                                          className="flex items-baseline justify-between gap-2 rounded-[var(--radius-sm)] px-3 py-1.5 text-[13px] text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                                        >
                                          <span className="line-clamp-1">
                                            {c.name}
                                          </span>
                                          {typeof c.productCount === "number" ? (
                                            <span className="shrink-0 text-[11px] text-[var(--color-muted)]">
                                              {c.productCount}
                                            </span>
                                          ) : null}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            },
                          )}
                        </div>
                      ) : null}
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-[var(--radius-md)] px-3 py-3 text-[15px] font-medium",
                        isActive
                          ? "text-[var(--color-brand)]"
                          : "text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[var(--color-border)] p-5">
            <SheetClose
              render={
                <Link
                  href={utilityNav.account.href}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-brand-soft)]"
                />
              }
            >
              <UserRound className="size-4 text-[var(--color-brand)]" />
              My account
            </SheetClose>
          </div>

          {/* Contact CTA */}
          <div className="px-5 pb-4">
            <SheetClose
              render={
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center rounded-full bg-[var(--color-brand)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)]"
                />
              }
            >
              Contact Us
            </SheetClose>
          </div>

          <div className="space-y-3 p-5 pt-2">
            <a
              href={site.contact.phoneHref}
              className="flex items-center gap-3 text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-brand)]"
            >
              <Phone className="size-3.5" aria-hidden /> {site.contact.phone}
            </a>
            <a
              href={site.contact.emailHref}
              className="flex items-center gap-3 text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-brand)]"
            >
              <Mail className="size-3.5" aria-hidden /> {site.contact.email}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
