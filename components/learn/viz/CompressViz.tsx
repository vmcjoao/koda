import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  phase: 'raw' | 'sorted' | 'ranks' | 'mapped';
  uniq: number[];
  ranks: number[];
};

function buildFrames(values: number[]): Frame[] {
  const uniq = [...new Set(values)].sort((a, b) => a - b);
  const rankOf = new Map(uniq.map((v, i) => [v, i]));
  const ranks = values.map((v) => rankOf.get(v)!);
  return [
    { label: 'raw values (huge domain)', phase: 'raw', uniq: [], ranks: [] },
    {
      label: 'sort unique',
      phase: 'sorted',
      uniq,
      ranks: [],
    },
    {
      label: 'assign ranks 0…U−1',
      phase: 'ranks',
      uniq,
      ranks: uniq.map((_, i) => i),
    },
    {
      label: 'map a[i] → rank',
      phase: 'mapped',
      uniq,
      ranks,
    },
  ];
}

export function compressFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function CompressViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.label}>a[i]</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => (
          <PulseOnActive key={i} active={f.phase === 'mapped'}>
            <View style={[styles.cell, f.phase === 'mapped' && styles.mapped]}>
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>
                {f.phase === 'mapped' ? f.ranks[i] : v}
              </Text>
            </View>
          </PulseOnActive>
        ))}
      </View>
      {f.uniq.length > 0 ? (
        <>
          <Text style={styles.label}>unique sorted</Text>
          <View style={styles.row}>
            {f.uniq.map((v, i) => (
              <View key={i} style={[styles.cell, styles.uniq]}>
                <Text style={styles.idx}>
                  {f.phase === 'ranks' || f.phase === 'mapped' ? `→${i}` : ''}
                </Text>
                <Text style={styles.val}>{v}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
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
    minWidth: 40,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  uniq: { borderColor: colors.radar },
  mapped: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
});
