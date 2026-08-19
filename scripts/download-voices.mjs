import { createWriteStream, mkdirSync } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

// Preview clips for the voices rendered by components/voice-library.
// `url` is the previewUrl ElevenLabs embeds on each voice's public page
// (https://elevenlabs.io/voices/<voiceId>). Some of those are signed and expire,
// so the clips are vendored into public/assets/voices/ rather than hotlinked —
// re-run this script (`npm run voices`) if a voice is swapped out or a clip 404s.
// `slug` must match the `slug` field in lib/voices.ts.
const VOICES = [
  {
    slug: "eryn",
    voiceId: "kdnRe2koJdOK4Ovxn2DI",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/452adc21c9f74693918585d7ef4aa152/voices/kdnRe2koJdOK4Ovxn2DI/PHZPTflbygqpdJbgCqek.mp3",
  },
  {
    slug: "amy",
    voiceId: "OZxMHsGaBmV5pjMIDIn0",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/36a9d32e3e024c6082021506d811cc95/voices/OZxMHsGaBmV5pjMIDIn0/8um6b2uDzxixhfzDbH0y.mp3",
  },
  {
    slug: "kiora",
    voiceId: "hGQkZQUA5RiOXIw7P9iO",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/01e4a6b26a87458498460365e451b9c0/voices/hGQkZQUA5RiOXIw7P9iO/ozTIlXGukiT3f9DDMG4v.mp3",
  },
  {
    slug: "adalina",
    voiceId: "i2SoWWnAm3qCyr53Jenw",
    url: "https://api.us.elevenlabs.io/v1/voices/i2SoWWnAm3qCyr53Jenw/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiIwZTNlMDc0YjE1MDY0ODNiYjNhN2FlMWIzNGJhMmFjZSIsImZpbGVuYW1lIjoiVEU5UXliTmFwNVB1dGN6MUI3eDUubXAzIiwidGltZXN0YW1wIjoxNzg3MTE5MjAwMDAwMDAwfQ%3D%3D",
  },
  {
    slug: "bhee",
    voiceId: "Yg9gTGNCzsJ07z79MfKw",
    url: "https://api.us.elevenlabs.io/v1/voices/Yg9gTGNCzsJ07z79MfKw/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJlNjk0YmMzYTAxYjU0NzE3YjVkMjhjOTY2ZjBlNjM5NCIsImZpbGVuYW1lIjoiejl3SlVNOExFNDlWRW80Y2YwN3MubXAzIiwidGltZXN0YW1wIjoxNzg3MTc2ODAwMDAwMDAwfQ%3D%3D",
  },
  {
    slug: "vexa",
    voiceId: "uwJhTSUhU9LVyeRjWtiC",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/uwJhTSUhU9LVyeRjWtiC/GyWwjTNKVZ02VjBTQKYN.mp3",
  },
  {
    slug: "eve",
    voiceId: "BZgkqPqms7Kj9ulSkVzn",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/2fb5f7f22a174a62b41adac3b2c17856/voices/BZgkqPqms7Kj9ulSkVzn/XVC95XX3UKyM8DIfXORa.mp3",
  },
  {
    slug: "hope",
    voiceId: "OYTbf65OHHFELVut7v2H",
    url: "https://storage.googleapis.com/eleven-public-prod/database/user/sD92HnMHS9WZLXKNTKxmnC8XmJ32/voices/OYTbf65OHHFELVut7v2H/kTLS0DfvlR1QTyjUzOiT.mp3",
  },
  {
    slug: "isla",
    voiceId: "h8eW5xfRUGVJrZhAFxqK",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/1da06ea679a54975ad96a2221fe6530d/voices/h8eW5xfRUGVJrZhAFxqK/aLpZVozKJR2BcBn3Gf9g.mp3",
  },
  {
    slug: "sedona",
    voiceId: "Y02DpjDrIqEQiinPoGZG",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/9b01dabc8d4b4f02aea1fa3cd565f072/voices/Y02DpjDrIqEQiinPoGZG/TFZutUhBL6MBZGA45H9H.mp3",
  },
  {
    slug: "sadie",
    voiceId: "bD9maNcCuQQS75DGuteM",
    url: "https://storage.googleapis.com/eleven-public-prod/database/workspace/89d81636838d4bdebf508b03ccc5e823/voices/bD9maNcCuQQS75DGuteM/wqExfedWRLLhr5LbtaQO.mp3",
  },
  {
    slug: "ember",
    voiceId: "WtA85syCrJwasGeHGH2p",
    url: "https://api.us.elevenlabs.io/v1/voices/WtA85syCrJwasGeHGH2p/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ1c2VyX2lkIjoiTmszSEtrVVo0dU5vajg3ZmRmd3JtaXJWS0lyMSIsImZpbGVuYW1lIjoiTjA2SjRLd0xscnVEWmdoVFV1b3gubXAzIiwidGltZXN0YW1wIjoxNzg2NzgwODAwMDAwMDAwfQ%3D%3D",
  },
];

mkdirSync("public/assets/voices", { recursive: true });

let failures = 0;

for (const { slug, url } of VOICES) {
  process.stdout.write(`Downloading ${slug}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await pipeline(
      Readable.fromWeb(res.body),
      createWriteStream(`public/assets/voices/${slug}.mp3`),
    );
    console.log(" ✓");
  } catch (err) {
    failures += 1;
    console.log(` ✗ ${err.message}`);
  }
}

console.log(`\nDone (${VOICES.length - failures}/${VOICES.length}). Files saved to public/assets/voices/`);
if (failures > 0) process.exitCode = 1;
