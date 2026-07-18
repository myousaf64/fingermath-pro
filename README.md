# FingerMath Pro

*FingTech Labs presents...* a calculator powered by **ALI — Artificial Lack of Intelligence**.

Enter your expression on a keypad. ALI computes the answer internally, then refuses to tell you. Instead it spawns low-poly hands and highlights fingers one by one. You press the glowing finger; a viking soldier trudges over and tediously raises it while his army leader shouts at him (real voice). You count along on pen and paper, submit your answer, and ALI verifies it with visible uncertainty.

Someone might ask, why a finger counting based calculator in big 2026? And we thought why not?

## Run

Full experience (live TTS shouting, needs `OPENAI_APIKEY` in `.env`):

```sh
node server.js
# open http://localhost:8000
```

Without a key or offline: shouts fall back to pregenerated clips in `assets/audio/`. Any static server works:

```sh
python3 -m http.server 8000
```

## Self-check

`http://localhost:8000/?test` — pass/fail badge top-right, details in console.

## Structure

- `index.html` — whole app: keypad, Three.js diorama, hands, soldier, leader, ALI flow
- `server.js` — zero-dependency static server + `/tts` proxy (OpenAI key stays server-side)
- `scripts/pregen-voice.mjs` — regenerates the shout clips (keep lines in sync with `SHOUTS` in `index.html`)
- `assets/audio/` — pregenerated leader shouts (fallback voice)
- `assets/refs/` — art direction references (Bad North-style vikings) + hackathon rules; not loaded by the app

## How the count works

- Pure fns at top of `index.html`: `evaluate`, `buildCountPlan` (speed ramp), `handGroups` (12 → [5,5,2], capped at 6 hands with finger reuse past 30), `aliScript` (deterministic hesitation/confidence/recount)
- First 10 counts: press the highlighted finger → soldier walks → raises it → leader shouts
- After 10 the leader loses patience and the soldier speed-raises the rest
- Wrong answer twice → partial recount → third miss, ALI sheepishly reveals the answer it knew all along

## Art direction

See `assets/refs/`: `viking-lineup-ref.jpg`, `viking-pixelart-ref-1..5.png`, `pixel-army-units-ref.jpg`, `pixel-army-battle-ref.jpg`. Muted earthy pastels, flat-shaded low-poly, cute-awkward.

With FingTech Labs we are dedicated to make the world... ummm... the same place probably?
