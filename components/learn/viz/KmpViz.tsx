import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StringDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

function buildPi(s: string): number[] {
  const n = s.length;
  const pi = Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    let j = pi[i - 1]!;
    while (j > 0 && s[i] !== s[j]) j = pi[j - 1]!;
    if (s[i] === s[j]) j++;
    pi[i] = j;
  }
  return pi;
}

/** Frames: start + one per index i≥1 after computing π[i]. */
export function kmpFrameCount(demo: StringDemo): number {
  return Math.max(1, demo.text.length);
}

export function KmpViz({ demo, step }: { demo: StringDemo; step: number }) {
  const s = demo.text.slice(0, 16);
  const piFull = useMemo(() => buildPi(s), [s]);
  const built = Math.min(Math.max(0, step), Math.max(0, s.length - 1));

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {built === 0
          ? `s = "${s}" · π[0]=0`
          : `π[1…${built}] · last π[${built}]=${piFull[built]} (border length)`}
      </Text>
      <Text style={styles.label}>s[i]</Text>
      <View style={styles.row}>
        {s.split('').map((ch, i) => (
          <View key={`c${i}`} style={[styles.cell, i <= built && styles.done]}>
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{ch}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>π[i] = longest proper border</Text>
      <View style={styles.row}>
        {piFull.map((v, i) => (
          <PulseOnActive key={`p${i}`} active={i === built && built > 0}>
            <View
              style={[
                styles.cell,
                styles.pi,
                i <= built && styles.piOn,
                i === built && built > 0 && styles.active,
              ]}
            >
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{i <= built ? v : '·'}</Text>
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
    minWidth: 28,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  done: { borderColor: colors.radar },
  pi: { borderColor: colors.border },
  piOn: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  active: { borderColor: colors.warning, borderWidth: 2 },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
