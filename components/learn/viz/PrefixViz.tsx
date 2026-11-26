import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

export function PrefixViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const built = Math.min(step, demo.values.length);
  let sum = 0;
  const prefs: number[] = [0];
  for (let i = 0; i < built; i++) {
    sum += demo.values[i];
    prefs.push(sum);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>a[i]</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => (
          <View key={i} style={[styles.cell, i < built && styles.done]}>
            <Text style={styles.val}>{v}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>pref[i] = sum a[0..i)</Text>
      <View style={styles.row}>
        {prefs.map((v, i) => (
          <View key={i} style={[styles.cell, styles.pref]}>
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
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
  pref: { borderColor: colors.radar },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
