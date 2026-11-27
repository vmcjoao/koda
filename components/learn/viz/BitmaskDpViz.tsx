import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  mask: number;
  /** Best cost to assign first popcount people (toy: sum of chosen item values). */
  dp: number;
  chosen: number[];
};

/**
 * Tiny assignment-style walk: items = demo.values (n≤4),
 * enumerate masks in order; dp[mask] = sum of selected values (illustrates subset DP shape).
 */
function buildFrames(values: number[]): Frame[] {
  const n = Math.min(4, values.length);
  const a = values.slice(0, n);
  const frames: Frame[] = [
    { label: `n=${n} items · dp[0]=0`, mask: 0, dp: 0, chosen: [] },
  ];
  const N = 1 << n;
  const dp = Array(N).fill(Infinity);
  dp[0] = 0;
  for (let mask = 0; mask < N; mask++) {
    if (dp[mask] === Infinity) continue;
    const i = bitCount(mask);
    if (i >= n) continue;
    for (let j = 0; j < n; j++) {
      if (mask & (1 << j)) continue;
      const next = mask | (1 << j);
      const cost = dp[mask]! + a[j]!;
      if (cost < dp[next]!) {
        dp[next] = cost;
        const chosen = bits(next);
        frames.push({
          label: `mask ${bin(mask, n)} + item ${j} → ${bin(next, n)} · dp=${cost}`,
          mask: next,
          dp: cost,
          chosen,
        });
      }
    }
  }
  frames.push({
    label: `full mask · dp[${bin(N - 1, n)}]=${dp[N - 1]}`,
    mask: N - 1,
    dp: dp[N - 1]!,
    chosen: bits(N - 1),
  });
  return frames;
}

function bitCount(x: number) {
  let c = 0;
  while (x) {
    c += x & 1;
    x >>= 1;
  }
  return c;
}
function bits(mask: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < 8; i++) if (mask & (1 << i)) out.push(i);
  return out;
}
function bin(mask: number, n: number) {
  return mask.toString(2).padStart(n, '0');
}

export function bitmaskDpFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function BitmaskDpViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const n = Math.min(4, demo.values.length);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.label}>items (assign next person → one unused job)</Text>
      <View style={styles.row}>
        {demo.values.slice(0, n).map((v, j) => {
          const on = f.chosen.includes(j);
          return (
            <PulseOnActive key={j} active={on}>
              <View style={[styles.cell, on && styles.on]}>
                <Text style={styles.idx}>j={j}</Text>
                <Text style={styles.val}>{v}</Text>
                <Text style={styles.bit}>{on ? '1' : '0'}</Text>
              </View>
            </PulseOnActive>
          );
        })}
      </View>
      <Text style={styles.dp}>
        mask={bin(f.mask, n)} · dp={f.dp === Infinity ? '∞' : f.dp}
      </Text>
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
  label: { color: colors.textDim, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: {
    minWidth: 48,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  on: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  bit: { color: colors.radar, fontFamily: 'SpaceMono', fontSize: 12, fontWeight: '900' },
  dp: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
});
