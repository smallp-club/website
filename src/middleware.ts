import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

function buildCsp(nonce: string): string {
  return [
    "default-src 'none'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

export default function middleware(request: NextRequest) {
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
