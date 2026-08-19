# Tarsha Voice Library — standalone demo

A self-contained Next.js app whose only page is the **Voice Library** section.
Nothing else is here — no header, hero or footer — so what renders is exactly
what gets dropped into the Tarsha site.

```bash
npm install
npm run dev     # http://localhost:3000
```

## Layout

```
app/
  layout.tsx            fonts + <html>
  icon.png              favicon (96px Metal Labs mark)
  apple-icon.png        home-screen icon (180px)
  globals.css           design tokens, lifted from the Tarsha landing page
  page.tsx              renders <VoiceLibrary headingLevel="h1" brand={<BrandLockup />} />
components/
  ui/BrandLockup.tsx    Metal Labs sphere + wordmark, shown above the eyebrow
  ui/Eyebrow.tsx        shared primitive, copied verbatim
  voice-library/
    VoiceLibrary.tsx    the section: heading, controls, grid
    VoiceCard.tsx       one voice
    VoiceWaveform.tsx   the animated bars
lib/
  voices.ts             the 12 voices + filter/format helpers + tone palette
  useVoicePlayer.ts     one shared <audio> for the whole library
  cn.ts, fonts.ts       shared primitives, copied verbatim
scripts/
  download-voices.mjs   re-fetches the preview clips
```

## Branding

`components/ui/BrandLockup.tsx` renders the Metal Labs mark
(`public/brand/logo.png`, copied from the metal-labs project) beside the
wordmark set in Merriweather bold — the same pairing that project's navbar
uses, scaled well up from its 28px nav treatment so it reads as the page's
brand. `app/page.tsx` passes it to `VoiceLibrary` through the `brand` slot.

The same mark is the site icon: `app/icon.png` and `app/apple-icon.png` are
generated from it via Next's App Router file convention, so Next emits the
`<link rel="icon">` tags itself. To regenerate after a logo change, resize
`public/brand/logo.png` to 96px and 180px squares (trim the ~15px transparent
margin first so the sphere fills the tab icon).

## Dropping the section into the main site

`VoiceLibrary` is self-contained — it owns its own state and audio, and reads
only from `lib/voices.ts`. To move it across, copy `components/voice-library/`,
`lib/voices.ts`, `lib/useVoicePlayer.ts` and `public/assets/voices/`, then:

```tsx
<VoiceLibrary />                            // as a section on an existing page
<VoiceLibrary headingLevel="h1" />          // as the page's main heading
<VoiceLibrary voices={featured} />          // a curated subset
<VoiceLibrary brand={<BrandLockup />} />    // with a lockup above the eyebrow
```

`brand` is a slot, so the section itself carries no branding — drop it into the
Tarsha site without passing `brand` and the Metal Labs lockup does not come
with it.

The host project needs the same design tokens (see `app/globals.css`), the
`display` / `sans` font families, and the `soft` / `lift` shadows.

## Voice data

The twelve voices in `lib/voices.ts` are transcribed from their public
ElevenLabs pages — name, descriptor, description, category and languages are
verbatim. `gender` and `accent` are set **only** where the source copy states
them, and left off otherwise rather than guessed. Tone words are likewise taken
from each voice's own copy.

Preview clips are vendored into `public/assets/voices/` because some of
ElevenLabs' preview URLs are signed and expire. If one 404s, run:

```bash
npm run voices
```

To add a voice: append an entry to `voices` in `lib/voices.ts` (the waveform is
derived from the voice ID, so there's nothing to hand-draw), add a matching
`{ slug, voiceId, url }` to `scripts/download-voices.mjs`, and re-run
`npm run voices`. A voice with `previewSrc: null` still renders — its play
control is just disabled — so the card can go in before the audio does.
