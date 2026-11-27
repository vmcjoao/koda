import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StringDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

const BASE = 131;
const MOD = 1e9 + 7;

type Frame = {
  label: string;
  i: number;
  pref: number[];
  pw: number[];
};

function buildFrames(text: string): Frame[] {
  const s = text.slice(0, 12);
  const pref = [0];
  const pw = [1];
  const frames: Frame[] = [
    { label: `s="${s}" · pref[0]=0 pw[0]=1`, i: -1, pref: [0], pw: [1] },
  ];
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    pref.push((pref[i]! * BASE + code) % MOD);
    pw.push((pw[i]! * BASE) % MOD);
    frames.push({
      label: `pref[${i + 1}] = (pref[${i}]*${BASE} + '${s[i]}') % MOD`,
      i,
      pref: [...pref],
      pw: [...pw],
    });
  }
  if (s.length >= 4) {
    const l = 0;
    const r = 2;
    const h =
      (pref[r + 1]! - ((pref[l]! * pw[r - l + 1]!) % MOD) + MOD) % MOD;
    frames.push({
      label: `hash[${l}..${r}] = ${h}`,
      i: r,
      pref: [...pref],
      pw: [...pw],
    });
  }
  return frames;
}

export function stringHashFrameCount(demo: StringDemo): number {
  return buildFrames(demo.text).length;
}

export function StringHashViz({ demo, step }: { demo: StringDemo; step: number }) {
  const s = demo.text.slice(0, 12);
  const frames = useMemo(() => buildFrames(s), [s]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.label}>s[i]</Text>
      <View style={styles.row}>
        {s.split('').map((ch, i) => (
          <PulseOnActive key={i} active={i === f.i}>
            <View style={[styles.cell, i === f.i && styles.hot]}>
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{ch}</Text>
            </View>
          </PulseOnActive>
        ))}
      </View>
      <Text style={styles.label}>pref[i]</Text>
      <View style={styles.row}>
        {f.pref.map((v, i) => (
          <View key={i} style={[styles.cell, styles.pref, i === f.i + 1 && styles.hot]}>
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.small}>{v}</Text>
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
    fontSize: 11,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  label: { color: colors.textDim, fontSize: 12, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: {
    minWidth: 28,
    paddingVertical: 6,
    paddingHorizontal: 3,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  pref: { borderColor: colors.radar },
  hot: { borderColor: colors.warning, borderWidth: 2 },
  idx: { color: colors.textDim, fontSize: 8 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  small: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700', fontSize: 9 },
});
