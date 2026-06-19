import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'admin. — mit-glied',
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <PageStub
      eyebrow="admin · dashboard"
      title="admin."
      lead="counts (pending heute, pending gesamt, letzte 24h, flag-high ungesichtet). schnell-links zu inbox, blocklist, audit-log, brigading-quarantäne."
      skeleton={[
        { label: 'admin-header', meta: 'pseudonym-pille plus rollen-band „admin", audit-link rechts' },
        { label: 'eyebrow plus h1', meta: '„admin." plus kurz-statement' },
        { label: 'counts-grid', meta: 'vier zahlen: pending heute, pending gesamt, letzte 24h, flag-high ungesichtet' },
        { label: 'schnell-links', meta: 'inbox, blocklist, audit-log, brigading (sub-routes)' },
        { label: 'admin-footer', meta: 'audit-spur am bottom (letzte aktion)' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="protection: role-check via rls plus totp-2fa-pflicht plus 2h-idle-timeout plus audit-log aller aktionen. server-side render, kein client-state für bericht-inhalte."
    />
  );
}
