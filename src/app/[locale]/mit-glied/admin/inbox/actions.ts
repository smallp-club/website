'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

/**
 * Approve oder Reject eines Berichts.
 *
 * Beide Aktionen schreiben einen Eintrag in `admin_audit_log`. Approve setzt
 * zusätzlich `approved_at` und `approved_by` — der Bericht erscheint dann
 * auf `/stimmen` (Public-Wall kommt als eigener Sub-Bau).
 *
 * Re-Auth-Check (TOTP) kommt mit der Admin-Foundation-Phase. Dieser Stub
 * geht davon aus, dass der Admin-Account schon Role 'admin' hat.
 */

export async function approveStoryAction(formData: FormData): Promise<void> {
  const storyId = String(formData.get('story_id') ?? '');
  if (!storyId) return;

  const session = await requireAdminWithMfa();
  const service = createSupabaseServiceClient();
  const now = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { error } = await storiesTable
    .update({
      status: 'approved',
      approved_at: now,
      approved_by: session.user.id,
    })
    .eq('id', storyId);

  if (error) {
    console.error('[admin-approve]', error);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'approve',
    target_type: 'story',
    target_id: storyId,
  });

  revalidatePath('/mit-glied/admin/inbox');
  revalidatePath('/mit-glied/admin/inbox/' + storyId);
  revalidatePath('/stimmen');
}

export async function rejectStoryAction(formData: FormData): Promise<void> {
  const storyId = String(formData.get('story_id') ?? '');
  if (!storyId) return;

  const session = await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { error } = await storiesTable
    .update({ status: 'rejected' })
    .eq('id', storyId);

  if (error) {
    console.error('[admin-reject]', error);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'reject',
    target_type: 'story',
    target_id: storyId,
  });

  revalidatePath('/mit-glied/admin/inbox');
  revalidatePath('/mit-glied/admin/inbox/' + storyId);
}
