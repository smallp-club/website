/**
 * Rate-Limit-Helper — Upstash Redis basiert (sliding window).
 *
 * Limits per MEMBER_SECURITY.md §3 Linie 1:
 * - 5 Magic-Link-Requests pro IP / 24h
 * - 3 Magic-Link-Requests pro Email / 1h
 * - 1 Account-Erstellung pro IP / 24h
 *
 * Fallback ohne UPSTASH_* Env-Vars: alle Calls werden durchgelassen.
 * Das ist Absicht für lokale Dev-Setups; in Production werden die
 * Env-Vars Pflicht, das prüfen wir beim Build-Step in Phase 5b.
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
  | 'account_create_per_ip'
  | 'report_per_ip';

interface LimitConfig {
  prefix: string;
  limit: number;
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`;
}

const LIMITS: Record<RateLimitName, LimitConfig> = {
  magic_link_per_ip: { prefix: 'spc:ml:ip', limit: 5, window: '24 h' },
  magic_link_per_email: { prefix: 'spc:ml:em', limit: 3, window: '1 h' },
  account_create_per_ip: { prefix: 'spc:ac:ip', limit: 1, window: '24 h' },
  // Report-Action gegen Inbox-Flooding (Security H4). 10 Reports pro
  // Browser-IP pro 24h — verhindert dass ein Angreifer reports_count
  // einer Story endlos hochfährt.
  report_per_ip: { prefix: 'spc:rp:ip', limit: 10, window: '24 h' },
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
    return { success: true, remaining: Number.POSITIVE_INFINITY, reset: 0 };
  }
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
