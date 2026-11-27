import type { GraphDemo } from '@/types/learn';

const INF = 1e9;

export type FloydFrame = {
  label: string;
  d: number[][];
  hot: [number, number][];
  k: number;
};

function initMatrix(demo: GraphDemo): number[][] {
  const n = demo.nodes.length;
  const d = Array.from({ length: n }, () => Array(n).fill(INF));
  for (let i = 0; i < n; i++) d[i]![i] = 0;
  for (const e of demo.edges) {
    const u = Number(e.from);
    const v = Number(e.to);
    const w = e.w ?? 1;
    d[u]![v] = Math.min(d[u]![v]!, w);
    if (!demo.directed) d[v]![u] = Math.min(d[v]![u]!, w);
  }
  return d;
}

export function buildFloydFrames(demo: GraphDemo): FloydFrame[] {
  const n = demo.nodes.length;
  const d = initMatrix(demo);
  const frames: FloydFrame[] = [
    {
      label: 'init · d[i][i]=0, edges loaded',
      d: d.map((row) => [...row]),
      hot: [],
      k: -1,
    },
  ];
  for (let k = 0; k < n; k++) {
    const improved: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      if (d[i]![k]! >= INF) continue;
      for (let j = 0; j < n; j++) {
        if (d[k]![j]! >= INF) continue;
        const nd = d[i]![k]! + d[k]![j]!;
        if (nd < d[i]![j]!) {
          d[i]![j] = nd;
          improved.push([i, j]);
        }
      }
    }
    frames.push({
      label:
        improved.length === 0
          ? `k=${k} · no improvements`
          : `k=${k} · relaxed ${improved.length} pairs via node ${k}`,
      d: d.map((row) => [...row]),
      hot: improved.slice(0, 8),
      k,
    });
  }
  frames.push({
    label: 'done · all-pairs distances',
    d: d.map((row) => [...row]),
    hot: [],
    k: n,
  });
  return frames;
}

export function floydFrameCount(demo: GraphDemo): number {
  return buildFloydFrames(demo).length;
}

export const FLOYD_INF = INF;
