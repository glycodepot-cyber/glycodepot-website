import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/primitives";
import { site } from "@/lib/content";

export function TopBar() {
  return (
    <div className="hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] py-2 lg:block">
      <Container>
        <div className="flex items-center justify-end gap-6 text-[13px] text-[var(--color-muted-foreground)]">
          <a
            href={site.contact.phoneHref}
            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-brand)]"
          >
            <Phone className="size-3.5" aria-hidden />
            <span className="font-medium tracking-tight">{site.contact.phone}</span>
          </a>
          <span className="h-3 w-px bg-[var(--color-border-strong)]" aria-hidden />
          <a
            href={site.contact.emailHref}
            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-brand)]"
          >
            <Mail className="size-3.5" aria-hidden />
            <span className="font-medium tracking-tight">{site.contact.email}</span>
          </a>
        </div>
      </Container>
    </div>
  );
}
