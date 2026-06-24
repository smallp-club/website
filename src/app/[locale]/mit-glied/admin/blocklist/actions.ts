'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { hashEmail, hashIp } from '@/lib/hash';

/**
 * Ban-Mechanismus: Mail- und/oder IP-Hash auf die Blocklist setzen.
 *
 * Wird vom Inbox-Detail-Ban-Button und vom Blocklist-Page-Form aufgerufen.
 * Mail-Hash und IP-Hash werden separat geprüft — Reject mit doppelten
 * Einträgen über DB-Unique-Index (email_hash UNIQUE).
 *
 * Re-Auth via TOTP kommt mit dem Security-Block, bis dahin reicht das
 * Role-Check via requireAdmin().
 */
export async function banAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const service = createSupabaseServiceClient();

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const ip = String(formData.get('ip') ?? '').trim();
  const reason = String(formData.get('reason') ?? '').trim().slice(0, 500) || null;

  if (!email && !ip) return;

  const emailHash = email ? hashEmail(email) : null;
  const ipHash = ip ? hashIp(ip) : null;

  // Wenn nur IP gegeben, brauchen wir trotzdem einen email_hash (NOT NULL).
  // Konvention: leerer Hash für „nur IP gebannt"-Einträge.
  if (!emailHash) return;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'ban',
    target_type: 'blocklist',
    target_id: (inserted as { id: string }).id,
    metadata: { reason },
  });

  revalidatePath('/mit-glied/admin/blocklist');
  revalidatePath('/mit-glied/admin/audit');
}

/**
 * Unban: Blocklist-Eintrag entfernen + Audit-Log.
 */
export async function unbanAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
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
  const session = await requireAdmin();
  const storyId = String(formData.get('story_id') ?? '');
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

  // 3) Story rejecten
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

  // 5) User-Account löschen (cascade löscht profile, stories.user_id wird NULL
  //    via Migration 0004, approved Stories bleiben mit ihrem aktuellen
  //    Pseudonym sichtbar — kein „alter-"-Marker beim Ban, anders als beim
  //    self-delete)
  await service.auth.admin.deleteUser(userId);

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
