import { StickyCrossfade } from '@/components/patterns/StickyCrossfade';
import { LANDING_MYTHEN } from './mythen';

export function MythosReveal() {
  return (
    <>
      {LANDING_MYTHEN.map(item => (
        <StickyCrossfade
          key={item.id}
          id={item.id}
          myth={item.myth}
          fact={item.fact}
          source={item.source}
        />
      ))}
    </>
  );
}
