'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { verifyTotpForReauth } from '@/lib/members/mfa';
import { hashEmail, hashIp } from '@/lib/hash';
import { deleteContact } from '@/lib/brevo';

/**
 * Ban-Mechanismus: Mail- und/oder IP-Hash auf die Blocklist setzen.
 *
 * Wird vom Inbox-Detail-Ban-Button und vom Blocklist-Page-Form aufgerufen.
 * Mail-Hash und IP-Hash werden separat geprüft — Reject mit doppelten
 * Einträgen über DB-Unique-Index (email_hash UNIQUE).
 *
 * Re-Auth via TOTP: jeder Ban verlangt einen frischen 6-stelligen Code.
 * Doktrin MEMBER_SECURITY.md §7. Ohne Code oder bei Falsch-Code → redirect
 * mit ?reauth=failed, kein DB-write.
 */
export async function banAction(formData: FormData): Promise<void> {
  const session = await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  const totpCode = String(formData.get('totp_code') ?? '').trim();
  if (!(await verifyTotpForReauth(totpCode))) {
    redirect('/mit-glied/admin/blocklist?reauth=failed');
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const ip = String(formData.get('ip') ?? '').trim();
  const reason = String(formData.get('reason') ?? '').trim().slice(0, 500) || null;

  if (!email && !ip) return;

  const ipHash = ip ? hashIp(ip) : null;
  // email_hash ist NOT NULL + unique. Für reine IP-Banns ein eindeutiger
  // Platzhalter, der nie zu einer echten Mail passt (Audit L7: vorher wurde
  // ein IP-Bann stillschweigend verworfen).
  const emailHash = email ? hashEmail(email) : `ip-only:${ipHash}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocklistTable = service.from('blocklist') as any;
  const { data: inserted, error } = await blocklistTable
    .insert({
      email_hash: emailHash,
      ip_hash: ipHash,
      reason,
      banned_by: session.user.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[admin-ban]', error);
    return;
  }

  // Hat die Mail schon ein Konto, endet es jetzt — nicht erst beim nächsten
  // Login. Sonst bliebe eine laufende Session aktiv (Security-Audit 2026-11).
  const existingUserId = email ? await findUserIdByEmail(service, email) : null;
  if (existingUserId) await revokeMember(service, existingUserId, email);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'ban',
    target_type: 'blocklist',
    target_id: (inserted as { id: string }).id,
    metadata: { reason, removed_user_id: existingUserId },
  });

  revalidatePath('/mit-glied/admin/blocklist');
  revalidatePath('/mit-glied/admin/audit');
}

/**
 * Unban: Blocklist-Eintrag entfernen + Audit-Log.
 * Auch hier Re-Auth via TOTP — Unban ist sensitiv (re-enables Account).
 */
export async function unbanAction(formData: FormData): Promise<void> {
  const session = await requireAdminWithMfa();

  const totpCode = String(formData.get('totp_code') ?? '').trim();
  if (!(await verifyTotpForReauth(totpCode))) {
    redirect('/mit-glied/admin/blocklist?reauth=failed');
  }

  const blocklistId = String(formData.get('blocklist_id') ?? '');
  if (!blocklistId) return;

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocklistTable = service.from('blocklist') as any;
  const { error } = await blocklistTable.delete().eq('id', blocklistId);
  if (error) {
    console.error('[admin-unban]', error);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'unban',
    target_type: 'blocklist',
    target_id: blocklistId,
  });

  revalidatePath('/mit-glied/admin/blocklist');
  revalidatePath('/mit-glied/admin/audit');
}

/**
 * Ban-User: löscht User-Account (cascade) UND fügt Email-Hash zur Blocklist
 * hinzu, damit derselbe User sich nicht sofort neu anmelden kann. Wird
 * vom Inbox-Detail-Ban-Button aufgerufen (story_id → user_id → mail).
 */
export async function banUserFromStoryAction(formData: FormData): Promise<void> {
  const session = await requireAdminWithMfa();
  const storyId = String(formData.get('story_id') ?? '');

  const totpCode = String(formData.get('totp_code') ?? '').trim();
  if (!(await verifyTotpForReauth(totpCode))) {
    redirect(`/mit-glied/admin/inbox/${storyId}?reauth=failed`);
  }

  const reason =
    String(formData.get('reason') ?? '').trim().slice(0, 500) ||
    'ban via inbox-detail';
  if (!storyId) return;

  const service = createSupabaseServiceClient();

  // 1) Story laden + user_id finden
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data: story } = await storiesTable
    .select('user_id, pseudonym')
    .eq('id', storyId)
    .maybeSingle();
  if (!story?.user_id) return;

  const userId = (story as { user_id: string }).user_id;

  // 2) Email aus auth.users holen
  const { data: userResult, error: userErr } = await service.auth.admin.getUserById(userId);
  if (userErr || !userResult.user?.email) {
    console.error('[admin-ban-user] user lookup failed:', userErr);
    return;
  }
  const email = userResult.user.email;
  const emailHash = hashEmail(email);

  // 3) Story rejecten (die übrigen unveröffentlichten löscht revokeMember)
  await storiesTable.update({ status: 'rejected' }).eq('id', storyId);

  // 4) Email-Hash auf Blocklist
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocklistTable = service.from('blocklist') as any;
  const { data: inserted } = await blocklistTable
    .insert({
      email_hash: emailHash,
      reason,
      banned_by: session.user.id,
    })
    .select('id')
    .single();

  // 5) Konto beenden
  await revokeMember(service, userId, email, storyId);

  // 6) Audit-Log
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'ban',
    target_type: 'user',
    target_id: userId,
    metadata: {
      reason,
      story_id: storyId,
      pseudonym: (story as { pseudonym: string }).pseudonym,
      blocklist_id: (inserted as { id: string } | null)?.id ?? null,
    },
  });

  revalidatePath('/mit-glied/admin/inbox');
  revalidatePath('/mit-glied/admin/blocklist');
  revalidatePath('/mit-glied/admin/audit');
}

type ServiceClient = ReturnType<typeof createSupabaseServiceClient>;

/**
 * Beendet ein Mitglied: unveröffentlichte Berichte löschen (außer `keepStoryId`,
 * die schon als rejected markiert ist), Konto löschen (Cascade auf profile,
 * stories.user_id → NULL via 0004; approved Stories bleiben mit ihrem Pseudonym,
 * kein „alter-"-Marker beim Ban) und Brevo-Kontakt entfernen.
 * Nach deleteUser schlägt getUser() für jede bestehende Session fehl.
 */
async function revokeMember(
  service: ServiceClient,
  userId: string,
  email: string,
  keepStoryId?: string,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  let pending = storiesTable.delete().eq('user_id', userId).neq('status', 'approved');
  if (keepStoryId) pending = pending.neq('id', keepStoryId);
  await pending;

  const { error } = await service.auth.admin.deleteUser(userId);
  if (error) console.error('[admin-ban] deleteUser failed:', error);
  const brevo = await deleteContact(email);
  if (!brevo.ok) console.error('[admin-ban] brevo delete failed:', brevo.reason);
}

/** Supabase hat kein getUserByEmail; der Club ist klein, Blättern reicht. */
async function findUserIdByEmail(service: ServiceClient, email: string): Promise<string | null> {
  const perPage = 1000;
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error('[admin-ban] listUsers failed:', error);
      return null;
    }
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return hit.id;
    if (data.users.length < perPage) return null;
  }
  return null;
}
