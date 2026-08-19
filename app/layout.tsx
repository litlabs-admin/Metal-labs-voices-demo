import "./globals.css";
import { inter, jakarta, merriweather } from "@/lib/fonts";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Voice Library — Tarsha AI",
  description:
    "Preview the AI voices available for your Tarsha phone line. Twelve ElevenLabs voices across conversational, narrative, advertising and character reads.",
};

export const viewport: Viewport = {
  themeColor: "#FCFCFC",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${merriweather.variable}`}>
      <body>{children}</body>
    </html>
  );
}
