#!/usr/bin/env node
/**
 * Favicon-Set-Generator für small p club.
 *
 * Nimmt die offizielle Bildmarke (`public/brand/smallpclub-mark-deep.svg`),
 * platziert sie zentriert auf Off-White-Square mit Padding und rendert sie
 * in allen benötigten Größen für Browser-Tabs, iOS Touch-Icons und
 * Android-Manifest.
 *
 * Convention (Next.js 14+ App Router):
 *  - `src/app/icon.png`        — Default Browser-Tab (32×32)
 *  - `src/app/apple-icon.png`  — iOS Touch-Icon (180×180)
 *  - `src/app/icon.svg`        — Vektor-Favicon (Chrome/Firefox/Safari modern)
 *  - `public/icons/*.png`      — Android-Manifest 192 + 512
 *  - `src/app/favicon.ico`     — Legacy IE / Safari Pinned Tab
 *
 * Nach Änderung der Bildmarke einfach erneut ausführen:
 *   node scripts/generate-favicons.mjs
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC_SVG = path.join(ROOT, 'public/brand/smallpclub-mark-deep.svg');

const OFFWHITE = { r: 247, g: 246, b: 242, alpha: 1 }; // --spc-offwhite #F7F6F2
const PADDING_RATIO = 0.18; // Bildmarke füllt ~64% des Quadrats

/** Zielgrößen + Pfade. */
const TARGETS = [
  { path: 'src/app/icon.png', size: 32 },
  { path: 'src/app/apple-icon.png', size: 180 },
  { path: 'public/icons/icon-192.png', size: 192 },
  { path: 'public/icons/icon-512.png', size: 512 },
  { path: 'public/icons/maskable-512.png', size: 512, paddingRatio: 0.25 }, // Android Maskable: 25% Safe-Zone
];

async function renderSquare(srcBuffer, size, paddingRatio = PADDING_RATIO) {
  const padding = Math.round(size * paddingRatio);
  const innerSize = size - padding * 2;

  // Bildmarke transparent rendern, dann auf Off-White-Canvas composit.
  const inner = await sharp(srcBuffer, { density: 300 })
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: OFFWHITE,
    },
  })
    .composite([{ input: inner, top: padding, left: padding }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const srcBuffer = await fs.readFile(SRC_SVG);
  console.log(`✓ Source: ${SRC_SVG}`);

  for (const { path: outPath, size, paddingRatio } of TARGETS) {
    const buffer = await renderSquare(srcBuffer, size, paddingRatio);
    const fullPath = path.join(ROOT, outPath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    console.log(`✓ ${outPath} (${size}×${size}px${paddingRatio ? `, maskable padding ${(paddingRatio * 100).toFixed(0)}%` : ''})`);
  }

  // Vektor-Favicon: Square-SVG mit Off-White-BG erstellen.
  const svgString = srcBuffer.toString();
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) {
    throw new Error('Original-SVG hat kein viewBox-Attribut');
  }
  const [vbX, vbY, vbW, vbH] = viewBoxMatch[1].split(/\s+/).map(Number);
  const squareSize = Math.max(vbW, vbH);
  const padX = (squareSize - vbW) / 2;
  const padY = (squareSize - vbH) / 2;
  const pad = squareSize * (PADDING_RATIO / (1 - PADDING_RATIO * 2));
  const total = squareSize + pad * 2;
  const offsetX = pad + padX - vbX;
  const offsetY = pad + padY - vbY;

  const innerContent = svgString
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');

  const squareSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" role="img" aria-label="small p club">
  <rect width="${total}" height="${total}" fill="#F7F6F2"/>
  <g transform="translate(${offsetX.toFixed(2)}, ${offsetY.toFixed(2)})">
    ${innerContent.trim()}
  </g>
</svg>
`;
  await fs.writeFile(path.join(ROOT, 'src/app/icon.svg'), squareSvg);
  console.log('✓ src/app/icon.svg (Vektor-Favicon)');

  console.log('\nFavicon-Set komplett. Nächster Schritt: manifest.ts aktualisieren.');
}

main().catch((err) => {
  console.error('✗ Fehler:', err);
  process.exit(1);
});
