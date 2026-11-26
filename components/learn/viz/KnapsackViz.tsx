import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { KnapsackDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

/** Step 0 = empty; step k = after processing first k items. */
export function knapsackFrameCount(demo: KnapsackDemo): number {
  return demo.weights.length;
}

export function KnapsackViz({ demo, step }: { demo: KnapsackDemo; step: number }) {
  const { weights, values, capacity: W } = demo;
  const itemsDone = Math.min(Math.max(0, step), weights.length);

  const dp = useMemo(() => {
    const row = Array(W + 1).fill(0);
    for (let i = 0; i < itemsDone; i++) {
      for (let cap = W; cap >= weights[i]; cap--) {
        row[cap] = Math.max(row[cap], row[cap - weights[i]] + values[i]);
      }
    }
    return row;
  }, [W, itemsDone, values, weights]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {itemsDone === 0
          ? `empty dp · capacity ${W}`
          : `after item ${itemsDone - 1} (w=${weights[itemsDone - 1]}, v=${values[itemsDone - 1]})`}
      </Text>
      <View style={styles.items}>
        {weights.map((w, i) => (
          <View
            key={i}
            style={[
              styles.item,
              i < itemsDone && styles.itemDone,
              i === itemsDone - 1 && styles.itemOn,
            ]}
          >
            <Text style={styles.itemText}>
              #{i} w{w}/v{values[i]}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>dp[cap] → best value</Text>
      <View style={styles.row}>
        {dp.map((v, cap) => (
          <View key={cap} style={[styles.cell, v > 0 && styles.cellFilled]}>
            <Text style={styles.idx}>{cap}</Text>
            <Text style={styles.val}>{v}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.answer}>answer dp[{W}] = {dp[W]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
  meta: { color: colors.xp, fontFamily: 'SpaceMono', fontSize: 12, fontWeight: '700' },
  items: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  itemDone: { borderColor: colors.radar },
  itemOn: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  itemText: { color: colors.text, fontSize: 11, fontFamily: 'SpaceMono' },
  label: { color: colors.textDim, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: {
    minWidth: 32,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  cellFilled: { borderColor: colors.radar },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700', fontSize: 12 },
  answer: { color: colors.accent, fontFamily: 'SpaceMono', fontSize: 12, fontWeight: '700' },
});
