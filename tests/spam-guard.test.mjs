import { test } from "node:test";
import assert from "node:assert/strict";
import { spamReason } from "../lib/spam/guard.ts";

const ok = () => ({ hp: "", t: Date.now() - 60_000 });

const spam = {
  "real RFQ spam (Nov 2026)": { email: "k.c.s.i.e.f.f@gmail.com", names: ["YonccviNLYuFKuXBSmzf SNihiWKYYhgypiaiw", "Uhgaluuhmd LLC"], message: "TYvfyraRDDXADTgENjLndALT" },
  "gibberish name, clean email": { email: "x@foo.com", names: ["YonccviNLYuFKuXBSmzf SNihiWKYYhgypiaiw"] },
  "gibberish in second word": { email: "a@b.com", names: ["Ann YonccviNLYuFKuXBSmzf"] },
  "gibberish one-word message": { email: "x@foo.com", names: ["Ann Lee"], message: "TYvfyraRDDXADTgENjLndALT" },
};
const real = {
  "Max Planck order": { email: "e.settels@mpikg.mpg.de", names: ["Eva Settels", "Max Planck Institute of Colloids and Interfaces", "Potsdam-Golm"], message: "30 g of 4-Methylphenyl 3,6-di-O-benzyl-2-deoxy-2-[(2,2,2-trichloroacetyl)amino]-4-O-Fmoc-1-thio-β-D-glucopyranoside" },
  "Mc/Mac names": { email: "j.mcdonald@gmail.com", names: ["Jamie McDonald", "MacKenzie BioSciences LLC", "DeKalb"] },
  "camel-case companies": { email: "a@b.com", names: ["Li Wei", "GlycoWorks BioPharma", "BioGlycoTech Inc", "AstraZeneca"] },
  "dotted but normal gmail": { email: "s.k.nair@gmail.com", names: ["Shukkoor Kondengaden"] },
  "all caps": { email: "a@b.com", names: ["ANN LEE", "NIH NCATS", "BETHESDA"] },
  "glycan shorthand messages": { email: "a@b.com", names: ["Ann"], message: "STolGlcNAcFmoc" },
  "glycan linkage": { email: "a@b.com", names: ["Ann"], message: "GlcNAcβ1-4GlcNAc" },
  "SMILES": { email: "a@b.com", names: ["Ann"], message: "CC(=O)N[C@@H]1[C@@H](O)[C@H](O)[C@@H](CO)O[C@H]1O" },
};

for (const [name, input] of Object.entries(spam))
  test(`blocks: ${name}`, () => assert.ok(spamReason({ guard: ok(), ...input })));
for (const [name, input] of Object.entries(real))
  test(`allows: ${name}`, () => assert.equal(spamReason({ guard: ok(), ...input }), null));

test("blocks filled honeypot", () => assert.equal(spamReason({ guard: { hp: "http://x", t: Date.now() - 60_000 }, email: "a@b.com" }), "honeypot"));
test("blocks submits under 3s", () => assert.equal(spamReason({ guard: { hp: "", t: Date.now() - 500 }, email: "a@b.com" }), "too-fast"));
test("blocks replayed action with no guard", () => assert.equal(spamReason({ email: "a@b.com" }), "missing-guard"));
