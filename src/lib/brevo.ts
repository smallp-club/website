const BREVO_API_BASE = 'https://api.brevo.com/v3';

export type BrevoResult =
  | { ok: true; alreadyExists: boolean }
  | { ok: false; reason: 'invalid_email' | 'rate_limit' | 'config_missing' | 'api_error' };

type BrevoConfig = {
  apiKey: string;
  listId: number;
};

function loadConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;
  if (!apiKey || !listIdRaw) return null;
  const listId = Number.parseInt(listIdRaw, 10);
  if (Number.isNaN(listId)) return null;
  return { apiKey, listId };
}

/**
 * Newsletter-Anmeldung per echtem Double-Opt-In (Security-Audit M5).
 *
 * Der Magic-Link-Klick belegt nur die Mail-Adresse, nicht die Newsletter-
 * Einwilligung. Deshalb schickt Brevo eine eigene Bestätigungsmail
 * (Template BREVO_DOI_TEMPLATE_ID). Erst der Klick darin setzt den Kontakt
 * auf die Liste.
 */
export async function requestNewsletterDoubleOptIn(email: string): Promise<BrevoResult> {
  const config = loadConfig();
  const templateId = Number.parseInt(process.env.BREVO_DOI_TEMPLATE_ID ?? '', 10);
  if (!config || Number.isNaN(templateId)) return { ok: false, reason: 'config_missing' };
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://smallp.club';

  try {
    const response = await fetch(`${BREVO_API_BASE}/contacts/doubleOptinConfirmation`, {
      method: 'POST',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        includeListIds: [config.listId],
        templateId,
        redirectionUrl: `${site}/mit-glied/eingang`,
      }),
    });

    if (response.status === 201 || response.status === 204) {
      return { ok: true, alreadyExists: response.status === 204 };
    }
    if (response.status === 400) return { ok: false, reason: 'invalid_email' };
    if (response.status === 429) return { ok: false, reason: 'rate_limit' };
    return { ok: false, reason: 'api_error' };
  } catch {
    return { ok: false, reason: 'api_error' };
  }
}

/**
 * Löscht den Kontakt komplett aus Brevo (Account-Löschung, Bann, Abbestellen).
 * 404 = war nie da, zählt als erledigt.
 */
export async function deleteContact(email: string): Promise<BrevoResult> {
  const config = loadConfig();
  if (!config) return { ok: false, reason: 'config_missing' };

  try {
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
      { method: 'DELETE', headers: { 'api-key': config.apiKey, accept: 'application/json' } },
    );
    if (response.status === 204) return { ok: true, alreadyExists: true };
    if (response.status === 404) return { ok: true, alreadyExists: false };
    if (response.status === 429) return { ok: false, reason: 'rate_limit' };
    return { ok: false, reason: 'api_error' };
  } catch {
    return { ok: false, reason: 'api_error' };
  }
}

export type BrevoListStats =
  | {
      ok: true;
      totalSubscribers: number;
      totalBlacklisted: number;
      uniqueSubscribers: number;
    }
  | { ok: false; reason: 'config_missing' | 'api_error' | 'not_found' };

/**
 * Liest aktuelle Liste-Statistik aus Brevo. Genutzt vom Admin-Dashboard
 * um die Newsletter-Reach anzuzeigen.
 *
 * `totalSubscribers` = aktive Subscriber (haben DOI bestätigt, sind in
 * der Liste, nicht blacklisted).
 * `totalBlacklisted` = haben sich ausgetragen oder als spam markiert.
 * `uniqueSubscribers` = brevos eigene dedup-zahl, üblicherweise === totalSubscribers.
 */
export async function getListStats(): Promise<BrevoListStats> {
  const config = loadConfig();
  if (!config) return { ok: false, reason: 'config_missing' };

  try {
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/lists/${config.listId}`,
      {
        method: 'GET',
        headers: {
          'api-key': config.apiKey,
          accept: 'application/json',
        },
        // Brevo-Daten sind nicht time-critical, cache 5min ist OK.
        next: { revalidate: 300 },
      }
    );

    if (response.status === 404) return { ok: false, reason: 'not_found' };
    if (!response.ok) return { ok: false, reason: 'api_error' };

    const data = (await response.json()) as {
      totalSubscribers?: number;
      totalBlacklisted?: number;
      uniqueSubscribers?: number;
    };

    return {
      ok: true,
      totalSubscribers: data.totalSubscribers ?? 0,
      totalBlacklisted: data.totalBlacklisted ?? 0,
      uniqueSubscribers: data.uniqueSubscribers ?? data.totalSubscribers ?? 0,
    };
  } catch {
    return { ok: false, reason: 'api_error' };
  }
}
