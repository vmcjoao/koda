import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

export function PrefixViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const built = Math.min(Math.max(0, step), demo.values.length);
  let sum = 0;
  const prefs: number[] = [0];
  for (let i = 0; i < built; i++) {
    sum += demo.values[i]!;
    prefs.push(sum);
  }
  const adding = built > 0 ? demo.values[built - 1]! : null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {built === 0
          ? 'pref[0]=0 · start'
          : `add a[${built - 1}]=${adding} · pref[${built}]=${sum}`}
      </Text>
      <Text style={styles.label}>a[i]</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              i < built && styles.done,
              i === built - 1 && styles.active,
            ]}
          >
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{v}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>pref[i] = sum a[0..i)</Text>
      <View style={styles.row}>
        {prefs.map((v, i) => (
          <View
            key={i}
            style={[styles.cell, styles.pref, i === built && built > 0 && styles.prefNew]}
          >
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
  meta: {
    color: colors.xp,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '700',
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
  active: { borderColor: colors.warning, borderWidth: 2 },
  pref: { borderColor: colors.radar },
  prefNew: { backgroundColor: colors.chipSelected, borderColor: colors.accent },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
