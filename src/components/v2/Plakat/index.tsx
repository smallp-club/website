import { MYTHS } from '@/content/data/myths';
import { getCachedMemberCount } from '@/lib/members/cached-count';
import { memberCountVoice } from '@/lib/members/count';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PROMPT_OPTIONS } from '@/app/[locale]/mit-glied/erfahrungen/neu/story-types';
import { Gap } from './Gap';
import { Hero } from './Hero';
import { Join } from './Join';
import { MythPaste } from './MythPaste';
import { Recognition } from './Recognition';
import { Stickers } from './Stickers';
import { Voices, type VoiceNote } from './Voices';
import styles from './Plakat.module.css';

const NOTE_COUNT = 6;
const MAX_NOTE_CHARS = 150;

/** Kürzt an einer Wortgrenze, damit ein Zettel ein Zettel bleibt. */
function trim(body: string): string {
  const t = body.trim().replace(/\s+/g, ' ');
  if (t.length <= MAX_NOTE_CHARS) return t;
  const cut = t.slice(0, MAX_NOTE_CHARS);
  return `${cut.slice(0, cut.lastIndexOf(' '))} …`;
}

/** Freigegebene Berichte, aufgefüllt mit leeren Prompt-Zetteln. Nie erfunden. */
async function loadNotes(): Promise<VoiceNote[]> {
  const notes: VoiceNote[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('stories') as any;
    const { data } = await table
      .select('id, pseudonym, body')
      .eq('status', 'approved')
      .order('approved_at', { ascending: false })
      .limit(NOTE_COUNT);
    for (const r of (data as { id: string; pseudonym: string; body: string }[] | null) ?? []) {
      notes.push({ kind: 'story', id: r.id, body: trim(r.body), pseudonym: r.pseudonym });
    }
  } catch {
    // Ohne Supabase-Config rendert die Wand nur Prompt-Zettel.
  }
  // Höchstens zwei leere Zettel als Einladung, sonst liest sich die Wand
  // wie ein unausgefülltes Formular. Mindestens drei Zettel hängen immer.
  let prompts = 0;
  for (const p of PROMPT_OPTIONS) {
    if (notes.length >= NOTE_COUNT || (prompts >= 2 && notes.length >= 3)) break;
    notes.push({ kind: 'prompt', id: p.key, prompt: p.label });
    prompts += 1;
  }
  return notes;
}

/**
 * Plakatnacht — Startseite V2 (Branch v2-redesign).
 *
 * Eine Kampagne an der Wand: nachts wird gekleistert, tags bleibt einer
 * stehen, der Mythos wird überklebt, die Zahl hängt schwarz an der Wand,
 * Zettel mit Stimmen, das Beitrittsplakat, Sticker im Alltag.
 * Entscheidungsprotokoll: ~/.claude/team/projekte/smallp-v2/.
 */
export async function Plakatnacht({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const myth = MYTHS[0]!;
  const [notes, count] = await Promise.all([loadNotes(), getCachedMemberCount()]);

  return (
    <main id="main-content" className={styles.page}>
      <Hero />
      <Recognition />
      <MythPaste myth={myth.myth} fact={myth.fact} source={myth.sourceShort} href="/mythen" />
      <Gap />
      <Voices notes={notes} />
      <Join turnstileSiteKey={turnstileSiteKey} countLine={memberCountVoice(count)} />
      <Stickers />
    </main>
  );
}
