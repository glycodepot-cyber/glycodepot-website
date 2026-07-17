import { Container, Section, SectionHeading } from "@/components/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/content";

export function FaqAccordion() {
  return (
    <Section>
      <Container width="narrow">
        <SectionHeading
          title="Frequently Asked Questions"
          align="center"
          className="mx-auto"
        />
        <Accordion className="mt-12 w-full">
          {faqs.map((f, i) => {
            const id = `faq-${i + 1}`;
            return (
              <AccordionItem
                key={id}
                value={id}
                className="border-b border-[var(--color-border)] last:border-b-0"
              >
                <AccordionTrigger
                  id={id}
                  className="py-5 text-left text-[16px] font-semibold text-[var(--color-foreground)]"
                >
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Container>
    </Section>
  );
}
