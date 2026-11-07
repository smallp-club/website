/**
 * /mit-glied/admin/mitglieder — alle Mit-Glieder auf einen Blick (V2).
 *
 * Bewusst ohne Mail-Adresse und ohne „zuletzt aktiv": MEMBER_CONCEPT §8
 * (kein Verhaltens-Tracking) und „was member gibt, sieht member. sonst
 * nichts." Gezeigt wird nur, was im Profil steht, plus Berichte-Zahl.
 */

import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { ProfileRow, StoryStatus } from '@/lib/supabase/types';
import { PageHead, Wide, EndLink } from '@/components/v2/Page';
import { anton } from '@/components/v2/Plakat/fonts';
import { ShellWrap } from '../../_components/MemberShell';
import { MemberPage } from '../../_components/MemberPage';
import ui from '../_components/adminUi.module.css';

export const metadata = {
  title: 'admin · mit-glieder.',
  description: 'alle mit-glieder.',
  robots: { index: false, follow: false },
};

const DATE = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

type Profile = Pick<
  ProfileRow,
  'user_id' | 'pseudonym' | 'role' | 'newsletter_opt_in' | 'onboarding_completed_at' | 'created_at'
>;

export default async function AdminMembersPage() {
  const session = await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  const [{ data: profileData, error: profileError }, { data: storyData, error: storyError }] =
    await Promise.all([
      service
        .from('profiles')
        .select('user_id, pseudonym, role, newsletter_opt_in, onboarding_completed_at, created_at')
        .order('created_at', { ascending: false })
        .limit(1000),
      service.from('stories').select('user_id, status').not('user_id', 'is', null),
    ]);

  if (profileError) console.error('[admin-mitglieder] profiles', profileError);
  if (storyError) console.error('[admin-mitglieder] stories', storyError);

  const profiles = (profileData as Profile[] | null) ?? [];
  const stories = (storyData as Array<{ user_id: string; status: StoryStatus }> | null) ?? [];

  const storyCounts = new Map<string, { total: number; approved: number }>();
  for (const s of stories) {
    const c = storyCounts.get(s.user_id) ?? { total: 0, approved: 0 };
    c.total += 1;
    if (s.status === 'approved') c.approved += 1;
    storyCounts.set(s.user_id, c);
  }

  const total = profiles.length;
  const newsletter = profiles.filter((p) => p.newsletter_opt_in).length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const lastWeek = profiles.filter((p) => new Date(p.created_at).getTime() > weekAgo).length;
  const writers = storyCounts.size;

  return (
    <ShellWrap session={session} pageLabel="mit-glieder">
      <MemberPage>
        <PageHead
          eyebrow="mit-glieder"
          title="wer dabei ist."
          lead="pseudonym, beitritt, berichte. keine mail-adressen, kein „zuletzt aktiv“. mehr brauchst du hier nicht."
          size="compact"
          wall="night"
        />

        <div className={anton.variable}>
          <Wide label="zahlen">
            <h2 className={ui.blockTitle}>zahlen</h2>
            <dl className={ui.stats}>
              <Stat label="mit-glieder" value={total} />
              <Stat label="neu (7 tage)" value={lastWeek} accent={lastWeek > 0} />
              <Stat label="newsletter" value={newsletter} />
              <Stat label="haben geschrieben" value={writers} />
            </dl>
          </Wide>
        </div>

        <Wide label="liste">
          <h2 className={ui.blockTitle}>liste</h2>
          {total === 0 ? (
            <p className={ui.empty}>noch niemand da.</p>
          ) : (
            <ul className={ui.rows} role="list">
              {profiles.map((p) => {
                const c = storyCounts.get(p.user_id);
                return (
                  <li key={p.user_id} className={ui.row}>
                    <div className={ui.rowStatic}>
                      <div className={ui.rowHead}>
                        <span className={ui.rowTitle}>{p.pseudonym}</span>
                        <span className={ui.time}>seit {DATE.format(new Date(p.created_at))}</span>
                      </div>
                      <div className={ui.rowMeta}>
                        {p.role === 'admin' && <span className={ui.status}>admin</span>}
                        <span>
                          {c
                            ? `${c.total} bericht${c.total === 1 ? '' : 'e'}, ${c.approved} durch`
                            : 'keine berichte'}
                        </span>
                        <span>newsletter {p.newsletter_opt_in ? 'ja' : 'nein'}</span>
                        {!p.onboarding_completed_at && <span>onboarding offen</span>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Wide>

        <EndLink line="zurück" href="/mit-glied/admin" label="zum dashboard" />
      </MemberPage>
    </ShellWrap>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={ui.stat} data-accent={accent || undefined}>
      <dt className={ui.statLabel}>{label}</dt>
      <dd className={ui.statValue}>{value.toLocaleString('de-DE')}</dd>
    </div>
  );
}
