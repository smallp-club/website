/**
 * /mit-glied/admin/blocklist — Liste + manueller Block.
 *
 * Admin-only. Zeigt alle Blocklist-Einträge (Email-Hash + IP-Hash, beide
 * gekürzt zur Anzeige weil Volltext keinen Erkenntnisgewinn hat). Pro Eintrag:
 * Unban-Button. Plus Form unten zum manuellen Ban (Email-Adresse, optional
 * IP, optional Grund).
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { FormField } from '@/components/primitives/FormField';
import { Input } from '@/components/primitives/Input';
import { Textarea } from '@/components/primitives/Textarea';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireAdmin } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { BlocklistRow } from '@/lib/supabase/types';
import { banAction, unbanAction } from './actions';
import styles from './blocklist.module.css';

export const metadata = {
  title: 'admin · blocklist. — small p club',
  description: 'gesperrte mails und ips.',
  robots: { index: false, follow: false },
};

const DATE_TIME = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
});

function shortHash(h: string | null): string {
  if (!h) return '—';
  return `${h.slice(0, 8)}…${h.slice(-4)}`;
}

export default async function AdminBlocklistPage() {
  await requireAdmin();
  const service = createSupabaseServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocklistTable = service.from('blocklist') as any;
  const { data, error } = await blocklistTable
    .select('*')
    .order('banned_at', { ascending: false })
    .limit(200);

  if (error) console.error('[admin-blocklist]', error);

  const rows: BlocklistRow[] = (data as BlocklistRow[] | null) ?? [];

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="blocklist hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · blocklist</Eyebrow>
            <Heading level={1} variant="display">
              blocklist.
            </Heading>
            <Body>
              {rows.length} eintr{rows.length === 1 ? 'ag' : 'äge'} aktiv.
              hash-prefix sichtbar, volltext nicht — pro eintrag unban-button.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="liste">
        <Container width="prose">
          {rows.length === 0 ? (
            <Stack gap={3}>
              <Eyebrow>leer</Eyebrow>
              <Heading level={2} variant="lede">
                niemand gesperrt.
              </Heading>
              <Body tone="muted">
                via inbox-detail-ban oder manuell unten.
              </Body>
            </Stack>
          ) : (
            <ul className={styles.list} role="list">
              {rows.map((row) => (
                <li key={row.id} className={styles.entry}>
                  <div className={styles.entryHeader}>
                    <span className={styles.hash}>email: {shortHash(row.email_hash)}</span>
                    {row.ip_hash && (
                      <span className={styles.hash}>ip: {shortHash(row.ip_hash)}</span>
                    )}
                  </div>
                  {row.reason && <p className={styles.reason}>{row.reason}</p>}
                  <div className={styles.entryFooter}>
                    <span className={styles.timestamp}>
                      seit {DATE_TIME.format(new Date(row.banned_at))}
                    </span>
                    <form action={unbanAction} className={styles.unbanForm}>
                      <input type="hidden" name="blocklist_id" value={row.id} />
                      <SubmitButton variant="ghost" loadingLabel="entsperre …">
                        entsperren
                      </SubmitButton>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="manueller-ban">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>manueller ban</Eyebrow>
            <Heading level={2} variant="lede">
              jemanden gezielt sperren.
            </Heading>
            <Body tone="muted">
              email-adresse pflicht, ip optional. hashes werden serverseitig
              gebildet — klartext landet niemals in der db.
            </Body>
            <form action={banAction} className={styles.banForm}>
              <FormField
                label="email-adresse"
                helperText="wird sofort sha-256 gehasht."
              >
                <Input type="email" name="email" required placeholder="user@beispiel.de" />
              </FormField>
              <FormField
                label="ip-adresse (optional)"
                helperText="ipv4 oder ipv6, wird ebenfalls gehasht."
              >
                <Input type="text" name="ip" placeholder="z.b. 203.0.113.1" />
              </FormField>
              <FormField
                label="grund (optional)"
                helperText="interner vermerk, nur für admin sichtbar."
              >
                <Textarea name="reason" rows={3} maxLength={500} />
              </FormField>
              <SubmitButton variant="destructive" loadingLabel="sperre …">
                sperren
              </SubmitButton>
            </form>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="tight" aria-label="zurück">
        <Container width="prose">
          <Caption tone="muted" as="p" className={styles.captionStack}>
            re-auth via totp kommt mit dem security-block.
          </Caption>
          <LinkButton href="/mit-glied/admin" variant="ghost">
            ← zurück zum dashboard
          </LinkButton>
        </Container>
      </Section>
    </main>
  );
}
