"use client";

import type { Voice } from "@/lib/voices";
import { useCallback, useEffect, useRef, useState } from "react";

export type VoicePlayerStatus = "idle" | "loading" | "playing" | "error";

export interface VoicePlayer {
  /** Slug of the voice currently loaded into the player, if any. */
  activeSlug: string | null;
  status: VoicePlayerStatus;
  /** 0–1. Zero until the clip reports a duration. */
  progress: number;
  /** Seconds elapsed in the active clip. */
  currentTime: number;
  toggle: (voice: Voice) => void;
  /** `ratio` is 0–1 of the clip's duration. No-op unless the voice is active. */
  seek: (voice: Voice, ratio: number) => void;
}

/**
 * Drives every preview in the library from a single <audio> element, which is
 * what makes "only one voice at a time" structural rather than something each
 * card has to co-operate on: assigning a new `src` stops whatever was playing.
 *
 * The element is created on mount rather than per card so switching voices
 * doesn't churn media elements, and so the browser reuses one decoder.
 */
export function useVoicePlayer(): VoicePlayer {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<VoicePlayerStatus>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const readDuration = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus("loading");
    const onError = () => setStatus("error");
    const onEnded = () => {
      setStatus("idle");
      setActiveSlug(null);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", readDuration);
    audio.addEventListener("durationchange", readDuration);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", readDuration);
      audio.removeEventListener("durationchange", readDuration);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
      audio.removeAttribute("src");
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(
    (voice: Voice) => {
      const audio = audioRef.current;
      if (!audio || !voice.previewSrc) return;

      // Second click on the voice that's already loaded: stop and reset.
      if (activeSlug === voice.slug && status !== "error") {
        audio.pause();
        audio.currentTime = 0;
        setStatus("idle");
        setActiveSlug(null);
        setCurrentTime(0);
        return;
      }

      audio.pause();
      audio.src = voice.previewSrc;
      audio.currentTime = 0;
      setActiveSlug(voice.slug);
      setStatus("loading");
      setCurrentTime(0);
      setDuration(0);
      audio.play().catch(() => setStatus("error"));
    },
    [activeSlug, status],
  );

  const seek = useCallback(
    (voice: Voice, ratio: number) => {
      const audio = audioRef.current;
      if (!audio || activeSlug !== voice.slug || !audio.duration) return;

      const next = Math.min(Math.max(ratio, 0), 1) * audio.duration;
      audio.currentTime = next;
      setCurrentTime(next);
    },
    [activeSlug],
  );

  return {
    activeSlug,
    status,
    progress: duration > 0 ? currentTime / duration : 0,
    currentTime,
    toggle,
    seek,
  };
}
