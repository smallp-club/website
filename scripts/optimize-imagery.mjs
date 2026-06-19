#!/usr/bin/env node
/**
 * Imagery-Optimizer für small p club.
 *
 * Liest jedes Bild aus `public/imagery/_source/` und erzeugt daraus
 * ein vollständiges responsives WebP-Set für alle Viewport-Breiten.
 *
 * **Konvention:**
 *  - Source-Ordner:   `public/imagery/_source/<slot>.<ext>`  (png/jpg/jpeg)
 *  - Output-Ordner:   `public/imagery/<slot>-<width>w.webp`
 *  - Slot-Namen:      kebab-case, semantisch nach Section + Funktion
 *                     (`hero-anchor`, `stats-anchor`, `bewegung-signal`)
 *
 * **Größen:** 480 · 768 · 1280 · 1920 — deckt Mobile bis 4K-DPR-2 ab.
 * Source-Bilder werden nie hochskaliert, nur runter (`withoutEnlargement`).
 *
 * **Quality:** WebP 78 — sweet spot zwischen Bildqualität und Dateigröße.
 *
 * **Ausführen:**
 *   node scripts/optimize-imagery.mjs              # alle source-bilder
 *   node scripts/optimize-imagery.mjs hero-anchor  # nur ein slot
 *
 * Bei neuem Source-Bild: in `_source/` ablegen, script ausführen,
 * dann im JSX als `<picture>` mit srcset + sizes einbinden.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'public/imagery/_source');
const OUTPUT_DIR = path.join(ROOT, 'public/imagery');
const WIDTHS = [480, 768, 1280, 1920];
const QUALITY = 78;

const SUPPORTED = /\.(png|jpe?g)$/i;

async function processFile(sourcePath, slot) {
  const meta = await sharp(sourcePath).metadata();
  const sourceWidth = meta.width ?? 0;

  for (const width of WIDTHS) {
    const outPath = path.join(OUTPUT_DIR, `${slot}-${width}w.webp`);
    const skip = sourceWidth > 0 && width > sourceWidth;

    if (skip) {
      console.log(`–  ${slot}-${width}w.webp   (source nur ${sourceWidth}w, überspringe)`);
      continue;
    }

    await sharp(sourcePath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outPath);

    const stat = await fs.stat(outPath);
    const kb = (stat.size / 1024).toFixed(1);
    console.log(`✓  ${slot}-${width}w.webp   ${kb} kB`);
  }
}

async function main() {
  const arg = process.argv[2];

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(SOURCE_DIR, { recursive: true });

  const files = await fs.readdir(SOURCE_DIR);
  const targets = files.filter((f) => SUPPORTED.test(f));

  if (targets.length === 0) {
    console.log('Keine source-bilder gefunden in public/imagery/_source/');
    return;
  }

  const slotsToProcess = arg
    ? targets.filter((f) => path.parse(f).name === arg)
    : targets;

  if (slotsToProcess.length === 0) {
    console.log(`Kein source mit slot "${arg}" gefunden.`);
    process.exit(1);
  }

  for (const file of slotsToProcess) {
    const slot = path.parse(file).name;
    const sourcePath = path.join(SOURCE_DIR, file);
    console.log(`\n→ ${slot}`);
    await processFile(sourcePath, slot);
  }

  console.log('\nfertig.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
