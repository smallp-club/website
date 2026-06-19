import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'audit. — admin',
  robots: { index: false, follow: false },
};

export default function AdminAuditPage() {
  return (
    <PageStub
      eyebrow="admin · audit-log"
      title="audit-spur."
      lead="log der letzten 100 admin-aktionen mit filter. wer hat was wann gemacht."
      skeleton={[
        { label: 'admin-header', meta: 'pseudonym-pille plus rollen-band' },
        { label: 'eyebrow plus h1', meta: '„audit-spur." plus „wer hat was wann"' },
        { label: 'filter-zeile', meta: 'admin (welcher), action (approve, reject, ban, role-change), zeitraum' },
        { label: 'audit-liste', meta: 'pro eintrag: timestamp, admin-id, action, target-type plus target-id, metadata-jsonb' },
        { label: 'admin-footer', meta: 'audit-spur am bottom (sich selbst referenzierend, leise)' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="datenstruktur: admin_audit_log tabelle in supabase. jede admin-aktion schreibt einen eintrag. unveränderbar (kein update, kein delete). retention: unbefristet."
    />
  );
}
