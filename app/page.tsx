import { BrandLockup } from "@/components/ui/BrandLockup";
import { VoiceLibrary } from "@/components/voice-library/VoiceLibrary";

/**
 * The demo is the section and nothing else — no header, hero or footer — so what
 * you see on the page is exactly what gets dropped into the Tarsha site.
 */
export default function Page() {
  return (
    <main className="min-h-screen bg-bg">
      <VoiceLibrary headingLevel="h1" brand={<BrandLockup />} />
    </main>
  );
}
