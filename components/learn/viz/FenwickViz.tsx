import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  bit: number[];
  hot: number[];
  aBuilt: number;
};

function buildFrames(values: number[]): Frame[] {
  const n = values.length;
  const bit = Array(n + 1).fill(0);
  const frames: Frame[] = [
    { label: 'BIT empty · 1-based bit[1…n]', bit: [...bit], hot: [], aBuilt: 0 },
  ];
  for (let i = 0; i < n; i++) {
    const idx0 = i;
    let p = i + 1;
    const path: number[] = [];
    const v = values[i]!;
    while (p <= n) {
      bit[p] += v;
      path.push(p);
      p += p & -p;
    }
    frames.push({
      label: `add(i=${i + 1}, v=${v}) · path ${path.join('→')}`,
      bit: [...bit],
      hot: path,
      aBuilt: idx0 + 1,
    });
  }
  // One prefix query to show i -= i&-i
  let q = n;
  const qPath: number[] = [];
  let sum = 0;
  while (q > 0) {
    sum += bit[q]!;
    qPath.push(q);
    q -= q & -q;
  }
  frames.push({
    label: `sumPrefix(${n})=${sum} · path ${qPath.join('→')}`,
    bit: [...bit],
    hot: qPath,
    aBuilt: n,
  });
  return frames;
}

export function fenwickFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function FenwickViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const n = demo.values.length;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.label}>a[i] (0-based)</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => (
          <View key={`a${i}`} style={[styles.cell, i < f.aBuilt && styles.done]}>
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{v}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>bit[i] (1-based)</Text>
      <View style={styles.row}>
        {Array.from({ length: n }, (_, i) => i + 1).map((i) => {
          const hot = f.hot.includes(i);
          return (
            <PulseOnActive key={`b${i}`} active={hot}>
              <View style={[styles.cell, styles.bit, hot && styles.hot]}>
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{f.bit[i]}</Text>
              </View>
            </PulseOnActive>
          );
        })}
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
  done: { borderColor: colors.accent },
  bit: { borderColor: colors.radar },
  hot: { borderColor: colors.warning, borderWidth: 2, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
