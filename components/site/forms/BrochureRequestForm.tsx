import { MetisFormEmbed } from "./MetisFormEmbed";

/**
 * Embeds the MetisSuite form "GlycoDepot - Glycosylation Brochure Request"
 * (form id DrCO). Submissions land as contacts in the GlycoDepot sub-account,
 * where an automation emails the brochure and runs the follow-up sequence.
 */
export function BrochureRequestForm() {
  return (
    <MetisFormEmbed
      formId="DrCO"
      fallbackSubject="Enzymatic glycosylation brochure"
      fallbackLabel="request form"
    />
  );
}
