import { PullFocusGrid, type PullFocusItem } from './index';

const items: readonly PullFocusItem[] = [
  { id: 'humor',  myth: 'Wer drüber lacht, der hat kein Problem damit.', fact: 'Der Witz schützt, statt zu beweisen, dass keiner nötig wäre.',                       source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019' },
  { id: 'schuh',  myth: 'Schuhgröße verrät Penisgröße.',                  fact: 'Die Datenlage zeigt keine signifikante Korrelation. Der Mythos hält sich trotzdem.', source: 'Veale et al., BJU International, 2015, n=15.521' },
  { id: 'frauen', myth: 'Frauen wollen größere Penisse.',                 fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.',         source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+' },
  { id: 'porno',  myth: 'Pornos zeigen realistische Größen.',             fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.',                source: 'Skoda & Pedersen, SAGE Open, 2019' },
] as const;

export function PullFocusGridDemo() {
  return <PullFocusGrid label="Pull-Focus" items={items} />;
}
