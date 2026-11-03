import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Löscht Cookies, Speicher und Cache dieser Seite im Browser
 * (Knopf auf /privacy/anonym-bleiben).
 *
 * Security-Audit L1:
 * - Nur Anfragen von smallp.club selbst. Sonst könnte jede fremde Seite per
 *   Formular-Post Besucher ungefragt ausloggen.
 * - Vorher serverseitig ausloggen. Clear-Site-Data allein löscht nur das
 *   Cookie, der Refresh-Token bliebe bei Supabase gültig.
 */
export async function POST(request: NextRequest) {
  const sameOrigin =
    request.headers.get('origin') === request.nextUrl.origin ||
    request.headers.get('sec-fetch-site') === 'same-origin';
  if (!sameOrigin) {
    return new NextResponse(null, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut({ scope: 'local' });
  } catch (err) {
    console.error('[clear-site-data] signOut failed:', err);
  }

  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Clear-Site-Data', '"cookies", "storage", "cache"');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
