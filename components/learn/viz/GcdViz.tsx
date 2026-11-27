import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = { label: string; a: number; b: number };

function buildFrames(demo: ArrayDemo): Frame[] {
  let a = Math.abs(demo.values[0] ?? 48);
  let b = Math.abs(demo.values[1] ?? 18);
  if (a < b) [a, b] = [b, a];
  const frames: Frame[] = [{ label: `gcd(${a}, ${b})`, a, b }];
  while (b !== 0) {
    const r = a % b;
    frames.push({
      label: `${a} = ${Math.floor(a / b)}·${b} + ${r}`,
      a: b,
      b: r,
    });
    a = frames[frames.length - 1]!.a;
    b = frames[frames.length - 1]!.b;
  }
  frames.push({ label: `gcd = ${a}`, a, b: 0 });
  return frames;
}

export function gcdFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo).length;
}

export function GcdViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo), [demo]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.row}>
        <PulseOnActive active>
          <View style={[styles.cell, styles.a]}>
            <Text style={styles.tag}>a</Text>
            <Text style={styles.val}>{f.a}</Text>
          </View>
        </PulseOnActive>
        <PulseOnActive active={f.b !== 0}>
          <View style={[styles.cell, styles.b]}>
            <Text style={styles.tag}>b</Text>
            <Text style={styles.val}>{f.b}</Text>
          </View>
        </PulseOnActive>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md, width: '100%', alignItems: 'center' },
  meta: {
    color: colors.xp,
    fontFamily: 'SpaceMono',
    fontSize: 13,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  row: { flexDirection: 'row', gap: spacing.md },
  cell: {
    minWidth: 72,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  a: { borderColor: colors.accent },
  b: { borderColor: colors.radar },
  tag: { color: colors.textDim, fontSize: 11, fontWeight: '700' },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800', fontSize: 22 },
});
