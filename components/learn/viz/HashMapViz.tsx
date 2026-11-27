import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  i: number;
  /** key → count */
  entries: [number, number][];
  hotKey: number | null;
};

function buildFrames(values: number[]): Frame[] {
  const map = new Map<number, number>();
  const frames: Frame[] = [
    { label: 'empty map', i: -1, entries: [], hotKey: null },
  ];
  for (let i = 0; i < values.length; i++) {
    const k = values[i]!;
    map.set(k, (map.get(k) ?? 0) + 1);
    frames.push({
      label: `a[${i}]=${k} · freq[${k}]=${map.get(k)}`,
      i,
      entries: [...map.entries()].sort((a, b) => a[0] - b[0]),
      hotKey: k,
    });
  }
  frames.push({
    label: `done · ${map.size} distinct keys`,
    i: values.length - 1,
    entries: [...map.entries()].sort((a, b) => a[0] - b[0]),
    hotKey: null,
  });
  return frames;
}

export function hashMapFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function HashMapViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.label}>stream a[i]</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => (
          <PulseOnActive key={i} active={i === f.i}>
            <View style={[styles.cell, i === f.i && styles.cur, i <= f.i && styles.seen]}>
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{v}</Text>
            </View>
          </PulseOnActive>
        ))}
      </View>
      <Text style={styles.label}>freq map</Text>
      <View style={styles.row}>
        {f.entries.length === 0 ? (
          <Text style={styles.empty}>{`{ }`}</Text>
        ) : (
          f.entries.map(([k, c]) => (
            <PulseOnActive key={k} active={k === f.hotKey}>
              <View style={[styles.bucket, k === f.hotKey && styles.hot]}>
                <Text style={styles.key}>{k}</Text>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.val}>{c}</Text>
              </View>
            </PulseOnActive>
          ))
        )}
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
  seen: { borderColor: colors.radar },
  cur: { borderColor: colors.warning, borderWidth: 2 },
  bucket: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  hot: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  key: { color: colors.radar, fontFamily: 'SpaceMono', fontWeight: '800' },
  arrow: { color: colors.textDim },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  empty: { color: colors.textDim, fontFamily: 'SpaceMono' },
});
