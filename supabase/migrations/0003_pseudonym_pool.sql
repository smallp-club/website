-- 0003_pseudonym_pool.sql
--
-- Pseudonym-Format von `leser-XXXX` auf brand-konformes Synonym aus Pool.
--
-- Doktrin-Wechsel 2026-06-23:
--   alt: `leser-7f3a` (tech-anonym, Hash-Klang)
--   neu: `schwengel`, `stolzer-pillermann`, `riemen-pisello` (Brand-Bekenntnis)
--
-- Bestehende Test-Accounts (Pseudonym matched `leser-*`) bekommen ein Bridge-
-- Pseudonym aus einem deterministisch-gewählten Mini-Pool. Beim nächsten
-- Pseudonym-Wechsel im Member-Slot kriegt der User einen Würfel-Vorschlag.
--
-- Pattern erlaubt 1–3 Wort-Teile, jeweils 3–18 Zeichen lowercase, optionale
-- Umlaute und gängige diakritische Marker (skandinavisch, romanisch, polnisch).

-- ─────────────────────────────────────────────────────────────────────────────
-- Schritt 1: alten Check-Constraint droppen.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  drop constraint if exists profiles_pseudonym_check;

-- ─────────────────────────────────────────────────────────────────────────────
-- Schritt 2: Bestehende `leser-*`-Pseudonyme auf Bridge-Werte setzen.
--
-- Mini-Pool von 16 brand-konformen Synonymen. Auswahl via hashtext(user_id)
-- ist deterministisch und ohne Kollisions-Risiko in Test-Daten (1–2 Accounts).
-- Bei mehreren Accounts mit gleichem Hash-Mod würde eine UNIQUE-Verletzung
-- auftreten — dann muss der zweite Account manuell auf einen anderen Wert.
-- ─────────────────────────────────────────────────────────────────────────────

update public.profiles
set pseudonym = (
  array[
    'schwengel', 'pillermann', 'schniedel', 'lümmel',
    'riemen', 'pimmel', 'dödel', 'zipfel',
    'piephahn', 'piepmatz', 'latte', 'bolzen',
    'kolben', 'zauberstab', 'stempel', 'schniedelwutz'
  ]
)[(abs(hashtext(user_id::text)) % 16) + 1]
where pseudonym ~ '^leser-';

-- ─────────────────────────────────────────────────────────────────────────────
-- Schritt 3: Neuer Check-Constraint.
--
-- Pattern: 1–3 Wort-Teile (Bindestrich-getrennt), jeweils 3–18 Zeichen,
-- lowercase Buchstaben + Umlaute + gängige Diakritika. Length-Range
-- 3–60 verhindert Pathological-Cases. Pool-Konformität (nur Wörter, die
-- der Generator produziert hätte) wird server-side in isValidPseudonym()
-- geprüft, nicht im DB-Constraint.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  add constraint profiles_pseudonym_check
  check (
    pseudonym ~ '^[a-zäöüßæøåœáéíóúçñłčďňřšťžćńśźżşğı]{3,18}(-[a-zäöüßæøåœáéíóúçñłčďňřšťžćńśźżşğı]{3,18}){0,2}$'
    and length(pseudonym) between 3 and 60
  );
