import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { GraphDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

const INF = 1e9;

type Frame = {
  label: string;
  d: number[][];
  /** Highlighted cells [i][j] */
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

export function buildFloydFrames(demo: GraphDemo): Frame[] {
  const n = demo.nodes.length;
  const d = initMatrix(demo);
  const frames: Frame[] = [
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

function fmt(v: number): string {
  return v >= INF / 2 ? '∞' : String(v);
}

export function FloydViz({ demo, step }: { demo: GraphDemo; step: number }) {
  const frames = useMemo(() => buildFloydFrames(demo), [demo]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const n = demo.nodes.length;

  function isHot(i: number, j: number) {
    return f.hot.some(([a, b]) => a === i && b === j);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.matrix}>
        <View style={styles.row}>
          <View style={styles.corner} />
          {Array.from({ length: n }, (_, j) => (
            <Text key={`h${j}`} style={styles.hdr}>
              {j}
            </Text>
          ))}
        </View>
        {f.d.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.hdr}>{i}</Text>
            {row.map((v, j) => {
              const hot = isHot(i, j);
              const viaK = f.k >= 0 && f.k < n && (i === f.k || j === f.k);
              return (
                <PulseOnActive key={j} active={hot}>
                  <View
                    style={[
                      styles.cell,
                      i === j && styles.diag,
                      viaK && styles.via,
                      hot && styles.hot,
                    ]}
                  >
                    <Text style={styles.val}>{fmt(v)}</Text>
                  </View>
                </PulseOnActive>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
  meta: {
    color: colors.xp,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  matrix: { gap: 3, alignSelf: 'center' },
  row: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  corner: { width: 18 },
  hdr: {
    width: 36,
    textAlign: 'center',
    color: colors.textDim,
    fontSize: 10,
    fontFamily: 'SpaceMono',
  },
  cell: {
    width: 36,
    height: 32,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diag: { opacity: 0.7 },
  via: { borderColor: colors.radar },
  hot: { borderColor: colors.warning, borderWidth: 2, backgroundColor: colors.chipSelected },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700', fontSize: 11 },
});
