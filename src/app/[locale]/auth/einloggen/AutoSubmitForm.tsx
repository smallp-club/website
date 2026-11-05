'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Löst das Einlogg-Formular beim Laden einmal selbst aus. Mailfilter, die Links
 * nur abrufen, führen kein JavaScript aus und verbrauchen den Link so nicht.
 * Der Knopf im Formular bleibt als Rückfall, falls das Auslösen nicht greift.
 */
export function AutoSubmitForm({ className, children }: { className?: string; children: ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form ref={formRef} method="post" action="/auth/verify" className={className}>
      {children}
    </form>
  );
}
