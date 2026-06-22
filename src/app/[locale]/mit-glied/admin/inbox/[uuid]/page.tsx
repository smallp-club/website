import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'admin · einreichung. — small p club',
  description: 'einzelne admin-detail-ansicht einer eingereichten erfahrung.',
  robots: { index: false, follow: false },
};

export default function AdminInboxDetailPage() {
  return (
    <PageStub
      eyebrow="mit-glied · admin · inbox · detail"
      title="eine einreichung."
      lead="kuratierungs-detail für kevin. drei-stufen-moderation-output (hard-reject, flag-high, flag-low, pass) plus volltext, pseudonym, alter-range, flags-detail. approve oder reject oder ban."
      skeleton={[
        { label: 'header · pseudonym + meta', meta: 'leser-xxxx, einreichungs-zeit, prompt, alter-range (optional)' },
        { label: 'flag-streifen', meta: 'lozenge oben — flag-high vor flag-low, slate-farbe, caption-größe' },
        { label: 'body-volltext', meta: 'unredigiert, original-version, scrollbar wenn lang. kein syntax-highlight' },
        { label: 'flag-detail-liste', meta: 'jeder match mit treffer-token (z. b. „suizid: wollte mich umbringen")' },
        { label: 'aktionen', meta: 'durchlassen (accent), nicht durch (signal), sperren (ink) — ban verlangt totp-re-auth' },
        { label: 'audit-fußzeile', meta: 'kurzer eintrag der letzten admin-aktion auf dieser einreichung' },
      ]}
      phase="kommt mit phase 5a (admin-bereich + drei-stufen-moderation)."
      note="role-check pflicht (profiles.role = admin), kurze session-timeout (2h), audit-log auf jede aktion."
    />
  );
}
