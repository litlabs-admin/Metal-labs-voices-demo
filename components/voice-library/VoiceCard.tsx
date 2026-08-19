"use client";

import { VoiceWaveform } from "@/components/voice-library/VoiceWaveform";
import { cn } from "@/lib/cn";
import type { VoicePlayerStatus } from "@/lib/useVoicePlayer";
import { describeLanguages, formatLanguages, TONE_COLORS, type Voice } from "@/lib/voices";
import { motion } from "framer-motion";
import { Loader2, Pause, Play } from "lucide-react";
import { memo, type KeyboardEvent, type MouseEvent } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Arrow-key seek step, as a fraction of the clip. */
const SEEK_STEP = 0.05;

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  return `${Math.floor(safe / 60)}:${String(Math.floor(safe % 60)).padStart(2, "0")}`;
}

export interface VoiceCardProps {
  voice: Voice;
  /** Stagger index for the reveal. */
  index?: number;
  /** True when this voice is the one loaded into the shared player. */
  isActive: boolean;
  /** The player's status — only meaningful while `isActive`. */
  status: VoicePlayerStatus;
  /** 0–1. Callers pass 0 for inactive cards so the memo below actually holds. */
  progress: number;
  currentTime: number;
  onToggle: (voice: Voice) => void;
  onSeek: (voice: Voice, ratio: number) => void;
}

export const VoiceCard = memo(function VoiceCard({
  voice,
  index = 0,
  isActive,
  status,
  progress,
  currentTime,
  onToggle,
  onSeek,
}: VoiceCardProps) {
  const hasAudio = Boolean(voice.previewSrc);
  const isLoading = isActive && status === "loading";
  const isPlaying = isActive && status === "playing";
  const hasFailed = isActive && status === "error";
  const canSeek = isActive && hasAudio && !hasFailed;

  const [badgeTone] = voice.tones;
  const badge = TONE_COLORS[badgeTone];
  const metaLine = `${voice.accent ?? voice.category} · ${formatLanguages(voice)}`;
  const metaTitle = `${voice.category} · ${describeLanguages(voice)}`;

  const statusLabel = !hasAudio
    ? "Preview unavailable"
    : hasFailed
      ? "Preview unavailable"
      : isLoading
        ? "Loading…"
        : isPlaying
          ? "Playing preview…"
          : "Sample audio";

  const seekFromPointer = (event: MouseEvent<HTMLDivElement>) => {
    if (!canSeek) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onSeek(voice, (event.clientX - rect.left) / rect.width);
  };

  const seekFromKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canSeek) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onSeek(voice, progress + SEEK_STEP);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onSeek(voice, progress - SEEK_STEP);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface p-5",
        "transition-[box-shadow,border-color] duration-300",
        isActive
          ? "border-accent shadow-lift"
          : "border-border shadow-soft hover:border-accent hover:shadow-lift",
      )}
    >
      {/* Active glow — the "which one is playing" cue, kept under the content. */}
      <motion.span
        aria-hidden
        animate={{ opacity: isPlaying ? 0.12 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 bg-accent"
        style={{ filter: "blur(40px)" }}
      />

      <div className="relative flex flex-1 flex-col">
        {/* Name, tone badge, meta, play control */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-display text-[18px] font-extrabold leading-none text-ink">
                {voice.name}
              </h3>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold leading-[1.4]"
                style={{ backgroundColor: badge.bg, color: badge.text }}
              >
                {badgeTone}
              </span>
            </div>
            <p className="mt-1.5 truncate text-[12px] text-ink-muted" title={metaTitle}>
              {metaLine}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => onToggle(voice)}
            disabled={!hasAudio}
            aria-label={isPlaying ? `Pause ${voice.name} preview` : `Play ${voice.name} preview`}
            aria-pressed={isPlaying}
            whileHover={hasAudio ? { scale: 1.08 } : undefined}
            whileTap={hasAudio ? { scale: 0.92 } : undefined}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors focus-ring",
              !hasAudio && "cursor-not-allowed border border-border bg-surface-muted text-ink-faint",
              hasAudio && isActive
                ? "bg-accent text-accent-ink shadow-[0_0_18px_rgba(255,208,0,0.45)]"
                : hasAudio &&
                  "border border-border bg-surface-muted text-ink hover:border-accent hover:bg-accent",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 translate-x-[1px]" />
            )}
          </motion.button>
        </div>

        {/* Waveform + scrubber */}
        <div className="mt-4 rounded-xl border border-border bg-surface-muted px-3 pb-2.5 pt-3">
          <VoiceWaveform heights={voice.waveform} playing={isPlaying} />
          <div
            role="slider"
            tabIndex={canSeek ? 0 : -1}
            aria-label={`Seek ${voice.name} preview`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-valuetext={formatTime(currentTime)}
            aria-disabled={!canSeek}
            onClick={seekFromPointer}
            onKeyDown={seekFromKeyboard}
            className={cn(
              "mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(234,216,112,0.6)] focus-ring",
              canSeek ? "cursor-pointer" : "cursor-default",
            )}
          >
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-faint">
          <span className="tabular-nums">{formatTime(currentTime)}</span>
          <span>{statusLabel}</span>
        </div>

        {/* Description, verbatim from ElevenLabs. flex-1 lets the box absorb the
            row's slack, so the boxes form an even band and every tagline and CTA
            below them lines up across the row. */}
        <div className="mt-3 flex-1 rounded-xl border border-border bg-bg px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-faint">
            About this voice
          </p>
          <p className="mt-1.5 line-clamp-4 text-[13px] italic leading-relaxed text-ink-muted">
            {voice.description}
          </p>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">{voice.tagline}</p>

        <button
          type="button"
          onClick={() => onToggle(voice)}
          disabled={!hasAudio}
          className={cn(
            "mt-4 w-full rounded-xl border py-2.5 text-[13px] font-medium transition-colors focus-ring",
            hasAudio
              ? "border-border bg-surface-muted text-ink hover:border-accent hover:bg-[rgba(255,208,0,0.12)]"
              : "cursor-not-allowed border-border bg-surface-muted text-ink-faint",
          )}
        >
          {!hasAudio
            ? "Preview coming soon"
            : isPlaying
              ? "Pause preview"
              : `Preview ${voice.name}`}
        </button>
      </div>
    </motion.article>
  );
});
