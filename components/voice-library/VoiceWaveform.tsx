"use client";

import { motion } from "framer-motion";
import { memo } from "react";

/**
 * Per-bar dip depth, indexed by bar position. Fixed rather than random so the
 * keyframe target doesn't change identity on every render — the card re-renders
 * several times a second off the player's timeupdate while a clip plays, and a
 * fresh target would tear down and restart all 32 infinite animations each time.
 */
const DIP_FACTORS = [
  0.52, 0.88, 0.41, 0.73, 1.02, 0.6, 0.95, 0.47, 0.81, 1.1, 0.55, 0.69, 0.99, 0.44, 0.86, 0.63,
  1.05, 0.5, 0.77, 0.92, 0.58, 0.83, 1.07, 0.46, 0.71, 0.97, 0.53, 0.9, 0.66, 1.0, 0.49, 0.79,
];

const BAR_HEIGHT = 34;

interface VoiceWaveformProps {
  /** Relative heights, 0–1. */
  heights: number[];
  playing: boolean;
}

export const VoiceWaveform = memo(function VoiceWaveform({
  heights,
  playing,
}: VoiceWaveformProps) {
  return (
    <div
      aria-hidden
      className="flex w-full items-end justify-between gap-[2px]"
      style={{ height: BAR_HEIGHT }}
    >
      {heights.map((height, i) => (
        <motion.span
          key={i}
          className="w-[3px] shrink-0 rounded-full bg-accent"
          // scaleY, not height: height is a layout property, so 32 bars
          // animating it would reflow the row every frame.
          style={{
            height: Math.max(3, Math.round(height * BAR_HEIGHT)),
            transformOrigin: "bottom center",
          }}
          animate={
            playing
              ? { scaleY: [1, DIP_FACTORS[i % DIP_FACTORS.length], 1], opacity: [0.7, 1, 0.7] }
              : { scaleY: 1, opacity: 0.55 }
          }
          transition={
            playing
              ? {
                  duration: 0.4 + (i % 5) * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.02,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
});
