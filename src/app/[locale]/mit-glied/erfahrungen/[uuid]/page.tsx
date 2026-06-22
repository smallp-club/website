import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'erfahrungsbericht. — small p club',
  description: 'einzelne erfahrungsberichte, hinter login, pseudonym.',
  robots: { index: false, follow: false },
};

export default function StoryDetailPage() {
  return (
    <PageStub
      eyebrow="mit-glied · erfahrungen · einzeln"
      title="ein bericht."
      lead="einzelner erfahrungsbericht im member-bereich. uuid im pfad ist nicht enumerier-bar, nur per direkt-link erreichbar. brand-stille statt liste-im-stil-eines-forums."
      skeleton={[
        { label: 'header · prompt-zeile', meta: 'der gewählte prompt („das hab ich mal geglaubt." etc.) als kapitel-marker' },
        { label: 'body · pseudonymer text', meta: 'chillax-light, prose-breite, satzfluss ohne avatar, kein like-button' },
        { label: 'pseudonym-zeile · datum', meta: 'leser-xxxx + relativer zeitstempel („vor zwei wochen")' },
        { label: 'leise rückkehr', meta: 'ein link „zurück zu allen berichten" — kein „nächster bericht", kein engagement-loop' },
      ]}
      phase="kommt mit phase 5 (member-bereich + supabase rls)."
      note="uuid-format pflicht, kein numerischer index. outing-schutz: pfade verraten keine reihenfolge, keinen autor."
    />
  );
}
