/**
 * Voice library data.
 *
 * Every factual field below — name, tagline, description, category, languages,
 * and any accent/gender that is spelled out — is transcribed from the voice's
 * public ElevenLabs page (`sourceUrl`). Nothing is inferred: `gender` and
 * `accent` are omitted wherever the source doesn't state them, rather than
 * guessed from the name or the sound of the clip. Tone words are likewise taken
 * verbatim from the voice's own descriptor or description.
 *
 * Preview clips are vendored into public/assets/voices/ by
 * scripts/download-voices.mjs — ElevenLabs' own preview URLs are partly signed
 * and expire. Keep `slug` in step with the filenames there.
 */

export type VoiceCategory =
  | "Conversational"
  | "Narrative Story"
  | "Advertisement"
  | "Characters";

/** Tone words, taken verbatim from each voice's ElevenLabs copy. */
export type VoiceTone =
  | "Genuine"
  | "Natural"
  | "Authentic"
  | "Professional"
  | "Calm"
  | "Gritty"
  | "Youthful"
  | "Intelligent"
  | "Expressive"
  | "Energetic"
  | "Friendly"
  | "Sweet"
  | "Grounded"
  | "Relaxed"
  | "Warm"
  | "Productive"
  | "Happy"
  | "Clear"
  | "Confident";

export interface Voice {
  /** Also the preview filename: public/assets/voices/{slug}.mp3 */
  slug: string;
  /** ElevenLabs voice ID. */
  voiceId: string;
  name: string;
  /** The descriptor ElevenLabs shows under the voice name. */
  tagline: string;
  /** The voice's own ElevenLabs description, verbatim. */
  description: string;
  category: VoiceCategory;
  /** Languages named on the voice page, most prominent first. */
  languages: string[];
  /** The "+N" of further verified languages the page collapses. */
  extraLanguageCount: number;
  /** Only set where the ElevenLabs copy states it. */
  gender?: "Female" | "Male";
  /** Only set where the ElevenLabs copy states it. */
  accent?: string;
  /** First entry doubles as the card's badge and seeds the tone filter row. */
  tones: VoiceTone[];
  /** null renders the card with its play control disabled, not broken. */
  previewSrc: string | null;
  sourceUrl: string;
  /** Relative bar heights (0–1) for the card waveform. */
  waveform: number[];
}

/**
 * Deterministic bar heights for a voice's waveform, derived from its ID: the
 * silhouette is stable across renders (so SSR and hydration agree) and unique
 * per voice, without twelve hand-maintained arrays. Ends taper so the shape
 * reads as a clip rather than a block.
 */
function waveformFor(voiceId: string, bars = 32): number[] {
  let hash = 2166136261;
  const heights: number[] = [];

  for (let i = 0; i < bars; i += 1) {
    hash ^= voiceId.charCodeAt(i % voiceId.length);
    hash = Math.imul(hash, 16777619);
    const noise = ((hash >>> 0) % 1000) / 1000;
    const taper = Math.sin((Math.PI * (i + 0.5)) / bars) ** 0.6;
    heights.push(Math.round((0.3 + noise * 0.7) * taper * 100) / 100);
  }

  return heights;
}

const elevenLabsVoiceUrl = (voiceId: string) => `https://elevenlabs.io/voices/${voiceId}`;

export const voices: Voice[] = [
  {
    slug: "eryn",
    voiceId: "kdnRe2koJdOK4Ovxn2DI",
    name: "Eryn",
    tagline: "Genuine, Friendly and Natural",
    description:
      "This model was trained from a real conversation between two good friends. It's authentic as you can get!",
    category: "Conversational",
    languages: ["English", "Polish"],
    extraLanguageCount: 2,
    tones: ["Genuine", "Friendly", "Natural"],
    previewSrc: "/assets/voices/eryn.mp3",
    sourceUrl: elevenLabsVoiceUrl("kdnRe2koJdOK4Ovxn2DI"),
    waveform: waveformFor("kdnRe2koJdOK4Ovxn2DI"),
  },
  {
    slug: "amy",
    voiceId: "OZxMHsGaBmV5pjMIDIn0",
    name: "Amy",
    tagline: "Natural and Sweet",
    description:
      "Down-to-earth and conversational, this voice is perfect for situations that call for a realistic sounding woman in her 30s.",
    category: "Conversational",
    languages: ["English"],
    extraLanguageCount: 0,
    gender: "Female",
    tones: ["Natural", "Sweet"],
    previewSrc: "/assets/voices/amy.mp3",
    sourceUrl: elevenLabsVoiceUrl("OZxMHsGaBmV5pjMIDIn0"),
    waveform: waveformFor("OZxMHsGaBmV5pjMIDIn0"),
  },
  {
    slug: "kiora",
    voiceId: "hGQkZQUA5RiOXIw7P9iO",
    name: "Kiora",
    tagline: "Authentic, Natural Conversation",
    description:
      "A friendly, relatable female American voice with a natural, neutral tone. Easy to listen to, warm, and conversational, which is perfect for your Social Media, ads, and everyday creator content.",
    category: "Conversational",
    languages: ["English", "Ukrainian"],
    extraLanguageCount: 11,
    gender: "Female",
    accent: "American",
    tones: ["Authentic", "Natural", "Friendly"],
    previewSrc: "/assets/voices/kiora.mp3",
    sourceUrl: elevenLabsVoiceUrl("hGQkZQUA5RiOXIw7P9iO"),
    waveform: waveformFor("hGQkZQUA5RiOXIw7P9iO"),
  },
  {
    slug: "adalina",
    voiceId: "i2SoWWnAm3qCyr53Jenw",
    name: "Adalina",
    tagline: "Professional & Friendly",
    description: "Professional sales and customer service.",
    category: "Advertisement",
    languages: ["English"],
    extraLanguageCount: 0,
    tones: ["Professional", "Friendly"],
    previewSrc: "/assets/voices/adalina.mp3",
    sourceUrl: elevenLabsVoiceUrl("i2SoWWnAm3qCyr53Jenw"),
    waveform: waveformFor("i2SoWWnAm3qCyr53Jenw"),
  },
  {
    slug: "bhee",
    voiceId: "Yg9gTGNCzsJ07z79MfKw",
    name: "Bhee",
    tagline: "Receptionist & Customer Service",
    description:
      "Bhee is an intelligent, to-the-point, and productive receptionist. She wants you to know what's coming up upfront and is very transparent, while also telling a great story. Bhee has worked in customer service, sales, management, training, and receptionist positions.",
    category: "Conversational",
    languages: ["English", "Dutch"],
    extraLanguageCount: 13,
    gender: "Female",
    tones: ["Intelligent", "Productive", "Professional"],
    previewSrc: "/assets/voices/bhee.mp3",
    sourceUrl: elevenLabsVoiceUrl("Yg9gTGNCzsJ07z79MfKw"),
    waveform: waveformFor("Yg9gTGNCzsJ07z79MfKw"),
  },
  {
    slug: "vexa",
    voiceId: "uwJhTSUhU9LVyeRjWtiC",
    // ElevenLabs lists this one as "Vexa – Expressive Outbound Sales"; the
    // qualifier reads better as the card's tagline than as part of the name.
    name: "Vexa",
    tagline: "Expressive Outbound Sales",
    description:
      "Vexa brings an expressive, human-like energy to outbound sales that makes every call feel like it came from your best rep. Her sweet, energetic delivery stays polite, on-message, and genuinely engaging — making prospects actually want to keep talking.",
    category: "Conversational",
    languages: ["English", "Turkish"],
    extraLanguageCount: 15,
    gender: "Female",
    tones: ["Expressive", "Energetic", "Sweet"],
    previewSrc: "/assets/voices/vexa.mp3",
    sourceUrl: elevenLabsVoiceUrl("uwJhTSUhU9LVyeRjWtiC"),
    waveform: waveformFor("uwJhTSUhU9LVyeRjWtiC"),
  },
  {
    slug: "eve",
    voiceId: "BZgkqPqms7Kj9ulSkVzn",
    name: "Eve",
    tagline: "Authentic, Energetic and Happy",
    description: "Great for V3, conversation, energetic, happy.",
    category: "Conversational",
    languages: ["English", "Hungarian"],
    extraLanguageCount: 23,
    tones: ["Authentic", "Energetic", "Happy"],
    previewSrc: "/assets/voices/eve.mp3",
    sourceUrl: elevenLabsVoiceUrl("BZgkqPqms7Kj9ulSkVzn"),
    waveform: waveformFor("BZgkqPqms7Kj9ulSkVzn"),
  },
  {
    slug: "hope",
    voiceId: "OYTbf65OHHFELVut7v2H",
    name: "Hope",
    tagline: "Natural, Clear and Calm",
    description: "Hope — natural conversations.",
    category: "Conversational",
    languages: ["English", "Bulgarian"],
    extraLanguageCount: 9,
    tones: ["Natural", "Clear", "Calm"],
    previewSrc: "/assets/voices/hope.mp3",
    sourceUrl: elevenLabsVoiceUrl("OYTbf65OHHFELVut7v2H"),
    waveform: waveformFor("OYTbf65OHHFELVut7v2H"),
  },
  {
    slug: "isla",
    voiceId: "h8eW5xfRUGVJrZhAFxqK",
    name: "Isla",
    tagline: "Youthful, Relaxed, and Warm",
    description:
      "Isla's Scottish voice sounds youthful and warm, with a laid-back charm that makes you feel instantly at ease. It's approachable and conversational, ideal for relaxed storytelling, lifestyle content, or friendly voiceovers.",
    category: "Conversational",
    languages: ["English", "Malay"],
    extraLanguageCount: 7,
    accent: "Scottish",
    tones: ["Youthful", "Relaxed", "Warm"],
    previewSrc: "/assets/voices/isla.mp3",
    sourceUrl: elevenLabsVoiceUrl("h8eW5xfRUGVJrZhAFxqK"),
    waveform: waveformFor("h8eW5xfRUGVJrZhAFxqK"),
  },
  {
    slug: "sedona",
    voiceId: "Y02DpjDrIqEQiinPoGZG",
    name: "Sedona",
    tagline: "Calm Grounded Female",
    description:
      "Neutral American accent with a warm calming tone. Clear and steady delivery suitable for narration, audiobooks, meditation, educational content, and long-form listening.",
    category: "Narrative Story",
    languages: ["English"],
    extraLanguageCount: 0,
    gender: "Female",
    accent: "Neutral American",
    tones: ["Calm", "Grounded", "Clear"],
    previewSrc: "/assets/voices/sedona.mp3",
    sourceUrl: elevenLabsVoiceUrl("Y02DpjDrIqEQiinPoGZG"),
    waveform: waveformFor("Y02DpjDrIqEQiinPoGZG"),
  },
  {
    slug: "sadie",
    voiceId: "bD9maNcCuQQS75DGuteM",
    name: "Sadie",
    tagline: "Calm, Gritty & Expressive",
    description:
      "Sadie has a voice that has lived and adventured, and she's come home to share it with you, telling dusty tales by firelight with gritty soul.",
    category: "Narrative Story",
    languages: ["English", "Indonesian"],
    extraLanguageCount: 16,
    gender: "Female",
    tones: ["Gritty", "Calm", "Expressive"],
    previewSrc: "/assets/voices/sadie.mp3",
    sourceUrl: elevenLabsVoiceUrl("bD9maNcCuQQS75DGuteM"),
    waveform: waveformFor("bD9maNcCuQQS75DGuteM"),
  },
  {
    slug: "ember",
    voiceId: "WtA85syCrJwasGeHGH2p",
    name: "Ember",
    tagline: "Energetic, Confident Protagonist",
    description: "Ember — energetic, confident protagonist.",
    category: "Characters",
    languages: ["English", "German"],
    extraLanguageCount: 12,
    tones: ["Energetic", "Confident"],
    previewSrc: "/assets/voices/ember.mp3",
    sourceUrl: elevenLabsVoiceUrl("WtA85syCrJwasGeHGH2p"),
    waveform: waveformFor("WtA85syCrJwasGeHGH2p"),
  },
];

/**
 * Chip palette. These are literal hex rather than design tokens on purpose: the
 * tokens in globals.css are a single warm brand ramp, and the chips need many
 * distinguishable hues. Order here is the order the filter row renders in.
 */
export const TONE_COLORS: Record<VoiceTone, { bg: string; text: string }> = {
  Professional: { bg: "#dbeafe", text: "#1e40af" },
  Friendly: { bg: "#d1fae5", text: "#065f46" },
  Natural: { bg: "#e0f2fe", text: "#075985" },
  Calm: { bg: "#ede9fe", text: "#4c1d95" },
  Genuine: { bg: "#fef3c7", text: "#92400e" },
  Authentic: { bg: "#fce7f3", text: "#9d174d" },
  Gritty: { bg: "#fee2e2", text: "#991b1b" },
  Expressive: { bg: "#fef9c3", text: "#854d0e" },
  Energetic: { bg: "#ffedd5", text: "#9a3412" },
  Youthful: { bg: "#ccfbf1", text: "#115e59" },
  Intelligent: { bg: "#e0e7ff", text: "#3730a3" },
  Sweet: { bg: "#ffe4e6", text: "#9f1239" },
  Grounded: { bg: "#f3f4f6", text: "#374151" },
  Relaxed: { bg: "#ecfccb", text: "#3f6212" },
  Warm: { bg: "#ffe8d6", text: "#9a5b13" },
  Productive: { bg: "#e2e8f0", text: "#334155" },
  Happy: { bg: "#fef08a", text: "#854d0e" },
  Clear: { bg: "#cffafe", text: "#155e75" },
  Confident: { bg: "#f5d0fe", text: "#86198f" },
};

export const ALL = "All" as const;

/** A voice counts as multilingual if ElevenLabs verifies it beyond English. */
export function isMultilingual(voice: Voice) {
  return voice.languages.length + voice.extraLanguageCount > 1;
}

/**
 * "English +3" — compact enough to sit on the card's one-line meta row without
 * truncating. The full list goes in the card's title attribute via
 * {@link describeLanguages}.
 */
export function formatLanguages(voice: Voice) {
  const [primary, ...rest] = voice.languages;
  const others = rest.length + voice.extraLanguageCount;
  return others > 0 ? `${primary} +${others}` : primary;
}

/** "English, Polish and 2 more" — the long form, for tooltips. */
export function describeLanguages(voice: Voice) {
  const listed = voice.languages.join(", ");
  return voice.extraLanguageCount > 0
    ? `${listed} and ${voice.extraLanguageCount} more`
    : listed;
}

export const LANGUAGE_FILTERS = [ALL, "English only", "Multilingual"] as const;
export type LanguageFilter = (typeof LANGUAGE_FILTERS)[number];

/** Only the categories actually present in the data. */
export const CATEGORY_FILTERS: readonly (typeof ALL | VoiceCategory)[] = [
  ALL,
  ...(["Conversational", "Narrative Story", "Advertisement", "Characters"] as const).filter(
    (category) => voices.some((voice) => voice.category === category),
  ),
];
export type CategoryFilter = (typeof ALL) | VoiceCategory;

/**
 * Chips are seeded from *badge* tones (each voice's first tone) rather than
 * every tone in the data — nineteen chips would swamp the control bar, and a
 * badge tone is by construction the one a reader has already seen on a card.
 * Matching still runs against a voice's full tone list, so picking "Natural"
 * finds Amy and Hope as well as the voices badged with it.
 */
export const TONE_FILTERS: readonly (typeof ALL | VoiceTone)[] = [
  ALL,
  ...(Object.keys(TONE_COLORS) as VoiceTone[]).filter((tone) =>
    voices.some((voice) => voice.tones[0] === tone),
  ),
];

export interface VoiceFilters {
  search: string;
  language: LanguageFilter;
  category: CategoryFilter;
  tone: (typeof ALL) | VoiceTone;
}

export function filterVoices(all: Voice[], { search, language, category, tone }: VoiceFilters) {
  const query = search.trim().toLowerCase();

  return all.filter((voice) => {
    if (language === "English only" && isMultilingual(voice)) return false;
    if (language === "Multilingual" && !isMultilingual(voice)) return false;
    if (category !== ALL && voice.category !== category) return false;
    if (tone !== ALL && !voice.tones.includes(tone)) return false;
    if (!query) return true;

    return [voice.name, voice.tagline, voice.description, voice.category, ...voice.languages]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}
