export interface MythosRevealItem {
  id: string;
  myth: string;
  fact: string;
  source: string;
}

export const LANDING_MYTHEN: MythosRevealItem[] = [
  {
    id: 'mythos-vergleichsdruck',
    myth: 'die meisten männer sind größer als ich.',
    fact: 'die meisten schätzen sich kleiner ein als sie sind. neun von zehn.',
    source: 'Veale et al., BJU International, 2015, n=15.521',
  },
  {
    id: 'mythos-partner-zufriedenheit',
    myth: 'partner sind damit nicht zufrieden.',
    fact: '85 prozent der partner sind zufrieden. nur 55 prozent der männer.',
    source: 'Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52.000',
  },
  {
    id: 'mythos-humor-schutzschild',
    myth: 'wer drüber lacht, hat kein problem damit.',
    fact: 'der witz ist die rüstung, nicht der beweis.',
    source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019',
  },
];
