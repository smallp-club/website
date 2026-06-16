import { StatPairTopo } from './index';

export function StatPairTopoDemo() {
  return (
    <StatPairTopo
      label="Zahlen-Paar mit Topografie"
      primary={85}
      secondary={55}
      leadLine="85 % der Partnerinnen zufrieden. 55 % der Männer mit sich selbst."
      punchline="Der Gap sitzt im Kopf, nicht in der Hose."
      source="Lever et al., Psychology of Men & Masculinity, 2006, n=52.031"
    />
  );
}
