import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';

// Dev: Webpack-HMR braucht eval() + ws:. Production: strikt.
const staticCsp = isDev
  ? "default-src 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' ws: wss:; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  : "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // CSP with nonce is set per-request in proxy.ts.
          // This static fallback covers API routes and static assets.
          { key: 'Content-Security-Policy', value: staticCsp },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
