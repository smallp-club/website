'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Einlogg-Formular. Mit `auto` löst es sich beim Laden einmal selbst aus.
 * Mailfilter, die Links nur abrufen, führen kein JavaScript aus und verbrauchen
 * den Link so nicht. Der Knopf bleibt als Rückfall, falls das Auslösen nicht greift.
 * `auto` nur setzen, wenn dieser Browser den Link selbst angefordert hat
 * (Login-CSRF, siehe lib/members/login-pending.ts).
 */
export function AutoSubmitForm({
  auto,
  className,
  children,
}: {
  auto: boolean;
  className?: string;
  children: ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (!auto || sent.current) return;
    sent.current = true;
    formRef.current?.requestSubmit();
  }, [auto]);

  return (
    <form ref={formRef} method="post" action="/auth/verify" className={className}>
      {children}
    </form>
  );
}
