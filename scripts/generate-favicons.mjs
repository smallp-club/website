#!/usr/bin/env node
/**
 * Favicon-Set-Generator für small p club.
 *
 * Erzeugt ein vollständiges Light/Dark-Set aus den offiziellen Bildmarken
 * (Dark Turquoise + Pastel Turquoise) für alle relevanten Plattformen.
 *
 * Convention (Next.js 14+ App Router):
 *  - `src/app/icon.svg`         — Vektor mit prefers-color-scheme-Switch,
 *                                 ohne Hintergrund (Browser-Tab erkennt
 *                                 modern automatisch Light/Dark)
 *  - `src/app/icon.png`         — 32×32 transparent Dark Turquoise (Light)
 *  - `src/app/icon-dark.png`    — 32×32 transparent Pastel Turquoise (Dark)
 *  - `src/app/apple-icon.png`   — 180×180 mit Off-White-BG (iOS-Convention)
 *  - `src/app/apple-icon-dark.png` — 180×180 mit Black-BG (Dark-Mode iOS)
 *  - `public/icons/*.png`       — Android-Manifest 192 + 512 + maskable
 *
 * Light/Dark-Verknüpfung der PNGs erfolgt via `metadata.icons` in
 * `src/app/[locale]/layout.tsx` mit `media: '(prefers-color-scheme: ...)'`.
 *
 * Nach Bildmarken-Änderung erneut ausführen:
 *   node scripts/generate-favicons.mjs
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const MARK_LIGHT = path.join(ROOT, 'public/brand/smallpclub-mark-deep.svg');      // Dark Turquoise #1D5556
const MARK_DARK = path.join(ROOT, 'public/brand/smallpclub-mark-turquoise.svg');  // Pastel Turquoise #7BDCB5

const BG_LIGHT = { r: 247, g: 246, b: 242, alpha: 1 }; // --spc-offwhite #F7F6F2
const BG_DARK = { r: 10, g: 10, b: 10, alpha: 1 };     // --spc-black #0A0A0A
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const PADDING_RATIO = 0.18;
const MASKABLE_PADDING = 0.25;

const TARGETS = [
  // Transparente Browser-Tab-Favicons (Bildmarke pur).
  // Light = Auto-Mount via Next.js Convention (src/app/icon.png).
  // Dark = public/ Asset, referenziert via metadata.icons in layout.tsx.
  { path: 'src/app/icon.png', size: 32, src: MARK_LIGHT, bg: TRANSPARENT, padding: 0.08 },
  { path: 'public/icon-dark.png', size: 32, src: MARK_DARK, bg: TRANSPARENT, padding: 0.08 },

  // iOS Touch-Icons. Light via Auto-Mount, Dark als public/-Asset.
  { path: 'src/app/apple-icon.png', size: 180, src: MARK_LIGHT, bg: BG_LIGHT, padding: PADDING_RATIO },
  { path: 'public/apple-icon-dark.png', size: 180, src: MARK_DARK, bg: BG_DARK, padding: PADDING_RATIO },

  // Android Manifest (mit BG)
  { path: 'public/icons/icon-192.png', size: 192, src: MARK_LIGHT, bg: BG_LIGHT, padding: PADDING_RATIO },
  { path: 'public/icons/icon-512.png', size: 512, src: MARK_LIGHT, bg: BG_LIGHT, padding: PADDING_RATIO },
  { path: 'public/icons/icon-192-dark.png', size: 192, src: MARK_DARK, bg: BG_DARK, padding: PADDING_RATIO },
  { path: 'public/icons/icon-512-dark.png', size: 512, src: MARK_DARK, bg: BG_DARK, padding: PADDING_RATIO },

  // Android Maskable (mehr Safe-Zone, Android maskt rund/eckig)
  { path: 'public/icons/maskable-512.png', size: 512, src: MARK_LIGHT, bg: BG_LIGHT, padding: MASKABLE_PADDING },
];

async function renderIcon(srcPath, size, bg, paddingRatio) {
  const srcBuffer = await fs.readFile(srcPath);
  const padding = Math.round(size * paddingRatio);
  const innerSize = size - padding * 2;

  // Bildmarke transparent rendern.
  const inner = await sharp(srcBuffer, { density: 300 })
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: TRANSPARENT,
    })
    .png()
    .toBuffer();

  // Auf BG (Off-White / Black / Transparent) composit.
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: inner, top: padding, left: padding }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function writeSquareSvg() {
  // SVG mit eingebettetem prefers-color-scheme-Switch.
  // Default-Fill: Dark Turquoise. Im Dark Mode: Pastel Turquoise.
  // Kein Hintergrund — Browser-Tab zeigt Bildmarke pur.
  const srcBuffer = await fs.readFile(MARK_LIGHT);
  const svgString = srcBuffer.toString();
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) {
    throw new Error('Original-SVG hat kein viewBox-Attribut');
  }
  const [vbX, vbY, vbW, vbH] = viewBoxMatch[1].split(/\s+/).map(Number);
  const squareSize = Math.max(vbW, vbH);
  const padX = (squareSize - vbW) / 2;
  const padY = (squareSize - vbH) / 2;

  // Originale fill-Attribute auf currentColor umstellen, damit CSS greift.
  const innerContent = svgString
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/fill="#1D5556"/gi, 'fill="currentColor"')
    .replace(/class="cls-1"/gi, '');

  const offsetX = padX - vbX;
  const offsetY = padY - vbY;

  const squareSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${squareSize} ${squareSize}" role="img" aria-label="small p club">
  <style>
    :root { color: #1D5556; }
    @media (prefers-color-scheme: dark) {
      :root { color: #7BDCB5; }
    }
  </style>
  <g transform="translate(${offsetX.toFixed(2)}, ${offsetY.toFixed(2)})">
    ${innerContent.trim()}
  </g>
</svg>
`;
  await fs.writeFile(path.join(ROOT, 'src/app/icon.svg'), squareSvg);
  console.log('✓ src/app/icon.svg (Vektor, Light + Dark via prefers-color-scheme)');
}

async function main() {
  console.log(`Source Light: ${path.basename(MARK_LIGHT)}`);
  console.log(`Source Dark:  ${path.basename(MARK_DARK)}\n`);

  for (const { path: outPath, size, src, bg, padding } of TARGETS) {
    const buffer = await renderIcon(src, size, bg, padding);
    const fullPath = path.join(ROOT, outPath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    const bgLabel = bg === TRANSPARENT ? 'transparent' : `rgb(${bg.r},${bg.g},${bg.b})`;
    console.log(`✓ ${outPath} (${size}×${size}, ${bgLabel})`);
  }

  await writeSquareSvg();

  console.log('\nFavicon-Set komplett.');
}

main().catch((err) => {
  console.error('✗ Fehler:', err);
  process.exit(1);
});
