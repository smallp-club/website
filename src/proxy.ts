import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  // Dev: Next.js Webpack-HMR braucht eval() für React-Refresh + WebSocket für Live-Reload.
  // Production: strikte CSP, kein unsafe-eval, kein ws:.
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}'`;
  const connectSrc = isDev
    ? "connect-src 'self' ws: wss:"
    : "connect-src 'self'";
  return [
    "default-src 'none'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    connectSrc,
    "manifest-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

export default function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Let next-intl handle locale routing
  const response = intlMiddleware(request);
  const res = response ?? NextResponse.next();

  // Inject security headers
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-nonce', nonce); // Layout reads this to pass nonce to Next.js scripts
  res.headers.set('Referrer-Policy', 'no-referrer');

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
