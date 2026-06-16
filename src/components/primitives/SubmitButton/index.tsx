'use client';

import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from '../Button';

export interface SubmitButtonProps extends Omit<ButtonProps, 'type' | 'loading'> {
  /**
   * Label während Submit. Default „Wird gesendet…". Brand-Voice: kein Spinner allein,
   * Label-Wechsel vermittelt Geduld.
   */
  loadingLabel?: string;
}

/**
 * SubmitButton — dünner Wrapper um `Button`, der `useFormStatus()` liest und
 * Loading + Disabled automatisch setzt. Funktioniert nur innerhalb `<form action={…}>`
 * mit Server Action.
 *
 * Während pending: Button-Label wechselt, `aria-busy`, disabled. Kein Spinner —
 * Brand-Voice ist ruhig, nicht hektisch.
 */
export function SubmitButton({ loadingLabel = 'Wird gesendet …', children, ...rest }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} {...rest}>
      {pending ? loadingLabel : children}
    </Button>
  );
}
