import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  diff: number[];
  a: (number | null)[];
  hotDiff: number;
  hotA: number;
};

/** Demo.values is the difference array d[]; Step rebuilds a via prefix. */
function buildFrames(diff: number[]): Frame[] {
  const n = diff.length;
  const frames: Frame[] = [
    {
      label: 'd[] after range updates · a not built yet',
      diff: [...diff],
      a: Array(n).fill(null),
      hotDiff: -1,
      hotA: -1,
    },
  ];
  const a: (number | null)[] = Array(n).fill(null);
  let cur = 0;
  for (let i = 0; i < n; i++) {
    cur += diff[i]!;
    a[i] = cur;
    frames.push({
      label: `a[${i}] = a[${i - 1}] + d[${i}] → ${cur}`,
      diff: [...diff],
      a: [...a],
      hotDiff: i,
      hotA: i,
    });
  }
  frames.push({
    label: 'materialized · range adds applied in O(N)',
    diff: [...diff],
    a: [...a],
    hotDiff: -1,
    hotA: -1,
  });
  return frames;
}

export function diffArrayFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function DiffArrayViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.label}>d[i] (difference)</Text>
      <View style={styles.row}>
        {f.diff.map((v, i) => (
          <PulseOnActive key={`d${i}`} active={i === f.hotDiff}>
            <View style={[styles.cell, styles.diff, i === f.hotDiff && styles.hot]}>
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{v}</Text>
            </View>
          </PulseOnActive>
        ))}
      </View>
      <Text style={styles.label}>a[i] = prefix of d</Text>
      <View style={styles.row}>
        {f.a.map((v, i) => (
          <PulseOnActive key={`a${i}`} active={i === f.hotA}>
            <View
              style={[
                styles.cell,
                v != null && styles.done,
                i === f.hotA && styles.hot,
              ]}
            >
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{v == null ? '·' : v}</Text>
            </View>
          </PulseOnActive>
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
  label: { color: colors.textDim, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: {
    minWidth: 32,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  diff: { borderColor: colors.radar },
  done: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  hot: { borderColor: colors.warning, borderWidth: 2 },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
