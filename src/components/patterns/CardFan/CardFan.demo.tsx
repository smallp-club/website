import { CardFan, type CardFanItem } from './index';

const items: readonly CardFanItem[] = [
  { id: 'luecke', eyebrow: 'Forschung',   headline: 'Die Lücke im Kopf',         body: '91 % glauben sie seien zu klein. Klinisch trifft es 2 %. Der Rest ist Wahrnehmung.', cta: 'Mehr dazu', href: '#' },
  { id: 'witz',   eyebrow: 'Psychologie', headline: 'Der Witz als Schutzschild', body: 'Wer drüber lacht, kommt dem Spott zuvor. Aber der Schild wird zur Identität.',       cta: 'Lesen',     href: '#' },
  { id: 'kluft',  eyebrow: 'Daten',        headline: '85 zufrieden, 55 nicht',    body: '85 % der Partnerinnen zufrieden. 55 % der Männer mit sich selbst. Die Lücke sitzt im Kopf.', cta: 'Quellen',  href: '#' },
  { id: 'spec',   eyebrow: 'Phänomen',     headline: 'Spectatoring',              body: 'Wer sich beim Sex selbst bewertet, verliert genau das, wovor er sich schämt.',           cta: 'Erklärt',   href: '#' },
] as const;

export function CardFanDemo() {
  return <CardFan label="Karten-Fächer" items={items} />;
}
