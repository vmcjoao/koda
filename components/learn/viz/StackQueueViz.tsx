import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

export function stackQueueFrameCount(demo: ArrayDemo): number {
  return demo.values.length + 1;
}

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
  const contents = demo.values.slice(0, n);
  const display = mode === 'stack' ? [...contents].reverse() : contents;
  const last = n > 0 ? demo.values[n - 1] : null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {n === 0
          ? `${mode} empty`
          : mode === 'stack'
            ? `push ${last} · top →`
            : `enqueue ${last} · front → back`}
      </Text>
      <View style={styles.row}>
        {display.length === 0 ? (
          <Text style={styles.empty}>[ ]</Text>
        ) : (
          display.map((v, i) => {
            const isTop = mode === 'stack' && i === 0;
            const isFront = mode === 'queue' && i === 0;
            const isBack = mode === 'queue' && i === display.length - 1;
            return (
              <View
                key={`${v}-${i}`}
                style={[
                  styles.cell,
                  (isTop || isBack) && styles.hot,
                  isFront && styles.front,
                ]}
              >
                <Text style={styles.val}>{v}</Text>
                {isTop ? <Text style={styles.tag}>TOP</Text> : null}
                {isFront && !isBack ? <Text style={styles.tag}>F</Text> : null}
                {isBack ? <Text style={styles.tag}>B</Text> : null}
              </View>
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, minHeight: 48, alignItems: 'center' },
  empty: { color: colors.textDim, fontFamily: 'SpaceMono', fontSize: 16 },
  cell: {
    minWidth: 40,
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
  stream: { color: colors.textMuted, fontSize: 11, fontFamily: 'SpaceMono', alignSelf: 'flex-start' },
});
