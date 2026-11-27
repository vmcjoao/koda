import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import {
  AnimatedSlot,
  PulseOnActive,
  vizEntering,
  vizExiting,
  vizLayout,
} from '@/components/learn/viz/AnimatedSlot';

export function stackQueueFrameCount(demo: ArrayDemo): number {
  return demo.values.length + 1;
}

const CELL = 44;
const GAP = 6;
const PAD = 4;

/** Push/enqueue values[0..step) — stack grows right (top), queue left→right (front→back). */
export function StackQueueViz({
  demo,
  step,
  mode,
}: {
  demo: ArrayDemo;
  step: number;
  mode: 'stack' | 'queue';
}) {
  const n = Math.min(Math.max(0, step), demo.values.length);
  const contents = useMemo(
    () =>
      demo.values.slice(0, n).map((value, i) => ({
        id: `s${i}`,
        value,
        streamIndex: i,
      })),
    [demo.values, n],
  );
  const display = mode === 'stack' ? [...contents].reverse() : contents;
  const last = n > 0 ? demo.values[n - 1] : null;
  const canvasW = Math.max(display.length * (CELL + GAP) + PAD * 2, 80);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {n === 0
          ? `${mode} empty`
          : mode === 'stack'
            ? `push ${last} · top →`
            : `enqueue ${last} · front → back`}
      </Text>
      <View style={[styles.canvas, { width: canvasW }]}>
        {display.length === 0 ? (
          <Text style={styles.empty}>[ ]</Text>
        ) : (
          display.map((item, i) => {
            const isTop = mode === 'stack' && i === 0;
            const isFront = mode === 'queue' && i === 0;
            const isBack = mode === 'queue' && i === display.length - 1;
            const x = PAD + i * (CELL + GAP);
            return (
              <AnimatedSlot key={item.id} x={x} y={8}>
                <PulseOnActive active={isTop || isBack}>
                  <Animated.View
                    entering={vizEntering}
                    exiting={vizExiting}
                    layout={vizLayout}
                    style={[
                      styles.cell,
                      (isTop || isBack) && styles.hot,
                      isFront && styles.front,
                    ]}
                  >
                    <Text style={styles.val}>{item.value}</Text>
                    {isTop ? <Text style={styles.tag}>TOP</Text> : null}
                    {isFront && !isBack ? <Text style={styles.tag}>F</Text> : null}
                    {isBack ? <Text style={styles.tag}>B</Text> : null}
                  </Animated.View>
                </PulseOnActive>
              </AnimatedSlot>
            );
          })
        )}
      </View>
      <Text style={styles.stream}>
        stream: [{demo.values.join(', ')}] · placed {n}/{demo.values.length}
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
  canvas: { position: 'relative', height: 64, alignSelf: 'center' },
  empty: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontSize: 16,
    marginTop: 16,
  },
  cell: {
    width: CELL,
    minWidth: CELL,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  hot: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  front: { borderColor: colors.radar },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  tag: { color: colors.warning, fontSize: 9, fontWeight: '900' },
  stream: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'SpaceMono',
    alignSelf: 'flex-start',
  },
});
