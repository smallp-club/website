/**
 * Supabase Service-Role-Client — UMGEHT RLS.
 *
 * NUR für Server-Actions und Route Handlers, niemals client-exposed.
 * Niemals in Components importieren, die serialisiert werden könnten.
 * Niemals mit `NEXT_PUBLIC_`-prefixed Env-Vars.
 *
 * Anwendungsfälle:
 * - Admin-Approve/Reject von Stories
 * - Ban-Mechanik (blocklist insert)
 * - Audit-Log-Insert mit beliebigem admin_id-Override
 * - Drei-Stufen-Moderation auf incoming Stories
 */

import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein.'
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
