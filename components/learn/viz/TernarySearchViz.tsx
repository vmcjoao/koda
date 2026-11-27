import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  lo: number;
  hi: number;
  m1: number;
  m2: number;
  best: number;
};

/** Treat values[i] as f(i) on a unimodal (bitonic min) array. */
function buildFrames(values: number[]): Frame[] {
  let lo = 0;
  let hi = values.length - 1;
  const frames: Frame[] = [
    { label: 'unimodal f · ternary on indices', lo, hi, m1: -1, m2: -1, best: -1 },
  ];
  while (hi - lo > 2) {
    const m1 = lo + Math.floor((hi - lo) / 3);
    const m2 = hi - Math.floor((hi - lo) / 3);
    frames.push({
      label: `m1=${m1} f=${values[m1]} · m2=${m2} f=${values[m2]}`,
      lo,
      hi,
      m1,
      m2,
      best: -1,
    });
    if (values[m1]! < values[m2]!) {
      hi = m2;
      frames.push({
        label: `f(m1)<f(m2) → hi=m2=${m2}`,
        lo,
        hi,
        m1,
        m2,
        best: -1,
      });
    } else {
      lo = m1;
      frames.push({
        label: `f(m1)≥f(m2) → lo=m1=${m1}`,
        lo,
        hi,
        m1,
        m2,
        best: -1,
      });
    }
  }
  let best = lo;
  for (let x = lo; x <= hi; x++) if (values[x]! < values[best]!) best = x;
  frames.push({
    label: `scan [${lo},${hi}] · min at ${best} (f=${values[best]})`,
    lo,
    hi,
    m1: -1,
    m2: -1,
    best,
  });
  return frames;
}

export function ternaryFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function TernarySearchViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => {
          const inRange = i >= f.lo && i <= f.hi;
          const isM1 = i === f.m1;
          const isM2 = i === f.m2;
          const isBest = i === f.best;
          return (
            <PulseOnActive key={i} active={isM1 || isM2 || isBest}>
              <View
                style={[
                  styles.cell,
                  inRange && styles.inRange,
                  isM1 && styles.m1,
                  isM2 && styles.m2,
                  isBest && styles.best,
                ]}
              >
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{v}</Text>
                {isM1 ? <Text style={styles.tag}>m1</Text> : null}
                {isM2 ? <Text style={styles.tag}>m2</Text> : null}
              </View>
            </PulseOnActive>
          );
        })}
      </View>
      <Text style={styles.line}>
        lo={f.lo} hi={f.hi}
        {f.best >= 0 ? ` · argmin=${f.best}` : ''}
      </Text>
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: {
    minWidth: 36,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  inRange: { borderColor: colors.radar },
  m1: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  m2: { borderColor: colors.warning },
  best: { borderColor: colors.xp, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  tag: { color: colors.radar, fontSize: 9, fontWeight: '900' },
  line: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    alignSelf: 'flex-start',
  },
});
