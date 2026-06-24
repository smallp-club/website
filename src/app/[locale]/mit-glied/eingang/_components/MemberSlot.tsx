/**
 * MemberSlot — Inline-Block mit Pseudonym, Beitritts-Datum, Logout-Buttons.
 *
 * Konzept: MEMBER_CONCEPT.md §6 schlägt einen Drawer von rechts vor. Heute
 * als statischer Inline-Block — Drawer-Polish kommt sobald SiteNav um eine
 * Member-Pille erweitert ist, die ihn öffnet.
 *
 * Keine Settings-Page, keine Notification-Preferences (Mail-Präferenzen leben
 * im Newsletter-Footer). Account-Löschung als ruhiger Link.
 */

import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Button } from '@/components/primitives/Button';
import { LinkButton } from '@/components/primitives/LinkButton';
import type { ProfileRole } from '@/lib/supabase/types';
import { logoutAction, toggleNewsletterAction } from '../actions';
import styles from './MemberSlot.module.css';

interface MemberSlotProps {
  pseudonym: string;
  joinedDate: string;
  role: ProfileRole;
  newsletterOptIn: boolean;
}

export function MemberSlot({
  pseudonym,
  joinedDate,
  role,
  newsletterOptIn,
}: MemberSlotProps) {
  return (
    <Stack gap={5}>
      <Stack gap={3}>
        <Eyebrow>dein slot</Eyebrow>
        <Heading level={2} variant="lede">
          das hier bist du, in vier zeilen.
        </Heading>
      </Stack>

      <dl className={styles.dl}>
        <div className={styles.row}>
          <dt className={styles.dt}>pseudonym</dt>
          <dd className={styles.dd}>{pseudonym}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.dt}>beigetreten</dt>
          <dd className={styles.dd}>{joinedDate}</dd>
        </div>
        {role === 'admin' && (
          <div className={styles.row}>
            <dt className={styles.dt}>rolle</dt>
            <dd className={styles.dd}>admin</dd>
          </div>
        )}
      </dl>

      <Stack gap={3}>
        <Eyebrow>newsletter</Eyebrow>
        <Body>
          {newsletterOptIn
            ? 'du bekommst den newsletter. viermal im jahr, plus wenn was wichtig ist.'
            : 'du bekommst den newsletter nicht. kannst du jederzeit ändern.'}
        </Body>
        <form action={toggleNewsletterAction} className={styles.actionRow}>
          {!newsletterOptIn && <input type="hidden" name="enable" value="on" />}
          <Button type="submit" variant={newsletterOptIn ? 'ghost' : 'accent'}>
            {newsletterOptIn ? 'newsletter abbestellen' : 'newsletter abonnieren'}
          </Button>
        </form>
      </Stack>

      <Stack gap={3}>
        <LinkButton href="/mit-glied/karte" variant="accent">
          deine mit-glied-karte
        </LinkButton>
        <form action={logoutAction} className={styles.actionRow}>
          <Button type="submit" variant="primary">
            ausloggen
          </Button>
        </form>
        <form action={logoutAction} className={styles.actionRow}>
          <input type="hidden" name="scope" value="global" />
          <Button type="submit" variant="ghost">
            auf allen geräten ausloggen
          </Button>
        </form>
        <LinkButton href="/mit-glied/loeschen" variant="ghost">
          diesen account löschen
        </LinkButton>
      </Stack>
    </Stack>
  );
}
