/**
 * Env-Var-Validierung beim Server-Boot.
 *
 * Wird aus src/instrumentation.ts (register-Hook) aufgerufen. Zweck:
 * Fehlkonfiguration in Production sofort und laut sichtbar machen, statt
 * dass sie sich still als deaktivierter Schutz auswirkt (Fail-Open).
 *
 * Die geschützten Aktionen selbst fallen bereits fail-closed aus, wenn ihre
 * Vars fehlen (rate-limit.ts, turnstile.ts) — dieser Check ist die
 * Frühwarnung im Deploy-Log, damit man es nicht erst beim ersten blockierten
 * Login merkt.
 *
 * Wir werfen NICHT (die öffentliche Awareness-Site soll auch bei fehlender
 * Login-Config erreichbar bleiben) — wir loggen eine deutliche Fehlerliste.
 */

interface RequiredVar {
  name: string;
  purpose: string;
}

const REQUIRED_IN_PRODUCTION: RequiredVar[] = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', purpose: 'Datenbank + Auth' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', purpose: 'Datenbank (public, RLS-geschützt)' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', purpose: 'Server-Actions (RLS-Bypass)' },
  { name: 'UPSTASH_REDIS_REST_URL', purpose: 'Rate-Limit (sonst fail-closed)' },
  { name: 'UPSTASH_REDIS_REST_TOKEN', purpose: 'Rate-Limit (sonst fail-closed)' },
  { name: 'TURNSTILE_SECRET_KEY', purpose: 'Bot-Schutz (sonst fail-closed)' },
  { name: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY', purpose: 'Bot-Schutz Widget' },
  { name: 'HASH_PEPPER', purpose: 'Blocklist-/Backup-Hash-Pepper' },
  { name: 'NEXT_PUBLIC_SITE_URL', purpose: 'Magic-Link-Redirect-Origin' },
];

export function assertProductionEnv(): void {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = REQUIRED_IN_PRODUCTION.filter((v) => !process.env[v.name]);
  if (missing.length === 0) {
    console.info('[env-check] alle sicherheitsrelevanten env-vars gesetzt.');
    return;
  }

  console.error(
    '[env-check] FEHLENDE ENV-VARS IN PRODUCTION — betroffene schutzmechanismen sind fail-closed/deaktiviert:'
  );
  for (const v of missing) {
    console.error(`  ✗ ${v.name} — ${v.purpose}`);
  }
  console.error(
    '[env-check] in Vercel → Project → Settings → Environment Variables setzen (als Sensitive).'
  );
}
