import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  x: number;
  active: number;
  coverage: number[];
};

/**
 * demo.values = difference events on the line (same spirit as coverage):
 * process left→right, active += event, coverage[x]=active.
 */
function buildFrames(events: number[]): Frame[] {
  const frames: Frame[] = [
    { label: 'sweep · active=0', x: -1, active: 0, coverage: Array(events.length).fill(0) },
  ];
  let active = 0;
  const coverage = Array(events.length).fill(0);
  for (let x = 0; x < events.length; x++) {
    active += events[x]!;
    coverage[x] = active;
    frames.push({
      label: `x=${x} · event ${events[x]! >= 0 ? '+' : ''}${events[x]} · active=${active}`,
      x,
      active,
      coverage: [...coverage],
    });
  }
  frames.push({
    label: 'done · coverage histogram',
    x: events.length - 1,
    active,
    coverage: [...coverage],
  });
  return frames;
}

export function sweepFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function SweepViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.label}>events (Δ at x)</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => (
          <PulseOnActive key={i} active={i === f.x}>
            <View style={[styles.cell, i === f.x && styles.hot]}>
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{v}</Text>
            </View>
          </PulseOnActive>
        ))}
      </View>
      <Text style={styles.label}>coverage[x]</Text>
      <View style={styles.row}>
        {f.coverage.map((v, i) => (
          <View
            key={i}
            style={[styles.cell, styles.cov, i <= f.x && styles.covOn]}
          >
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{i <= f.x ? v : '·'}</Text>
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
  label: { color: colors.textDim, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
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
  hot: { borderColor: colors.warning, borderWidth: 2 },
  cov: { borderColor: colors.radar },
  covOn: { backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
});
