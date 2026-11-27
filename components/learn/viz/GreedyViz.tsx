import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Interval = { i: number; s: number; e: number };
type Frame = {
  label: string;
  sorted: Interval[];
  chosen: number[];
  lastEnd: number;
  cur: number;
};

/** Interval scheduling: values as end times; starts = end - (i%3+1). */
function buildFrames(ends: number[]): Frame[] {
  const intervals: Interval[] = ends.map((e, i) => ({
    i,
    s: Math.max(0, e - ((i % 3) + 2)),
    e,
  }));
  const sorted = [...intervals].sort((a, b) => a.e - b.e || a.s - b.s);
  const frames: Frame[] = [
    {
      label: 'sort by end time',
      sorted,
      chosen: [],
      lastEnd: -1,
      cur: -1,
    },
  ];
  const chosen: number[] = [];
  let lastEnd = -Infinity;
  for (let k = 0; k < sorted.length; k++) {
    const it = sorted[k]!;
    frames.push({
      label: `consider [${it.s},${it.e}]`,
      sorted,
      chosen: [...chosen],
      lastEnd: lastEnd === -Infinity ? -1 : lastEnd,
      cur: k,
    });
    if (it.s >= lastEnd) {
      chosen.push(k);
      lastEnd = it.e;
      frames.push({
        label: `take [${it.s},${it.e}] · lastEnd=${lastEnd}`,
        sorted,
        chosen: [...chosen],
        lastEnd,
        cur: k,
      });
    } else {
      frames.push({
        label: `skip [${it.s},${it.e}] (overlaps)`,
        sorted,
        chosen: [...chosen],
        lastEnd: lastEnd === -Infinity ? -1 : lastEnd,
        cur: k,
      });
    }
  }
  frames.push({
    label: `done · ${chosen.length} intervals`,
    sorted,
    chosen: [...chosen],
    lastEnd: lastEnd === -Infinity ? -1 : lastEnd,
    cur: -1,
  });
  return frames;
}

export function greedyFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function GreedyViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.col}>
        {f.sorted.map((it, k) => {
          const taken = f.chosen.includes(k);
          const cur = k === f.cur;
          return (
            <PulseOnActive key={it.i} active={cur}>
              <View
                style={[
                  styles.bar,
                  taken && styles.taken,
                  cur && styles.cur,
                ]}
              >
                <Text style={styles.val}>
                  #{it.i}  [{it.s}, {it.e}]
                  {taken ? ' ✓' : ''}
                </Text>
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
  col: { width: '100%', gap: 4 },
  bar: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  taken: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  cur: { borderColor: colors.warning },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
