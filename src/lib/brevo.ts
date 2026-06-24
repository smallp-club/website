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

export async function addContactToList(email: string): Promise<BrevoResult> {
  const config = loadConfig();
  if (!config) return { ok: false, reason: 'config_missing' };

  try {
    const response = await fetch(`${BREVO_API_BASE}/contacts`, {
      method: 'POST',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [config.listId],
        updateEnabled: true,
      }),
    });

    if (response.status === 201) {
      return { ok: true, alreadyExists: false };
    }
    if (response.status === 204) {
      return { ok: true, alreadyExists: true };
    }
    if (response.status === 400) {
      return { ok: false, reason: 'invalid_email' };
    }
    if (response.status === 429) {
      return { ok: false, reason: 'rate_limit' };
    }
    return { ok: false, reason: 'api_error' };
  } catch {
    return { ok: false, reason: 'api_error' };
  }
}

/**
 * Entfernt eine Email aus der Newsletter-Liste — der Contact bleibt in Brevo
 * (für späteres Re-Subscribe ohne Neu-Eingabe), wird nur aus der Liste raus.
 *
 * 201 oder 204 = success. 400 mit `contact_already_removed_from_list` heißt
 * der Contact war nicht (mehr) in der Liste → idempotent als ok.
 */
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

export async function removeContactFromList(email: string): Promise<BrevoResult> {
  const config = loadConfig();
  if (!config) return { ok: false, reason: 'config_missing' };

  try {
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/lists/${config.listId}/contacts/remove`,
      {
        method: 'POST',
        headers: {
          'api-key': config.apiKey,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ emails: [email] }),
      }
    );

    if (response.status === 201 || response.status === 204) {
      return { ok: true, alreadyExists: false };
    }
    if (response.status === 400) {
      // Brevo returns 400 wenn Contact gar nicht in der Liste war — für uns
      // ist das identisch mit „bereits draußen". Idempotent OK.
      return { ok: true, alreadyExists: true };
    }
    if (response.status === 429) {
      return { ok: false, reason: 'rate_limit' };
    }
    return { ok: false, reason: 'api_error' };
  } catch {
    return { ok: false, reason: 'api_error' };
  }
}
