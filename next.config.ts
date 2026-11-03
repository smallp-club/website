import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';

// Dev: Webpack-HMR braucht eval() + ws:. Production: strikt.
const staticCsp = isDev
  ? "default-src 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' ws: wss:; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  : "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";

const nextConfig: NextConfig = {
  // Kein „x-powered-by: Next.js“ (Audit L6, Technik-Verrat ohne Nutzen).
  poweredByHeader: false,
  // Nur Dev: Handy im selben WLAN darf die lokale Vorschau laden (HMR).
  allowedDevOrigins: ['192.168.178.*'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
          },
          // Audit L6: fremde Fenster bekommen keinen Zugriff auf unser Fenster,
          // fremde Seiten dürfen unsere Dateien nicht einbetten.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // CSP with nonce is set per-request in proxy.ts.
          // This static fallback covers API routes and static assets.
          { key: 'Content-Security-Policy', value: staticCsp },
        ],
      },
      {
        // Security-Audit L6: API-Routen sind vom Proxy-Matcher excludiert
        // (siehe src/proxy.ts), bekommen also kein X-Robots-Tag via Edge.
        // Hier statisch noindex erzwingen — egal welche /api/* je dazukommt.
        source: '/api/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
