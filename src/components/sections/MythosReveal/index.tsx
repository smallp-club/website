import { PullFocusGrid } from '@/components/patterns/PullFocusGrid';
import { LANDING_MYTHEN } from './mythen';

export function MythosReveal() {
  return <PullFocusGrid items={LANDING_MYTHEN} id="mythos-reveal" />;
}
