/**
 * Supabase Session-Refresh für Edge-Middleware (src/proxy.ts).
 *
 * Liest Auth-Cookies aus dem Request, refresht die Session wenn nötig,
 * schreibt die Cookies zurück in die Response. So bleiben Magic-Link-Sessions
 * über Page-Navigationen hinweg gültig.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  try {
    const supabase = createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // Session-Refresh als Side-Effect via getUser.
    await supabase.auth.getUser();
  } catch (err) {
    // Defensive: Supabase-Outage darf das Middleware nicht crashen, sonst 500
    // für jede Page. Auth-Cookies bleiben dann unverändert, das ist OK.
    console.error('[supabase-middleware] refresh failed:', err);
  }

  return response;
}
