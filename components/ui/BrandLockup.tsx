"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The Metal Labs lockup — the chrome sphere mark plus the wordmark, matching the
 * pairing used in the metal-labs navbar (mark + "Metal Labs" set in Merriweather
 * bold). Sized well up from the 28px nav treatment so it reads as the page's
 * brand rather than a footnote.
 *
 * Kept out of VoiceLibrary and passed in via its `brand` slot so the section
 * itself stays brand-agnostic and still drops into the Tarsha site unchanged.
 */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn("flex items-center justify-center gap-4 sm:gap-5", className)}
    >
      <Image
        src="/brand/logo.png"
        alt=""
        width={512}
        height={512}
        priority
        // The source PNG is transparent, so no circular crop is needed — the
        // sphere sits directly on the page background.
        className="h-14 w-14 shrink-0 object-contain sm:h-[72px] sm:w-[72px]"
      />
      <span
        className="font-brand text-[30px] font-bold leading-none tracking-[0.01em] text-ink sm:text-[42px]"
      >
        Metal Labs
      </span>
    </motion.div>
  );
}
