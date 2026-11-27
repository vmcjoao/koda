import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import {
  PulseOnActive,
  vizEntering,
  vizLayout,
} from '@/components/learn/viz/AnimatedSlot';

export function lisFrameCount(demo: ArrayDemo): number {
  return demo.values.length + 1;
}

export function LisViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const { dp, best } = useMemo(() => {
    const n = demo.values.length;
    const dp = Array(n).fill(1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (demo.values[j]! < demo.values[i]!) dp[i] = Math.max(dp[i]!, dp[j]! + 1);
      }
    }
    return { dp, best: n ? Math.max(...dp) : 0 };
  }, [demo.values]);

  const built = Math.min(Math.max(0, step), demo.values.length);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        LIS length so far · max dp = {built ? Math.max(...dp.slice(0, built)) : 0} (final {best})
      </Text>
      <Text style={styles.label}>a[i]</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => (
          <PulseOnActive key={`a${i}`} active={i === built - 1 && built > 0}>
            <View style={[styles.cell, i < built && styles.done]}>
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{v}</Text>
            </View>
          </PulseOnActive>
        ))}
      </View>
      <Text style={styles.label}>dp[i] = LIS ending at i</Text>
      <View style={styles.row}>
        {dp.map((v, i) => (
          <Animated.View
            key={`d${i}`}
            entering={i === built - 1 && built > 0 ? vizEntering : undefined}
            layout={vizLayout}
          >
            <PulseOnActive active={i === built - 1 && built > 0}>
              <View
                style={[
                  styles.cell,
                  styles.dp,
                  i < built && styles.dpOn,
                  v === best && i < built && styles.dpBest,
                ]}
              >
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{i < built ? v : '·'}</Text>
              </View>
            </PulseOnActive>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
  meta: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  label: { color: colors.textDim, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: {
    minWidth: 36,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  done: { borderColor: colors.accent },
  dp: { borderColor: colors.radar },
  dpOn: { backgroundColor: colors.chipSelected },
  dpBest: { borderColor: colors.warning, borderWidth: 2 },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
