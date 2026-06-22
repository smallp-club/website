import { HeroLanding } from '@/components/sections/HeroLanding';
import { RecognitionBlock } from '@/components/sections/RecognitionBlock';
import { MythosReveal } from '@/components/sections/MythosReveal';
import { StatsLanding } from '@/components/sections/StatsLanding';
import { BewegungsSignal } from '@/components/sections/BewegungsSignal';
import { ShopPlaceholder } from '@/components/sections/ShopPlaceholder';

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroLanding />
      <RecognitionBlock />
      <MythosReveal />
      <StatsLanding />
      <BewegungsSignal />
      <ShopPlaceholder />
    </main>
  );
}
