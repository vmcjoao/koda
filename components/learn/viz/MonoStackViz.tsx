import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { AnimatedSlot, PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

/** Frames: start + one per index processed (after push). */
export function monoStackFrameCount(demo: ArrayDemo): number {
  return demo.values.length + 1;
}

const CELL = 40;
const GAP = 6;

export function MonoStackViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const snapshot = useMemo(() => {
    const a = demo.values;
    const ng = Array(a.length).fill(-1);
    const st: number[] = [];
    const frames: { i: number; stack: number[]; ng: number[] }[] = [];
    frames.push({ i: -1, stack: [], ng: [...ng] });
    for (let i = 0; i < a.length; i++) {
      while (st.length && a[st[st.length - 1]!]! < a[i]!) {
        ng[st.pop()!] = i;
      }
      st.push(i);
      frames.push({ i, stack: [...st], ng: [...ng] });
    }
    return frames;
  }, [demo.values]);

  const frame = snapshot[Math.min(step, snapshot.length - 1)]!;
  const n = demo.values.length;
  const rowW = n * CELL + Math.max(0, n - 1) * GAP;
  const stackW = Math.max(frame.stack.length * (CELL + GAP) + 8, 48);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {frame.i < 0 ? 'empty stack' : `process i=${frame.i} (a=${demo.values[frame.i]})`}
      </Text>
      <View style={[styles.rowCanvas, { width: rowW }]}>
        {demo.values.map((v, i) => {
          const onStack = frame.stack.includes(i);
          const isCur = i === frame.i;
          return (
            <PulseOnActive
              key={i}
              active={isCur}
              style={[styles.cellAbs, { left: i * (CELL + GAP) }]}
            >
              <View style={[styles.cell, onStack && styles.onStack, isCur && styles.cur]}>
                <Text style={styles.idx}>{i}</Text>
                <Text style={[styles.val, (onStack || isCur) && styles.valOn]}>{v}</Text>
                <Text style={styles.ng}>→{frame.ng[i]! < 0 ? '·' : frame.ng[i]}</Text>
              </View>
            </PulseOnActive>
          );
        })}
      </View>
      <Text style={styles.stackLabel}>stack (bottom → top)</Text>
      <View style={[styles.stackCanvas, { width: stackW }]}>
        {frame.stack.length === 0 ? (
          <Text style={styles.empty}>[ ]</Text>
        ) : (
          frame.stack.map((idx, pos) => (
            <AnimatedSlot key={`st-${idx}`} x={4 + pos * (CELL + GAP)} y={4}>
              <View style={[styles.stackCell, pos === frame.stack.length - 1 && styles.stackTop]}>
                <Text style={styles.val}>{demo.values[idx]}</Text>
                <Text style={styles.idx}>i={idx}</Text>
              </View>
            </AnimatedSlot>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
  meta: { color: colors.xp, fontFamily: 'SpaceMono', fontSize: 12, fontWeight: '700' },
  rowCanvas: { position: 'relative', height: 68, alignSelf: 'center' },
  cellAbs: { position: 'absolute', top: 0 },
  cell: {
    width: CELL,
    minWidth: CELL,
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
  stackLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  stackCanvas: { position: 'relative', height: 56, alignSelf: 'flex-start', minWidth: 48 },
  empty: { color: colors.textDim, fontFamily: 'SpaceMono', marginTop: 12 },
  stackCell: {
    width: CELL,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.radar,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  stackTop: { borderColor: colors.warning, backgroundColor: colors.chipSelected },
});
