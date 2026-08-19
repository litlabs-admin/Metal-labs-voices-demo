import { Inter, Merriweather, Plus_Jakarta_Sans } from "next/font/google";

// Inter and Jakarta load as variable fonts: omitting `weight` is what makes
// next/font serve the variable file instead of one static cut per weight. That's
// a single request covering the whole axis, so intermediate weights are free.

// Body / subtext face. Set at 400 on <body> in globals.css.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display face — headings and card names, at 800.
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Metal Labs' brand face, matching the weights app/fonts.ts loads in the
// metal-labs project. Used only by the wordmark in BrandLockup — Merriweather
// has no variable file on Google Fonts, so the cuts are named explicitly and
// kept to the two the lockup actually needs.
export const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  weight: ["400", "700"],
  display: "swap",
});
