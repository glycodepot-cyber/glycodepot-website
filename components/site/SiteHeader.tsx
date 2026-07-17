import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/primitives";
import { TopBar } from "./TopBar";
import { SearchBar } from "./SearchBar";
import { MainNav } from "./MainNav";
import { MobileNav } from "./MobileNav";
import { HeaderIcons } from "./HeaderIcons";
import { HeaderShell } from "./HeaderShell";
import { listCategories } from "@/lib/cart/client";

export async function SiteHeader() {
  const categories = await listCategories();

  return (
    <HeaderShell>
      <TopBar />

      {/* Main bar */}
      <div className="py-3 lg:py-4">
        <Container>
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="shrink-0" aria-label="GlycoDepot home">
              <Image
                src="/Glycodepot_Logo.jpeg"
                alt="GlycoDepot"
                width={1600}
                height={610}
                priority
                className="h-10 w-auto lg:h-12"
                sizes="(min-width: 1024px) 180px, 140px"
              />
            </Link>

            {/* Search — flex-1 on desktop, hidden on mobile (lives in sheet) */}
            <div className="hidden flex-1 lg:block">
              <SearchBar />
            </div>

            <div className="ml-auto flex items-center gap-1 lg:gap-2">
              <HeaderIcons />
              <MobileNav categories={categories} />
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile search row (below logo) */}
      <div className="border-t border-[var(--color-border)] bg-white px-5 py-3 lg:hidden">
        <SearchBar variant="mobile" />
      </div>

      {/* Desktop nav row */}
      <div className="hidden border-t border-[var(--color-border)] lg:block">
        <Container>
          <div className="flex items-center justify-center py-2">
            <MainNav categories={categories} />
          </div>
        </Container>
      </div>
    </HeaderShell>
  );
}
