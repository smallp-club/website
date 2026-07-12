/**
 * Next.js Instrumentation — läuft einmal beim Server-Boot.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Wir nutzen den Hook nur, um sicherheitsrelevante Env-Vars in Production
 * beim Start zu prüfen und fehlende laut ins Deploy-Log zu schreiben.
 */

export async function register(): Promise<void> {
  // Nur im Node-Runtime laufen lassen (nicht im Edge-Runtime).
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { assertProductionEnv } = await import('@/lib/env-check');
    assertProductionEnv();
  }
}
