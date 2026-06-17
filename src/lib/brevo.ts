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
