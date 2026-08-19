"use client";

import { VoiceCard } from "@/components/voice-library/VoiceCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import { useVoicePlayer } from "@/lib/useVoicePlayer";
import {
  ALL,
  CATEGORY_FILTERS,
  filterVoices,
  LANGUAGE_FILTERS,
  TONE_COLORS,
  TONE_FILTERS,
  voices as allVoices,
  type CategoryFilter,
  type LanguageFilter,
  type Voice,
  type VoiceTone,
} from "@/lib/voices";
import { motion, useInView } from "framer-motion";
import { Mic, Search, Sparkles } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface VoiceLibraryProps {
  /** Anchor target, e.g. for a nav link. */
  id?: string;
  /**
   * "h1" when this section carries the page's main heading — the dedicated
   * /resources/voice-library route — otherwise leave it at "h2".
   */
  headingLevel?: "h1" | "h2";
  /**
   * Optional brand lockup rendered above the eyebrow. Kept as a slot so the
   * section stays brand-agnostic and drops into any host site unchanged.
   */
  brand?: ReactNode;
  eyebrow?: string;
  intro?: ReactNode;
  /** Override the voice set, e.g. to show a curated subset elsewhere. */
  voices?: Voice[];
  className?: string;
}

/** Dark pill, used for the language and category groups. */
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors focus-ring",
        active
          ? "bg-ink text-white"
          : "border border-border bg-surface text-ink-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function VoiceLibrary({
  id = "voice-library",
  headingLevel = "h2",
  brand,
  eyebrow = "Voice Library",
  intro,
  voices = allVoices,
  className,
}: VoiceLibraryProps) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<LanguageFilter>(ALL);
  const [category, setCategory] = useState<CategoryFilter>(ALL);
  const [tone, setTone] = useState<typeof ALL | VoiceTone>(ALL);

  const player = useVoicePlayer();
  const headlineRef = useRef<HTMLSpanElement>(null);
  const headlineInView = useInView(headlineRef, { once: true });

  const filtered = useMemo(
    () => filterVoices(voices, { search, language, category, tone }),
    [voices, search, language, category, tone],
  );

  const Heading = headingLevel;
  const isFiltered = Boolean(search) || language !== ALL || category !== ALL || tone !== ALL;

  const clearFilters = () => {
    setSearch("");
    setLanguage(ALL);
    setCategory(ALL);
    setTone(ALL);
  };

  return (
    <section id={id} className={cn("bg-bg", className)}>
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-[100px]"
          style={{ background: "rgba(255, 208, 0, 0.10)" }}
        />

        <div className="relative mx-auto max-w-[800px] px-6 text-center md:px-10">
          {brand && <div className="mb-9 md:mb-11">{brand}</div>}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="flex justify-center"
          >
            <Eyebrow icon={<span className="block h-1.5 w-1.5 rounded-full bg-accent" />}>
              {eyebrow}
            </Eyebrow>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          >
            <Heading className="section-heading mt-5 font-display text-ink">
              Find the perfect{" "}
              <span
                ref={headlineRef}
                className={cn("accent-underline", headlineInView && "is-revealed")}
              >
                voice
              </span>{" "}
              for your business
            </Heading>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28, ease: EASE }}
            className="mx-auto mt-5 max-w-lg text-[17px] leading-relaxed text-ink-muted"
          >
            {intro ?? (
              <>
                {voices.length} professional AI voices, previewed straight from ElevenLabs, across
                conversational, narrative, advertising and character reads. Pick the one that sounds
                like your business and put it on your phone line.
              </>
            )}
          </motion.p>
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-surface shadow-soft">
        <div className="mx-auto max-w-[1240px] px-6 py-4 md:px-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="relative w-full max-w-[240px]">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search voices..."
                aria-label="Search voices"
                className="w-full rounded-xl border border-border bg-bg py-2 pl-9 pr-4 text-[13px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-[rgba(255,208,0,0.25)]"
              />
            </div>

            <div aria-hidden className="hidden h-5 w-px bg-border sm:block" />

            <div role="group" aria-label="Filter by language" className="flex flex-wrap gap-1">
              {LANGUAGE_FILTERS.map((option) => (
                <FilterPill
                  key={option}
                  active={language === option}
                  onClick={() => setLanguage(option)}
                >
                  {option}
                </FilterPill>
              ))}
            </div>

            <div aria-hidden className="hidden h-5 w-px bg-border sm:block" />

            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1">
              {CATEGORY_FILTERS.map((option) => (
                <FilterPill
                  key={option}
                  active={category === option}
                  onClick={() => setCategory(option)}
                >
                  {option}
                </FilterPill>
              ))}
            </div>
          </div>

          <div
            role="group"
            aria-label="Filter by tone"
            className="mt-3 flex flex-wrap justify-center gap-1.5 pb-1"
          >
            {TONE_FILTERS.map((option) => {
              const active = tone === option;
              const swatch = option === ALL ? null : TONE_COLORS[option];

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTone(option)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-medium transition-opacity focus-ring",
                    active ? "ring-2 ring-[rgba(24,19,10,0.3)]" : "opacity-70 hover:opacity-100",
                    option === ALL &&
                      (active
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-surface-muted text-ink-muted"),
                  )}
                  style={
                    swatch
                      ? { backgroundColor: swatch.bg, color: swatch.text, borderColor: swatch.bg }
                      : undefined
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1240px] px-6 py-12 md:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] text-ink-muted" aria-live="polite">
            Showing <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
            {voices.length} voices
          </p>
          <span className="flex items-center gap-1.5 text-[12px] text-ink-faint">
            <Sparkles aria-hidden className="h-3.5 w-3.5 text-accent" />
            Click play to preview
          </span>
        </div>

        {filtered.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((voice, index) => {
              const isActive = player.activeSlug === voice.slug;

              return (
                <li key={voice.slug} className="h-full">
                  <VoiceCard
                    voice={voice}
                    index={index}
                    isActive={isActive}
                    status={isActive ? player.status : "idle"}
                    // Zeroed for inactive cards so VoiceCard's memo actually
                    // holds while the active clip ticks its progress.
                    progress={isActive ? player.progress : 0}
                    currentTime={isActive ? player.currentTime : 0}
                    onToggle={player.toggle}
                    onSeek={player.seek}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-20 text-center">
            <Mic aria-hidden className="mx-auto mb-4 h-10 w-10 text-ink-faint" />
            <p className="text-[15px] text-ink-muted">No voices match your filters.</p>
            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-[13px] font-semibold text-ink underline focus-ring"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
