<p align="center">
  <img src="assets/images/icon.png" alt="Koda" width="96" height="96" />
</p>

<h1 align="center">Koda</h1>

<p align="center">
  <strong>Read. Diagnose. Blueprint.</strong><br/>
  Competitive programming training built for a phone — without writing syntax on glass.
</p>

<p align="center">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-58-000?style=flat-square&logo=expo&logoColor=3DDC97" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="UI" src="https://img.shields.io/badge/UI-dark%20%2B%20mint-3DDC97?style=flat-square" />
</p>

<p align="center">
  <em>Clear Warm-up → Target → Boss. Build judgment first. Code later on a real keyboard.</em>
</p>

---

## Launch

The brand opens as a graph: one node mitoses into a **K**, then **oda** slides in.

<p align="center">
  <img src="docs/media/01-launch.gif" alt="Koda launch — graph-K mitosis" width="280" />
</p>

---

## The Run tab

Home is one composition: wordmark, streak / XP / band, today’s algorithm, and the daily path.

<p align="center">
  <img src="docs/media/02-home-run.png" alt="Koda Home — Run tab with Daily Path" width="280" />
</p>

| Piece | Why it hits |
| --- | --- |
| **Graph-K wordmark** | Tap to replay the mitosis in place |
| **PlayerStrip** | Streak ◆ · XP gold count-up · Band ◎ |
| **Daily Path** | Warm-up → Target → Boss |
| **Raised Run orb** | Center tab bolt — mint when you’re on Home |

---

## Daily Algorithm

One seeded skill-check a day. Calendar like a habit game — streak, catch-up, +XP on first clear.

<p align="center">
  <img src="docs/media/05-daily-algo-calendar.png" alt="Daily Algorithm calendar" width="280" />
</p>

---

## Learn — Algorithm Dojo

Curriculum as a path. Units, zigzag nodes, Check drills, and **Live Replay** visualizations — watch the algorithm move before you tag it.

<p align="center">
  <img src="docs/media/07-learn-path.png" alt="Learn path — Algorithm Dojo" width="280" />
  &nbsp;
  <img src="docs/media/08-learn-viz.gif" alt="Live Replay visualization" width="280" />
</p>

BFS · DFS · Dijkstra · knapsack · LIS · segtree · hull · and more.

---

## Encounter → Reveal

The core loop is diagnosis, not typing:

```text
Encounter  →  Radar  →  Hypothesis  →  Blueprint  →  Reveal
```

Read the statement. Tag complexity. Name paradigm, algorithm, structures, twists. Sketch a blueprint for later PC work. Then see how sharp your read was.

<p align="center">
  <img src="docs/media/11-reveal-score.png" alt="Reveal score breakdown" width="280" />
</p>

Stuck? Progressive hints — coaching layers, not instant spoilers.

---

## Implement · Stats

Blueprints wait in the Build Queue until you AC them on a real OJ. Stats track band, heat, pipeline, and topic mastery.

<p align="center">
  <img src="docs/media/14-implement-queue.png" alt="Implement queue" width="280" />
  &nbsp;
  <img src="docs/media/13-stats.png" alt="Stats heatmap" width="280" />
</p>

Also in the app: Review deck, catalog, playlists, history filters, offline SQLite catalog, guest → cloud sync when you want it.

---

## Why Koda

Most CP apps shove an editor onto a phone. Koda flips it:

1. **Train recognition** — paradigms and twists under time pressure  
2. **Keep implementation for a keyboard** — blueprints land in the Implement queue  
3. **Feel like a run** — daily set, streaks, bands, haptics, motion with purpose  

| | |
| --- | --- |
| **Mint** `#3DDC97` | Accents, Run orb, wordmark |
| **Gold** `#F0C14B` | XP |
| **Amber** `#F5A623` | Streak · Boss · Daily Algo |
| **Radar blue** `#5B8CFF` | Band · Constraint Radar |
| **Void** `#121212` | Stage |

Built with **Expo · React Native · Expo Router · Reanimated · Supabase** (optional) · local-first guest mode.

---

## Try it

Android preview builds ship as installable APKs via [EAS](https://expo.dev) (internal distribution).  
Repo stays private while the product is yours — share the build link, not the source.

```bash
npm install
npx expo start
```

Guest mode works with no backend. Optional sync: copy `.env.example` → `.env` and set Supabase keys.

<details>
<summary><strong>Dev notes</strong> (setup, scripts, ingest)</summary>

### Stack
- Expo (RN + Router), dark by default  
- Supabase Auth + Postgres, offline guest via SQLite / cache  

### Supabase
1. Enable Email auth  
2. Run migrations `001` … `005_io_formats.sql`  
3. Seed with `supabase/seed.sql` (`npm run generate:seed`)  
4. Redirect URLs: `koda://(auth)/reset`, `koda://(auth)/login`  

### Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run typecheck` | TypeScript |
| `npm test` | Scoring + habit + local-data |
| `npm run generate:seed` | Rebuild seed SQL |
| `npx eas-cli build --profile preview -p android` | Preview APK |

Ingest pipeline: [`scripts/ingest/README.md`](scripts/ingest/README.md).

</details>

---

<p align="center">
  <sub>Designed & built by <strong>João</strong> · graph-K brand · mint on void</sub>
</p>
