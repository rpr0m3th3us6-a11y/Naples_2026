# Napoli Pocket Brief

An offline-first PWA — pocket safety, intel, and unofficial (funny) tour guide
for the Rowan family Naples trip, Aug 14–20, 2026.

## What it is
- Plain HTML/CSS/JS, no build step, no framework, no external API calls.
- A service worker caches every page on first load, so once installed it
  needs **zero signal** for the rest of the trip.
- Three humor "voices" (Tío / Millennial / Gringo) toggle on the Safety page.
- Tap-to-call emergency numbers, tap-to-open map coordinates for hidden gems.

## Host it on GitHub Pages (free, ~2 minutes)
1. Create a new repo, e.g. `naples-2026-brief`.
2. Upload everything in this folder to the repo root (keep the `icons/` folder).
3. Repo → Settings → Pages → Source: **Deploy from branch** → Branch: `main`, folder: `/ (root)`.
4. Wait ~1 minute. Your app is live at:
   `https://<your-username>.github.io/naples-2026-brief/`

## Install it on a phone (do this before you fly, on real wifi)
- **iPhone (Safari):** open the URL → Share icon → "Add to Home Screen."
- **Android (Chrome):** open the URL → ⋮ menu → "Install app" / "Add to Home Screen."

Once installed, open it once fully (let every tab load so the service worker
caches everything), then it works completely offline — airplane mode, dead
zone in Rione Sanità, expired eSIM, doesn't matter.

## Updating content after you host it
All content lives in `app.js` as plain JS arrays/objects (`itinerary`, `scams`,
`sosData`, `transportData`, `gems`, `phrases`, `signalData`) — edit those,
commit, push. Bump `CACHE_NAME` in `sw.js` (e.g. `napoli-brief-v2`) so
installed phones pick up the update next time they get signal.

## File map
```
index.html      — structure, all sections
style.css       — majolica-tile design system (cobalt/terracotta/sun/cream)
app.js          — all content data + interactivity
sw.js           — offline caching (cache-first strategy)
manifest.json   — installability (name, icons, colors)
icons/          — app icons (192/512/180px, generated majolica motif)
```
