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

<p align="center">
  <img src="docs/media/launch.gif" alt="Koda launch animation" width="280" />
</p>

---

## Run

Home is one composition: wordmark, streak / XP / band, Daily Algorithm, and today’s path.

<p align="center">
  <img src="docs/media/run-page.jpeg" alt="Koda Run tab — Daily Path" width="280" />
</p>

| Piece | |
| --- | --- |
| **Graph-K wordmark** | Tap to replay the animation |
| **PlayerStrip** | Streak · XP · Band |
| **Daily Path** | Warm-up → Target → Boss |
| **Raised Run orb** | Center tab bolt |

---

## Daily Algorithm

One seeded skill-check a day. Streak, catch-up, calendar.

<p align="center">
  <img src="docs/media/puzzle-calendar.jpeg" alt="Daily Algorithm puzzle calendar" width="280" />
</p>

---

## Learn — Algorithm Dojo

Suggested path, unit progress, Check drills, and **Live Replay** visualizations.

<p align="center">
  <img src="docs/media/learn.jpeg" alt="Learn — Algorithm Dojo" width="280" />
  &nbsp;
  <img src="docs/media/lesson-units.jpeg" alt="Lesson units path" width="280" />
</p>

### Live Replay

<p align="center">
  <img src="docs/media/bfs-viz.gif" alt="BFS Live Replay" width="220" />
  &nbsp;
  <img src="docs/media/lis-viz.gif" alt="LIS Live Replay" width="220" />
  &nbsp;
  <img src="docs/media/seg-tree-viz.gif" alt="Segment tree Live Replay" width="220" />
</p>

<p align="center">
  <sub>BFS · LIS · Segment tree — plus knapsack, hull, Dijkstra, and more in-app.</sub>
</p>

---

## Review · Implement

Misses land in the Review deck. Blueprints wait in the Build Queue until you AC them on a real OJ.

<p align="center">
  <img src="docs/media/review.jpeg" alt="Review deck" width="280" />
  &nbsp;
  <img src="docs/media/implement.jpeg" alt="Implement queue" width="280" />
</p>

Core loop:

```text
Encounter  →  Radar  →  Hypothesis  →  Blueprint  →  Reveal
```

---

## Stats

Band, heatmap, diagnose → blueprint → implement pipeline, topic mastery.

<p align="center">
  <img src="docs/media/stats-full-page.jpeg" alt="Stats overview" width="340" />
</p>

<p align="center">
  <img src="docs/media/stats-calendar.jpeg" alt="Training calendar heatmap" width="240" />
  &nbsp;
  <img src="docs/media/stats-pipeline.jpeg" alt="Pipeline funnel" width="280" />
  &nbsp;
  <img src="docs/media/stats-mastery.jpeg" alt="Topic mastery" width="280" />
</p>

---

## Why Koda

Most CP apps shove an editor onto a phone. Koda flips it:

1. **Train recognition** — paradigms and twists under time pressure  
2. **Keep implementation for a keyboard** — blueprints land in Implement  
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

<details>
<summary><strong>Dev notes</strong></summary>

```bash
npm install
npx expo start
# web screenshots: npm run web
# Android APK: npx eas-cli build --platform android --profile preview
```

Guest mode works with no backend. Optional sync: `.env` from `.env.example`.  
Ingest: [`scripts/ingest/README.md`](scripts/ingest/README.md).

</details>

---

<p align="center">
  <a href="https://github.com/vmcjoao"><img src="https://img.shields.io/badge/github-vmcjoao-181717?style=flat-square&logo=github" alt="vmcjoao" /></a>
</p>

<p align="center">
  <sub>Designed & built by <strong>vmcjoao</strong> · graph-K brand · mint on void</sub>
</p>
