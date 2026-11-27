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
  // Keep Euclid demos short — huge seeds make long remainder chains.
  a = Math.min(a, 99);
  b = Math.min(b, 99);
  if (a < b) [a, b] = [b, a];
  const frames: Frame[] = [{ label: `gcd(${a}, ${b})`, a, b }];
  let guard = 0;
  while (b !== 0 && guard++ < 12) {
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
      <Text style={styles.meta} numberOfLines={2}>
        {f.label}
      </Text>
      <View style={styles.row}>
        <PulseOnActive active={f.b !== 0 || step === 0}>
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
      {/* Compact Euclid bar — width proportional, capped to canvas. */}
      <View style={styles.bars}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              styles.barA,
              { width: `${Math.min(100, (f.a / Math.max(f.a, f.b, 1)) * 100)}%` },
            ]}
          />
        </View>
        {f.b > 0 ? (
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                styles.barB,
                { width: `${Math.min(100, (f.b / Math.max(f.a, f.b, 1)) * 100)}%` },
              ]}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    alignItems: 'center',
  },
  meta: {
    color: colors.xp,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'stretch',
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  cell: {
    minWidth: 56,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  a: { borderColor: colors.accent },
  b: { borderColor: colors.radar },
  tag: { color: colors.textDim, fontSize: 10, fontWeight: '700' },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800', fontSize: 18 },
  bars: { width: '100%', gap: 4 },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  barA: { backgroundColor: colors.accent },
  barB: { backgroundColor: colors.radar },
});
