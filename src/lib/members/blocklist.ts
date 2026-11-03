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
    const { data } = await service
      .from('blocklist')
      .select('email_hash')
      .eq('email_hash', emailHash)
      .limit(1);
    if (Array.isArray(data) && data.length > 0) return true;

    if (ipHash) {
      const ipResult = await service
        .from('blocklist')
        .select('ip_hash')
        .eq('ip_hash', ipHash)
        .limit(1);
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
