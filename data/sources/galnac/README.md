# GalNAc import, 2026-10-21

Source catalog: Glycogene, GalNAc delivery molecules category, all three pages. 25 GalNAc-containing products were selected; GA-3041 (Cbz-Tris-tripropionic acid) was excluded because the scaffold has no GalNAc residues. NAG25/NAG37 and their precursors are included.

`source-products.json` is internal provenance. Supplier links are not exposed in product descriptions or the storefront. Product images are locally hosted originals; CSS brightness makes the uniform RGB 246 background display white without redrawing the chemical structures. AI-generated redraws were rejected for production.

Public descriptions are original summaries of functional handles, linker families, protection patterns and quote requirements. No stock quantities, purity guarantees, GMP certification or clinical efficacy claims were imported. CAS identifiers follow the selected supplier form; no CAS was assigned when absent. Inconsistent molecular formula / salt-weight statements were not published. In particular, L96 is explicitly named as the TFA salt, CAS 1159408-62-4, rather than conflated with CAS 1159408-61-3.

Background literature:
- Nair et al., 2014, multivalent GalNAc-siRNA delivery, PMID 25434769.
- ASO receptor-binding study, 2017, PMID 28158620.

The admin import requires the existing administrator role. It checks product collisions and inserts one category, 25 products, 75 variants and an import receipt in one database transaction. A repeated application returns without changing existing rows. All prices are null, RFQ is true, and recorded stock is zero; quote requests remain available without inventory. Priced checkout availability is unchanged.
