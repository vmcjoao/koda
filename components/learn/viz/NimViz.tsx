import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

/** Frames: show heaps, then fold XOR left→right. */
export function nimFrameCount(demo: ArrayDemo): number {
  return demo.values.length + 1;
}

export function NimViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const heaps = demo.values;
  const folded = Math.min(Math.max(0, step), heaps.length);
  const xor = useMemo(() => {
    let x = 0;
    for (let i = 0; i < folded; i++) x ^= heaps[i]!;
    return x;
  }, [folded, heaps]);

  const maxH = Math.max(1, ...heaps);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {folded === 0
          ? 'Nim heaps · XOR starts at 0'
          : `XOR heaps[0…${folded - 1}] = ${xor}${
              folded === heaps.length ? (xor === 0 ? ' · losing' : ' · winning') : ''
            }`}
      </Text>
      <View style={styles.heaps}>
        {heaps.map((h, i) => {
          const used = i < folded;
          return (
            <View key={i} style={styles.heapCol}>
              <View style={styles.bars}>
                {Array.from({ length: maxH }, (_, k) => {
                  const on = k < h;
                  return (
                    <View
                      key={k}
                      style={[
                        styles.bar,
                        on && styles.barOn,
                        on && used && styles.barUsed,
                      ]}
                    />
                  );
                }).reverse()}
              </View>
              <Text style={[styles.heapVal, used && styles.heapValOn]}>{h}</Text>
              <Text style={styles.heapIdx}>#{i}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.xorLine}>
        running XOR: <Text style={styles.xorVal}>{xor}</Text>
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
  heaps: { flexDirection: 'row', gap: 14, alignItems: 'flex-end' },
  heapCol: { alignItems: 'center', gap: 4 },
  bars: { justifyContent: 'flex-end', gap: 2, minHeight: 80 },
  bar: {
    width: 22,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.runTrack,
  },
  barOn: { backgroundColor: colors.radar },
  barUsed: { backgroundColor: colors.accent },
  heapVal: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  heapValOn: { color: colors.accent },
  heapIdx: { color: colors.textDim, fontSize: 10 },
  xorLine: { color: colors.textMuted, fontSize: 13, fontFamily: 'SpaceMono' },
  xorVal: { color: colors.warning, fontWeight: '900' },
});
