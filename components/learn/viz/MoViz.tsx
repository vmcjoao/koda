import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Query = { l: number; r: number };
type Frame = {
  label: string;
  L: number;
  R: number;
  qi: number;
  answers: number[];
};

/** Offline Mo: move [L,R] across a few hardcoded queries on the array. */
function buildFrames(values: number[]): Frame[] {
  const n = values.length;
  const queries: Query[] = [
    { l: 0, r: Math.min(2, n - 1) },
    { l: 1, r: Math.min(4, n - 1) },
    { l: 0, r: Math.min(3, n - 1) },
  ].filter((q) => q.l <= q.r);

  const block = Math.max(1, Math.floor(Math.sqrt(n)));
  const order = queries
    .map((q, i) => ({ ...q, i }))
    .sort((a, b) => {
      const ba = Math.floor(a.l / block);
      const bb = Math.floor(b.l / block);
      if (ba !== bb) return ba - bb;
      return ba % 2 === 0 ? a.r - b.r : b.r - a.r;
    });

  const frames: Frame[] = [
    { label: `Mo · block=${block} · sort queries`, L: 0, R: -1, qi: -1, answers: [] },
  ];

  let L = 0;
  let R = -1;
  const freq = new Map<number, number>();
  let distinct = 0;
  const answers: number[] = Array(queries.length).fill(0);

  const add = (i: number) => {
    const v = values[i]!;
    const c = freq.get(v) ?? 0;
    if (c === 0) distinct += 1;
    freq.set(v, c + 1);
  };
  const remove = (i: number) => {
    const v = values[i]!;
    const c = freq.get(v) ?? 0;
    if (c === 1) {
      distinct -= 1;
      freq.delete(v);
    } else freq.set(v, c - 1);
  };

  for (const q of order) {
    while (L > q.l) {
      L -= 1;
      add(L);
      frames.push({
        label: `expand L→${L}`,
        L,
        R,
        qi: q.i,
        answers: [...answers],
      });
    }
    while (R < q.r) {
      R += 1;
      add(R);
      frames.push({
        label: `expand R→${R}`,
        L,
        R,
        qi: q.i,
        answers: [...answers],
      });
    }
    while (L < q.l) {
      remove(L);
      L += 1;
      frames.push({
        label: `shrink L→${L}`,
        L,
        R,
        qi: q.i,
        answers: [...answers],
      });
    }
    while (R > q.r) {
      remove(R);
      R -= 1;
      frames.push({
        label: `shrink R→${R}`,
        L,
        R,
        qi: q.i,
        answers: [...answers],
      });
    }
    answers[q.i] = distinct;
    frames.push({
      label: `answer q${q.i} [${q.l},${q.r}] distinct=${distinct}`,
      L,
      R,
      qi: q.i,
      answers: [...answers],
    });
  }
  return frames;
}

export function moFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function MoViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => {
          const inWin = f.R >= f.L && i >= f.L && i <= f.R;
          return (
            <PulseOnActive key={i} active={i === f.L || i === f.R}>
              <View style={[styles.cell, inWin && styles.inWin]}>
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{v}</Text>
              </View>
            </PulseOnActive>
          );
        })}
      </View>
      <Text style={styles.line}>
        L={f.L} R={f.R} · ans=[{f.answers.join(', ')}]
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
    minWidth: 32,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  inWin: { borderColor: colors.radar, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  line: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    alignSelf: 'flex-start',
  },
});
