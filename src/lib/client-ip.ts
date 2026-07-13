import { headers } from 'next/headers';

/**
 * Client-IP-Resolver für Rate-Limits und Blocklist-Checks.
 *
 * Reihenfolge: cf-connecting-ip → x-forwarded-for (letzter Eintrag) → x-real-ip.
 *
 * Warum cf-connecting-ip ZUERST: Cloudflare setzt diesen Header IMMER selbst
 * und überschreibt jeden Client-Spoof. Hinter Cloudflare ist das der einzige
 * vertrauenswürdige Wert. x-forwarded-for kann vom Client gefälscht werden
 * (`X-Forwarded-For: 1.2.3.4` einfach mitsenden) — der erste Eintrag in der
 * Chain ist die behauptete Client-IP, nicht die tatsächliche.
 *
 * Fallback x-forwarded-for: wenn nicht hinter Cloudflare (lokale Dev,
 * direkter Vercel-Endpoint), dann nutzen wir den letzten Eintrag — das ist
 * der vertrauenswürdige Edge-Proxy-Wert. Die client-behauptete IP steht in
 * der Chain VOR den Proxy-IPs, würde aber ohne Cloudflare-Filter ankommen.
 *
 * @see Security-Audit 2026-06-24 Finding H3
 */
export async function getClientIp(): Promise<string | null> {
  const hdrs = await headers();

  const cf = hdrs.get('cf-connecting-ip');
  if (cf) {
    // cf-connecting-ip nur vertrauen, wenn der Request wirklich über Cloudflare
    // kam. Cloudflare injiziert per Transform-Rule den Header `x-origin-verify` mit
    // einem Secret (CF_VERIFY_SECRET), das nur Cloudflare kennt. Bei Direkt-
    // zugriff auf die rohe Vercel-URL fehlt der Stempel → cf-connecting-ip wird
    // NICHT vertraut (sonst könnte ein Angreifer die IP fälschen und alle
    // IP-Limits + die IP-Blocklist aushebeln). Security-Audit 2026-07-13.
    //
    // Übergangssicher: solange CF_VERIFY_SECRET nicht gesetzt ist, verhalten
    // wir uns wie bisher (cf-connecting-ip vertrauen) — kein Bruch bei der
    // Einführung. Scharf wird es erst, wenn das Secret gesetzt UND die
    // Cloudflare-Regel aktiv ist.
    const secret = process.env.CF_VERIFY_SECRET;
    const stamped = !secret || hdrs.get('x-origin-verify') === secret;
    if (stamped) return cf.trim();
  }

  const forwarded = hdrs.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return parts[parts.length - 1] ?? null;
  }

  return hdrs.get('x-real-ip')?.trim() ?? null;
}
