import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { refreshSupabaseSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  // Dev: Next.js Webpack-HMR braucht eval() für React-Refresh + WebSocket für Live-Reload.
  // Production: strikte CSP, kein unsafe-eval, kein ws:.
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://challenges.cloudflare.com`
    : `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com`;
  // Supabase-Auth-Calls über *.supabase.co (Realtime + REST). Turnstile-Telemetry läuft separat.
  const connectSrc = isDev
    ? "connect-src 'self' ws: wss: https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com"
    : "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com";
  return [
    "default-src 'none'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    connectSrc,
    "manifest-src 'self'",
    // Turnstile rendert sein Widget in einem iframe.
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

export default async function proxy(request: NextRequest) {
  // Interne Bühnen (Preview-Wireframes, Components-Library) sind in
  // Production nicht erreichbar — sie leaken interne Design-/Planungsinfos.
  // Der Guard läuft hier am Edge (zuverlässig bei jedem Request), weil das
  // notFound() auf Layout-Ebene in Production nicht greift.
  if (process.env.NODE_ENV === 'production') {
    const p = request.nextUrl.pathname;
    if (/^\/(?:de\/|en\/)?(?:preview|components-library)(?:\/|$)/.test(p)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // i18n routing zuerst, danach Supabase-Session-Refresh auf der gleichen Response.
  const response = intlMiddleware(request);
  const res = response ?? NextResponse.next();

  // Session-Refresh als Side-Effect; schreibt Auth-Cookies zurück wenn nötig.
  // No-op solange die Supabase-Env-Vars nicht gesetzt sind.
  await refreshSupabaseSession(request, res);

  // Security-Header
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-nonce', nonce); // Layout reads this to pass nonce to Next.js scripts
  res.headers.set('Referrer-Policy', 'no-referrer');

  // Defense-in-Depth: interne Preview-Routen + Library + Member-Bereich
  // bekommen explizites X-Robots-Tag, unabhängig vom globalen robots.txt.
  // Greift auch nach Launch wenn robots.txt selektiv geöffnet wird.
  const path = request.nextUrl.pathname;
  if (
    /^\/(?:de|en)?\/?(?:preview|components-library|mit-glied|auth)/.test(path)
  ) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
