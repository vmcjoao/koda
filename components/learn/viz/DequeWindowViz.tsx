import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  i: number;
  dq: number[];
  ans: number[];
  windowL: number;
  windowR: number;
};

/** Sliding window maximum; target = window size k (default 3). */
function buildFrames(demo: ArrayDemo): Frame[] {
  const a = demo.values;
  const k = Math.max(2, Math.min(demo.target ?? 3, a.length));
  const dq: number[] = [];
  const ans: number[] = [];
  const frames: Frame[] = [
    { label: `window k=${k} · deque empty`, i: -1, dq: [], ans: [], windowL: 0, windowR: -1 },
  ];
  for (let i = 0; i < a.length; i++) {
    while (dq.length && a[dq[dq.length - 1]!]! <= a[i]!) {
      dq.pop();
      frames.push({
        label: `i=${i} · pop back (not max)`,
        i,
        dq: [...dq],
        ans: [...ans],
        windowL: Math.max(0, i - k + 1),
        windowR: i,
      });
    }
    dq.push(i);
    frames.push({
      label: `i=${i} · push ${i} (a=${a[i]})`,
      i,
      dq: [...dq],
      ans: [...ans],
      windowL: Math.max(0, i - k + 1),
      windowR: i,
    });
    if (dq[0]! <= i - k) {
      dq.shift();
      frames.push({
        label: `i=${i} · pop front (left of window)`,
        i,
        dq: [...dq],
        ans: [...ans],
        windowL: Math.max(0, i - k + 1),
        windowR: i,
      });
    }
    if (i >= k - 1) {
      ans.push(a[dq[0]!]!);
      frames.push({
        label: `window [${i - k + 1},${i}] max=${a[dq[0]!]}`,
        i,
        dq: [...dq],
        ans: [...ans],
        windowL: i - k + 1,
        windowR: i,
      });
    }
  }
  return frames;
}

export function dequeWindowFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo).length;
}

export function DequeWindowViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo), [demo]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const k = Math.max(2, Math.min(demo.target ?? 3, demo.values.length));

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => {
          const inWin = f.windowR >= 0 && i >= f.windowL && i <= f.windowR;
          const inDq = f.dq.includes(i);
          const isFront = f.dq[0] === i;
          return (
            <PulseOnActive key={i} active={i === f.i}>
              <View
                style={[
                  styles.cell,
                  inWin && styles.inWin,
                  inDq && styles.inDq,
                  isFront && styles.front,
                  i === f.i && styles.cur,
                ]}
              >
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{v}</Text>
              </View>
            </PulseOnActive>
          );
        })}
      </View>
      <Text style={styles.line}>
        dq (front→back): [{f.dq.join(', ') || ' '}] · k={k}
      </Text>
      <Text style={styles.line}>
        ans: [{f.ans.join(', ') || ' '}]
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
  inWin: { backgroundColor: colors.chipSelected },
  inDq: { borderColor: colors.radar },
  front: { borderColor: colors.accent },
  cur: { borderColor: colors.warning },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  line: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    alignSelf: 'flex-start',
  },
});
