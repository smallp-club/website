import { NextResponse, type NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { getUpstashCredentials } from '@/lib/rate-limit';

/**
 * Täglicher Ping an Upstash (Vercel Cron, siehe vercel.json).
 *
 * Upstash löscht kostenlose Datenbanken nach 14 Tagen ohne Nutzung. Ohne
 * Datenbank lehnt das Rate-Limit in Production jeden Login ab (fail-closed),
 * das ist am 2026-11-05 passiert. Ein PING pro Tag hält sie aktiv.
 *
 * Ist CRON_SECRET gesetzt, schickt Vercel es als Bearer-Token mit und nur
 * dann wird gepingt.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new NextResponse(null, { status: 401 });
  }

  const creds = getUpstashCredentials();
  if (!creds) {
    console.error('[keepalive] upstash nicht konfiguriert');
    return NextResponse.json({ ok: false }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    await new Redis(creds).ping();
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[keepalive] upstash ping failed:', err);
    // Vorübergehende Diagnose ohne Secrets: welche DB, welche Fehlerart.
    const msg = String(err instanceof Error ? `${err.message} ${String(err.cause ?? '')}` : err);
    const reason = /unauthor|wrongpass|401/i.test(msg) ? 'auth' : /enotfound|getaddrinfo|fetch failed/i.test(msg) ? 'network' : 'other';
    let db = 'invalid-url';
    try { db = new URL(creds.url).hostname.split('.')[0] ?? db; } catch {}
    return NextResponse.json({ ok: false, reason, db, tokenLength: creds.token.length }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
