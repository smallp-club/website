import { unstable_cache } from 'next/cache';
import { Footer } from './index';
import { getMemberCount } from '@/lib/members/count';

const getCachedMemberCount = unstable_cache(getMemberCount, ['site-footer:member-count'], {
  revalidate: 3600,
  tags: ['members'],
});

/** Server-Wrapper: holt die Memberzahl gecacht (1h, Tag `members`). */
export async function FooterContainer() {
  const memberCount = await getCachedMemberCount();
  return <Footer memberCount={memberCount} />;
}
