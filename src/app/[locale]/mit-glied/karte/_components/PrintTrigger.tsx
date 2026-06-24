'use client';

import { Button } from '@/components/primitives/Button';

export function PrintTrigger() {
  return (
    <Button type="button" variant="primary" onClick={() => window.print()}>
      drucken oder als pdf speichern
    </Button>
  );
}
