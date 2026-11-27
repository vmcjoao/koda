import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  /** st[k][i] — undefined = not filled yet */
  st: (number | null)[][];
  hot: { k: number; i: number }[];
};

function buildFrames(values: number[]): Frame[] {
  const n = values.length;
  const maxK = Math.floor(Math.log2(Math.max(1, n))) + 1;
  const st: (number | null)[][] = Array.from({ length: maxK }, () =>
    Array(n).fill(null),
  );
  for (let i = 0; i < n; i++) st[0]![i] = values[i]!;
  const frames: Frame[] = [
    {
      label: 'st[0][i] = a[i]',
      st: st.map((row) => [...row]),
      hot: values.map((_, i) => ({ k: 0, i })),
    },
  ];
  for (let k = 1; k < maxK; k++) {
    const len = 1 << k;
    const half = 1 << (k - 1);
    for (let i = 0; i + len <= n; i++) {
      const left = st[k - 1]![i]!;
      const right = st[k - 1]![i + half]!;
      st[k]![i] = Math.min(left, right);
      frames.push({
        label: `st[${k}][${i}] = min(st[${k - 1}][${i}], st[${k - 1}][${i + half}]) = ${st[k]![i]}`,
        st: st.map((row) => [...row]),
        hot: [
          { k: k - 1, i },
          { k: k - 1, i: i + half },
          { k, i },
        ],
      });
    }
  }
  frames.push({
    label: 'build done · O(1) RMQ via two overlapping blocks',
    st: st.map((row) => [...row]),
    hot: [],
  });
  return frames;
}

export function sparseTableFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function SparseTableViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const maxK = f.st.length;

  function isHot(k: number, i: number) {
    return f.hot.some((h) => h.k === k && h.i === i);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      {Array.from({ length: maxK }, (_, k) => (
        <View key={k} style={styles.level}>
          <Text style={styles.label}>st[{k}] · len={1 << k}</Text>
          <View style={styles.row}>
            {demo.values.map((_, i) => {
              const v = f.st[k]![i];
              if (v == null && k > 0 && i + (1 << k) > demo.values.length) {
                return <View key={i} style={styles.pad} />;
              }
              if (v == null) {
                return (
                  <View key={i} style={[styles.cell, styles.empty]}>
                    <Text style={styles.idx}>{i}</Text>
                    <Text style={styles.val}>·</Text>
                  </View>
                );
              }
              const hot = isHot(k, i);
              return (
                <PulseOnActive key={i} active={hot}>
                  <View style={[styles.cell, hot && styles.hot, k === 0 && styles.leaf]}>
                    <Text style={styles.idx}>{i}</Text>
                    <Text style={styles.val}>{v}</Text>
                  </View>
                </PulseOnActive>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
  meta: {
    color: colors.xp,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  level: { width: '100%', gap: 4 },
  label: { color: colors.textDim, fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: {
    minWidth: 30,
    paddingVertical: 5,
    paddingHorizontal: 3,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  leaf: { borderColor: colors.radar },
  empty: { opacity: 0.35 },
  hot: { borderColor: colors.warning, borderWidth: 2, backgroundColor: colors.chipSelected },
  pad: { minWidth: 30 },
  idx: { color: colors.textDim, fontSize: 8 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700', fontSize: 12 },
});
