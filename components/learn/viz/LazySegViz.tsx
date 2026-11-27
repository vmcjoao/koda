import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  /** leaf values after updates */
  leaves: number[];
  /** lazy add pending on a conceptual root covering [0,n) */
  lazyRoot: number;
  hot: number[];
};

/**
 * Teaching sketch: build leaves, then apply 1–2 range-adds with a root lazy tag,
 * then push and show updated leaves. Not a full 4n tree — focuses on lazy idea.
 */
function buildFrames(values: number[]): Frame[] {
  const n = values.length;
  const leaves = [...values];
  const frames: Frame[] = [
    {
      label: 'leaves = a[i] · lazy=0',
      leaves: [...leaves],
      lazyRoot: 0,
      hot: [],
    },
  ];

  // Range add [1, n-2] += 2 (if n>=3), else [0,0] += 3
  const L = n >= 3 ? 1 : 0;
  const R = n >= 3 ? n - 2 : 0;
  const add = 2;
  frames.push({
    label: `range add [${L},${R}] += ${add} · tag root lazy (don't touch all leaves yet)`,
    leaves: [...leaves],
    lazyRoot: add,
    hot: Array.from({ length: R - L + 1 }, (_, i) => L + i),
  });

  // Push: apply lazy to covered leaves
  for (let i = L; i <= R; i++) leaves[i]! += add;
  frames.push({
    label: `push lazy → leaves[${L}…${R}] += ${add} · clear tag`,
    leaves: [...leaves],
    lazyRoot: 0,
    hot: Array.from({ length: R - L + 1 }, (_, i) => L + i),
  });

  if (n >= 2) {
    const L2 = 0;
    const R2 = Math.min(1, n - 1);
    frames.push({
      label: `range add [${L2},${R2}] += 1 · set lazy again`,
      leaves: [...leaves],
      lazyRoot: 1,
      hot: Array.from({ length: R2 - L2 + 1 }, (_, i) => L2 + i),
    });
    for (let i = L2; i <= R2; i++) leaves[i]! += 1;
    frames.push({
      label: 'push · materialize pending add on covered segment',
      leaves: [...leaves],
      lazyRoot: 0,
      hot: Array.from({ length: R2 - L2 + 1 }, (_, i) => L2 + i),
    });
  }

  frames.push({
    label: 'done · O(log N) when a real tree pushes only on the path',
    leaves: [...leaves],
    lazyRoot: 0,
    hot: [],
  });
  return frames;
}

export function lazySegFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

export function LazySegViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.lazyBox}>
        <Text style={styles.lazyLabel}>root lazy</Text>
        <Text style={[styles.lazyVal, f.lazyRoot !== 0 && styles.lazyOn]}>
          {f.lazyRoot === 0 ? '0' : `+${f.lazyRoot}`}
        </Text>
      </View>
      <Text style={styles.label}>leaves</Text>
      <View style={styles.row}>
        {f.leaves.map((v, i) => {
          const hot = f.hot.includes(i);
          return (
            <PulseOnActive key={i} active={hot}>
              <View style={[styles.cell, hot && styles.hot]}>
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{v}</Text>
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
    fontSize: 11,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  lazyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.radar,
    backgroundColor: colors.surfaceElevated,
  },
  lazyLabel: { color: colors.textDim, fontSize: 11, fontWeight: '700' },
  lazyVal: { color: colors.textMuted, fontFamily: 'SpaceMono', fontWeight: '800', fontSize: 16 },
  lazyOn: { color: colors.warning },
  label: { color: colors.textDim, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: {
    minWidth: 36,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  hot: { borderColor: colors.warning, borderWidth: 2, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
});
