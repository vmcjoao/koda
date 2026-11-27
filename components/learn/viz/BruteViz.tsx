import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = { label: string; mask: number; sum: number };

/** Subset enumeration for n≤4 — complete search shape. */
function buildFrames(values: number[]): Frame[] {
  const n = Math.min(4, values.length);
  const a = values.slice(0, n);
  const frames: Frame[] = [{ label: `enumerate 2^${n} subsets`, mask: 0, sum: 0 }];
  for (let mask = 0; mask < 1 << n; mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) sum += a[i]!;
    frames.push({
      label: `mask ${mask.toString(2).padStart(n, '0')} · sum=${sum}`,
      mask,
      sum,
    });
  }
  return frames;
}

export function bruteFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function BruteViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const n = Math.min(4, demo.values.length);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.row}>
        {demo.values.slice(0, n).map((v, i) => {
          const on = !!(f.mask & (1 << i));
          return (
            <PulseOnActive key={i} active={on}>
              <View style={[styles.cell, on && styles.on]}>
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{v}</Text>
                <Text style={styles.bit}>{on ? '1' : '0'}</Text>
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: {
    minWidth: 44,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  on: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  bit: { color: colors.radar, fontFamily: 'SpaceMono', fontWeight: '900' },
});
