# FingerMath Pro

*FingTech Labs presents...* a calculator powered by **ALI — Artificial Lack of Intelligence**.

It computes your answer internally, then refuses to tell you. Instead, little blob creatures raise their arms one by one while you count along on pen and paper. You submit the answer. ALI verifies it with visible uncertainty and occasionally asks for a recount.

Someone might ask, why a finger counting based calculator in big 2026? And we thought why not?

## Run

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly in a browser (needs internet for the Three.js CDN).

## Self-check

Open `http://localhost:8000/?test` — pass/fail badge top-right, details in console.

## Structure

Single file: `index.html`.

- **Pure logic** (top of script): `evaluate`, `buildCountPlan` (speed ramp after 10 raises), `aliScript` (deterministic hesitation/confidence/recount keyed on expression hash)
- **Scene**: low-poly island diorama, flat-shaded, muted pastels
- **Creatures**: up to 30 blobs; each raised arm = one count; wraps around past 30
- **Flow**: splash → expression → theatrical count → human answer → ALI verification → reluctant confirmation
- **Voice hook**: all ALI dialogue routes through `aliSay(text)` — bolt TTS on there later

With FingTech Labs we are dedicated to make the world... ummm... the same place probably?
