/**
 * Supabase Browser-Client für Client-Components.
 *
 * Nutzt den anon-key + RLS. Niemals Service-Role hier.
 * Session-Cookie wird automatisch vom Browser gehandhabt.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY müssen gesetzt sein.'
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
