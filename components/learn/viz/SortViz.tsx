import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

/** Selection-sort frames: initial + one after each prefix slot is fixed. */
export function sortFrameCount(demo: ArrayDemo): number {
  return demo.values.length + 1;
}

export function SortViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => {
    const a = [...demo.values];
    const out: { arr: number[]; pivot: number; scan: number }[] = [
      { arr: [...a], pivot: -1, scan: -1 },
    ];
    for (let i = 0; i < a.length; i++) {
      let best = i;
      for (let j = i + 1; j < a.length; j++) {
        if (a[j]! < a[best]!) best = j;
      }
      if (best !== i) {
        const t = a[i]!;
        a[i] = a[best]!;
        a[best] = t;
      }
      out.push({ arr: [...a], pivot: i, scan: best });
    }
    return out;
  }, [demo.values]);

  const frame = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const fixed = frame.pivot;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        Selection sort · {fixed < 0 ? 'start' : `fixed prefix 0…${fixed}`}
      </Text>
      <View style={styles.row}>
        {frame.arr.map((v, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              fixed >= 0 && i <= fixed && styles.done,
              i === frame.scan && frame.scan !== frame.pivot && styles.scan,
              i === frame.pivot && styles.pivot,
            ]}
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
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
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
  done: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  pivot: { borderColor: colors.warning, borderWidth: 2 },
  scan: { borderColor: colors.radar },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
