import 'server-only';

import { createSupabaseServiceClient } from '@/lib/supabase/service';

/**
 * Steht diese Mail (oder IP) auf der Blocklist? Geteilt von Login-Formular
 * und /auth/verify, damit ein Bann nicht über die Supabase-API umgangen
 * werden kann (Security-Audit M1).
 */
export async function isBanned(emailHash: string, ipHash: string | null): Promise<boolean> {
  try {
    const service = createSupabaseServiceClient();
    // supabase-js wirft bei DB-Fehlern nicht, sondern liefert `error` zurück.
    // Ohne diesen Check wäre ein Fehler „nicht gebannt" (Security-Audit 2026-11).
    const { data, error } = await service
      .from('blocklist')
      .select('email_hash')
      .eq('email_hash', emailHash)
      .limit(1);
    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) return true;

    if (ipHash) {
      const ipResult = await service
        .from('blocklist')
        .select('ip_hash')
        .eq('ip_hash', ipHash)
        .limit(1);
      if (ipResult.error) throw ipResult.error;
      return Array.isArray(ipResult.data) && ipResult.data.length > 0;
    }
    return false;
  } catch (err) {
    // Blocklist-Check ist ein Sicherheits-Gate — bei Fehler nicht blind
    // durchlassen. Production: fail-closed (als gebannt behandeln), sonst
    // könnte ein gebannter User einen DB-Aussetzer als Wiedereintritt nutzen.
    // Der Magic-Link-Flow hängt ohnehin an derselben Supabase-Instanz, ein
    // echter Ausfall blockiert den Login also sowieso.
    console.error('[isBanned] lookup failed:', err);
    return process.env.NODE_ENV === 'production';
  }
}
