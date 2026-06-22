import { HeroLanding } from '@/components/sections/HeroLanding';
import { RecognitionBlock } from '@/components/sections/RecognitionBlock';
import { MythosReveal } from '@/components/sections/MythosReveal';

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroLanding />
      <RecognitionBlock />
      <MythosReveal />
    </main>
  );
}
