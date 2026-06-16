import { StatPair } from './index';

export function StatPairDemo() {
  return (
    <StatPair
      label="Zahlen-Paar"
      primary={{ value: 85, label: 'der Partnerinnen sind zufrieden mit der Penisgröße ihres Partners.' }}
      secondary={{ value: 55, label: 'der Männer sagen das über sich selbst.' }}
      source="Lever et al., Psychology of Men & Masculinity, 2006, n=52.031"
    />
  );
}
