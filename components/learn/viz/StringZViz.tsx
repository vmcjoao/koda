import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StringDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

function buildZ(s: string): number[] {
  const n = s.length;
  const z = Array(n).fill(0);
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]!);
    while (i + z[i]! < n && s[z[i]!] === s[i + z[i]!]) z[i]!++;
    if (i + z[i]! > r) {
      l = i;
      r = i + z[i]!;
    }
  }
  return z;
}

/** Frames: start + one per index i≥1 after computing z[i]. */
export function stringZFrameCount(demo: StringDemo): number {
  return Math.max(1, demo.text.length);
}

export function StringZViz({ demo, step }: { demo: StringDemo; step: number }) {
  const s = demo.text.slice(0, 16);
  const zFull = useMemo(() => buildZ(s), [s]);
  const built = Math.min(Math.max(0, step), Math.max(0, s.length - 1));
  // step 0: only z[0] shown as n conceptually; we reveal z[1..built]
  const revealed = built;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        {revealed === 0
          ? `s = "${s}" · z[0] unused / whole string`
          : `computed z[1…${revealed}] · last z[${revealed}]=${zFull[revealed]}`}
      </Text>
      <Text style={styles.label}>s[i]</Text>
      <View style={styles.row}>
        {s.split('').map((ch, i) => (
          <View
            key={`c${i}`}
            style={[styles.cell, i > 0 && i <= revealed && styles.done]}
          >
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{ch}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>z[i] = LCP with prefix</Text>
      <View style={styles.row}>
        {zFull.map((v, i) => (
          <View
            key={`z${i}`}
            style={[
              styles.cell,
              styles.z,
              i === 0 && styles.z0,
              i > 0 && i <= revealed && styles.zOn,
              i === revealed && revealed > 0 && styles.active,
            ]}
          >
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{i === 0 ? '·' : i <= revealed ? v : '·'}</Text>
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: {
    minWidth: 28,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  done: { borderColor: colors.radar },
  z: { borderColor: colors.border },
  z0: { opacity: 0.5 },
  zOn: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  active: { borderColor: colors.warning, borderWidth: 2 },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
