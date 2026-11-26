import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

/** Frames: start + one per index processed (after push). */
export function monoStackFrameCount(demo: ArrayDemo): number {
  return demo.values.length + 1;
}

export function MonoStackViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const snapshot = useMemo(() => {
    const a = demo.values;
    const ng = Array(a.length).fill(-1);
    const st: number[] = [];
    const frames: { i: number; stack: number[]; ng: number[] }[] = [];
    frames.push({ i: -1, stack: [], ng: [...ng] });
    for (let i = 0; i < a.length; i++) {
      while (st.length && a[st[st.length - 1]] < a[i]) {
        ng[st.pop()!] = i;
      }
      st.push(i);
      frames.push({ i, stack: [...st], ng: [...ng] });
    }
    return frames;
  }, [demo.values]);

  const frame = snapshot[Math.min(step, snapshot.length - 1)];

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {frame.i < 0 ? 'empty stack' : `process i=${frame.i} (a=${demo.values[frame.i]})`}
      </Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => {
          const onStack = frame.stack.includes(i);
          const isCur = i === frame.i;
          return (
            <View
              key={i}
              style={[styles.cell, onStack && styles.onStack, isCur && styles.cur]}
            >
              <Text style={styles.idx}>{i}</Text>
              <Text style={[styles.val, (onStack || isCur) && styles.valOn]}>{v}</Text>
              <Text style={styles.ng}>
                →{frame.ng[i] < 0 ? '·' : frame.ng[i]}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.stackLine}>
        stack: [{frame.stack.join(', ') || ' '}]
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
  meta: { color: colors.xp, fontFamily: 'SpaceMono', fontSize: 12, fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
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
  onStack: { borderColor: colors.radar },
  cur: { backgroundColor: colors.accent, borderColor: colors.accent },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  valOn: { color: colors.background },
  ng: { color: colors.textDim, fontSize: 9, fontFamily: 'SpaceMono' },
  stackLine: { color: colors.textMuted, fontFamily: 'SpaceMono', fontSize: 12 },
});
