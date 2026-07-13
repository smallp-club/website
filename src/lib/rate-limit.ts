/**
 * Rate-Limit-Helper — Upstash Redis basiert (sliding window).
 *
 * Limits per MEMBER_SECURITY.md §3 Linie 1:
 * - 5 Magic-Link-Requests pro IP / 24h
 * - 3 Magic-Link-Requests pro Email / 1h
 * - 1 Account-Erstellung pro IP / 24h
 *
 * Fallback ohne UPSTASH_* Env-Vars:
 *  - Development: alle Calls werden durchgelassen (Dev-Convenience).
 *  - Production: fail-closed — der Call wird abgelehnt (success:false).
 *    Ein Rate-Limit, das nicht konfiguriert ist, darf in Production nicht
 *    stillschweigend jeden Request durchlassen (Magic-Link-/Report-Flood).
 *    Die Env-Vars werden zusätzlich beim Boot geprüft (src/lib/env-check.ts).
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let cachedRedis: Redis | null = null;
function getRedis(): Redis | null {
  if (cachedRedis) return cachedRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  cachedRedis = new Redis({ url, token });
  return cachedRedis;
}

export type RateLimitName =
  | 'magic_link_per_ip'
  | 'magic_link_per_email'
  | 'report_per_ip'
  | 'story_submit_per_user'
  | 'pseudonym_roll_per_user'
  | 'mfa_verify_per_user';

interface LimitConfig {
  prefix: string;
  limit: number;
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`;
}

const LIMITS: Record<RateLimitName, LimitConfig> = {
  // Kontoerstellung ist über dieses Limit gedeckelt: ein Account entsteht nur
  // über einen Magic-Link, und der ist auf 5/IP/24h begrenzt (seit dem
  // Cloudflare-Echtheits-Stempel spoof-resistent, siehe client-ip.ts). Ein
  // separates, strengeres „1 Account/IP/24h" wurde bewusst NICHT umgesetzt:
  // es würde geteilte IPs (Haushalte, Büros, Mobilfunk-NAT) fälschlich sperren.
  magic_link_per_ip: { prefix: 'spc:ml:ip', limit: 5, window: '24 h' },
  magic_link_per_email: { prefix: 'spc:ml:em', limit: 3, window: '1 h' },
  // Report-Action gegen Inbox-Flooding (Security H4). 10 Reports pro
  // Browser-IP pro 24h — verhindert dass ein Angreifer reports_count
  // einer Story endlos hochfährt.
  report_per_ip: { prefix: 'spc:rp:ip', limit: 10, window: '24 h' },
  // Story-Submit gegen Inbox-/Shingle-Flooding. Der 24h-Cooldown gated nur
  // die allererste Einreichung; danach begrenzt dieses Limit die Frequenz.
  story_submit_per_user: { prefix: 'spc:st:u', limit: 5, window: '24 h' },
  // Pseudonym-Würfeln gegen DB-Query-Flood auf profiles (Service-Role).
  pseudonym_roll_per_user: { prefix: 'spc:ps:u', limit: 40, window: '1 h' },
  // MFA-Verify (TOTP + Backup-Code) gegen Brute-Force des zweiten Faktors.
  mfa_verify_per_user: { prefix: 'spc:mfa:u', limit: 10, window: '15 m' },
};

const limiterCache = new Map<RateLimitName, Ratelimit>();
function getLimiter(name: RateLimitName): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const cached = limiterCache.get(name);
  if (cached) return cached;
  const cfg = LIMITS[name];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.limit, cfg.window),
    prefix: cfg.prefix,
    analytics: false,
  });
  limiterCache.set(name, limiter);
  return limiter;
}

export interface RateLimitResult {
  success: boolean;
  /** Verbleibende Calls im aktuellen Fenster. */
  remaining: number;
  /** ms-Timestamp wann das Fenster zurückgesetzt wird. */
  reset: number;
}

/**
 * Verbraucht einen Slot für die gegebene Limit-Kategorie und Identifier.
 * `identifier` ist IP oder Email-Hash, je nach Kategorie.
 *
 * Fallback (kein Upstash konfiguriert): success=true mit remaining=Infinity.
 */
export async function consumeRateLimit(
  name: RateLimitName,
  identifier: string
): Promise<RateLimitResult> {
  const limiter = getLimiter(name);
  if (!limiter) {
    // Kein Upstash konfiguriert.
    // Production: fail-closed. Ein fehlendes Limit-Backend darf nicht dazu
    // führen, dass jeder Request unbegrenzt durchgeht (Magic-Link-/Report-
    // Flood über den all-inkl-SMTP). Lieber die geschützte Aktion sperren,
    // bis die UPSTASH_*-Vars gesetzt sind (siehe env-check.ts beim Boot).
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '[rate-limit] upstash nicht konfiguriert — limit',
        name,
        'greift NICHT, request wird fail-closed abgelehnt.'
      );
      return { success: false, remaining: 0, reset: Date.now() + 60_000 };
    }
    // Development: durchlassen, damit lokales Testen ohne Upstash läuft.
    return { success: true, remaining: Number.POSITIVE_INFINITY, reset: 0 };
  }
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
