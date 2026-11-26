import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

export function BinarySearchViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const target = demo.target ?? demo.values[Math.floor(demo.values.length / 2)];
  const snapshot = useMemo(() => {
    let lo = 0;
    let hi = demo.values.length;
    const frames: { lo: number; hi: number; mid: number }[] = [];
    frames.push({ lo, hi, mid: -1 });
    let guard = 0;
    while (lo < hi && guard++ < 20) {
      const mid = lo + Math.floor((hi - lo) / 2);
      frames.push({ lo, hi, mid });
      if (demo.values[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    frames.push({ lo, hi, mid: lo < demo.values.length ? lo : -1 });
    return frames;
  }, [demo.values, target]);

  const frame = snapshot[Math.min(step, snapshot.length - 1)];

  return (
    <View style={styles.wrap}>
      <Text style={styles.target}>target = {target}</Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => {
          const inRange = i >= frame.lo && i < frame.hi;
          const isMid = i === frame.mid;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                inRange && styles.inRange,
                isMid && styles.mid,
              ]}
            >
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{v}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.meta}>
        lo={frame.lo} hi={frame.hi}
        {frame.mid >= 0 ? ` mid=${frame.mid}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, alignItems: 'center', width: '100%' },
  target: { color: colors.xp, fontFamily: 'SpaceMono', fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  cell: {
    width: 36,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  inRange: { borderColor: colors.radar },
  mid: { backgroundColor: colors.accent, borderColor: colors.accent },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontWeight: '800', fontFamily: 'SpaceMono' },
  meta: { color: colors.textMuted, fontSize: 12, fontFamily: 'SpaceMono' },
});
