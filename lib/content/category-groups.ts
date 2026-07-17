import type { Category } from "@/lib/cart/types";

/**
 * Three-tier category hierarchy restored from the WP site.
 * BysonHub returns a flat list of ~50 categories; we group them visually
 * into the same three top-level buckets glycoscientists are used to:
 *
 *   Glycochemistry  — synthesis, building blocks, chemical compounds
 *   Glycobiology    — enzymes, lectins, glycans, biological tools
 *   Glycoanalysis   — analytical, diagnostic, identification
 *
 * Anything that doesn't map cleanly falls into "Other".
 *
 * NOTE: BysonHub also has a leaf category literally called "Glycochemistry"
 * (80 products), "Glycobiology" (11) and "Glycoanalysis" (217). We surface
 * them inside their own group AND keep the group header pointing at the
 * group's "All products" view, so users can browse either.
 */

export const GROUP_GLYCOCHEMISTRY = "glycochemistry";
export const GROUP_GLYCOBIOLOGY = "glycobiology";
export const GROUP_GLYCOANALYSIS = "glycoanalysis";
export const GROUP_OTHER = "other-products";

export interface CategoryGroup {
  slug: string;
  name: string;
  description: string;
  categorySlugs: string[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    slug: GROUP_GLYCOCHEMISTRY,
    name: "Glycochemistry",
    description: "Building blocks, sugar nucleotides, ADC linkers, monosaccharides and more.",
    categorySlugs: [
      "glycochemistry",
      "building-blocks",
      "monosaccharides",
      "disaccharides",
      "sugar-nucleotides",
      "adc-linkers",
      "aminophenyl",
      "6s-series",
      "2s-series",
      "2s-6s-series",
      "3s-series",
      "6s-idoa-series",
      "6-sulfated-oligomers",
      "2-sulfated-oligomers",
      "automated-glycan-assembly",
      "pharmaceutical-raw-materials",
      "isotope-labelled-compounds",
      "chondroitinsulfate",
      "detergents",
      "alkyl-maltoside",
      "alkyl-b-d-glucopyranoside",
      "alkyl-1-thio-glycosides",
    ],
  },
  {
    slug: GROUP_GLYCOBIOLOGY,
    name: "Glycobiology",
    description: "Enzymes, lectins, GAGs, N-glycans and other biological tools.",
    categorySlugs: [
      "glycobiology",
      "n-glycans",
      "n-glycans-bulk-supply",
      "glycoenzymes",
      "glycosidases",
      "glycosyltransferase",
      "sugar-nucleotide-synthase",
      "hydrolase",
      "enzymes",
      "enzyme-expressed-in-eukaryote",
      "glycosaminoglycans-gags",
      "human-milk-oligosaccharides",
      "marine-oligos",
      "oligosaccharides",
      "blood-group-glycans",
      "glycolipid-oligosaccharides",
      "ganglioside-glycans",
      "globo-series",
      "malt-oligosaccharides",
      "miscellaneous-glycans",
      "free-lectins",
      "biotin-labelled-lectins",
      "labelled-lectins",
      "fluorescein",
    ],
  },
  {
    slug: GROUP_GLYCOANALYSIS,
    name: "Glycoanalysis",
    description: "Analytical standards, diagnostic reagents and reference materials.",
    categorySlugs: ["glycoanalysis", "diagnostics"],
  },
  {
    slug: GROUP_OTHER,
    name: "Other",
    description: "Specialty products that don't fit elsewhere.",
    categorySlugs: ["other"],
  },
];

const slugToGroup: Record<string, CategoryGroup> = {};
for (const g of categoryGroups) {
  for (const cs of g.categorySlugs) slugToGroup[cs] = g;
}

export function findGroupForCategory(
  categorySlug: string | undefined | null,
): CategoryGroup | null {
  if (!categorySlug) return null;
  return slugToGroup[categorySlug] ?? null;
}

export interface CategoryWithGroup extends Category {
  groupSlug: string | null;
  groupName: string | null;
}

/**
 * Sort the flat category list into the hierarchical groups they belong to.
 * Categories not mapped to any group land in a synthetic "Ungrouped" bucket
 * so we don't silently lose them when BysonHub adds a new category we
 * haven't classified yet.
 */
export interface GroupedCategories {
  group: CategoryGroup;
  categories: Category[];
}

export function groupCategories(categories: Category[]): GroupedCategories[] {
  const byGroup = new Map<string, Category[]>();
  for (const g of categoryGroups) byGroup.set(g.slug, []);
  byGroup.set("__ungrouped__", []);

  for (const cat of categories) {
    const group = findGroupForCategory(cat.slug);
    const bucket = group ? byGroup.get(group.slug)! : byGroup.get("__ungrouped__")!;
    bucket.push(cat);
  }

  // Sort categories inside each group by product count desc, then name.
  for (const list of byGroup.values()) {
    list.sort((a, b) => {
      const c = (b.productCount ?? 0) - (a.productCount ?? 0);
      return c !== 0 ? c : a.name.localeCompare(b.name);
    });
  }

  const result: GroupedCategories[] = [];
  for (const g of categoryGroups) {
    const cats = byGroup.get(g.slug);
    if (cats && cats.length) result.push({ group: g, categories: cats });
  }
  // Append ungrouped categories under the Other group so nothing is lost.
  const ungrouped = byGroup.get("__ungrouped__") ?? [];
  if (ungrouped.length) {
    const otherGroup = categoryGroups.find((g) => g.slug === GROUP_OTHER)!;
    const existing = result.find((r) => r.group.slug === GROUP_OTHER);
    if (existing) existing.categories.push(...ungrouped);
    else result.push({ group: otherGroup, categories: ungrouped });
  }
  return result;
}
