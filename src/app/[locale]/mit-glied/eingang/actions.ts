'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Logout — beendet die aktuelle Session.
 *
 * `scope: 'global'` revokiert alle aktiven Sessions des Users (alle Geräte),
 * was Doktrin MEMBER_CONCEPT.md §6 als first-class Feature verlangt.
 * `scope: 'local'` beendet nur das aktuelle Gerät.
 */

export async function logoutAction(formData: FormData) {
  const allDevices = formData.get('scope') === 'global';
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: allDevices ? 'global' : 'local' });
  redirect('/');
}
