import type { MetadataRoute } from 'next';

/**
 * PWA-Manifest. Icons werden automatisch im `<head>` referenziert
 * (von Next.js + via `metadata.icons` in layout.tsx wenn nötig).
 *
 * - `any`-Icons (192, 512): Standard Android-Home + Browser-Tab
 * - `maskable`-Icon (512): Android adaptiv (Safe-Zone Padding 25%)
 * - Sources: `public/icons/`, gerendert via `scripts/generate-favicons.mjs`
 *
 * Theme + Background matchen Brand-Tokens — bei Refresh der Brand-Farben
 * auch hier updaten (Single Source der Truth: tokens/colors.css).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'small p club',
    short_name: 'small p',
    description: 'no measure, no pressure',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F6F2', // --spc-offwhite
    theme_color: '#1D5556',      // --spc-turquoise-deep (matched Bildmarke)
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
