// One-shot: pregenerate leader shout clips into assets/audio/.
// Run: node scripts/pregen-voice.mjs
// Lines must stay in sync with SHOUTS in index.html.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env'), 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const SHOUTS = [
  "RAISE IT! SLOWLY! WITH DIGNITY!",
  "THAT IS A FINGER, OLAF! TREAT IT WITH RESPECT!",
  "ONE! FINGER! AT! A! TIME!",
  "MY GRANDMOTHER RAISES FINGERS FASTER!",
  "STRAIGHTEN IT! IT'S DROOPING!",
  "DO NOT LOOK AT ME! LOOK AT THE FINGER!",
  "THIS IS WHY WE LOST THE FJORD, OLAF!",
  "MAGNIFICENT! NO WAIT! IT'S CROOKED! ACCEPTABLE!",
  "THE CUSTOMER IS COUNTING ON YOU! LITERALLY!",
  "YOU CALL THAT KNUCKLE FORM?!",
  "FASTER LEGS! SLOWER FINGERS!",
  "I HAVE SEEN GLACIERS WITH MORE URGENCY!"
];
const IMPATIENCE = "ENOUGH POKING! OLAF! RAISE THE REST YOURSELF! HURRY!";

const outDir = path.join(ROOT, 'assets', 'audio');
fs.mkdirSync(outDir, { recursive: true });

async function gen(text, file) {
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.OPENAI_APIKEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: 'onyx',
      input: text,
      instructions: 'A furious viking army drill sergeant, shouting at the top of his lungs, gravelly, theatrical, slightly unhinged.',
      response_format: 'mp3'
    })
  });
  if (!r.ok) throw new Error(`${file}: ${r.status} ${await r.text()}`);
  fs.writeFileSync(path.join(outDir, file), Buffer.from(await r.arrayBuffer()));
  console.log('wrote', file);
}

for (let i = 0; i < SHOUTS.length; i++) await gen(SHOUTS[i], `shout-${i}.mp3`);
await gen(IMPATIENCE, 'impatience.mp3');
console.log('done');
