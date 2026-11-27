import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { vizEntering, vizLayout } from '@/components/learn/viz/AnimatedSlot';

function buildLevels(values: number[]): number[][] {
  const n = values.length;
  const size = 1 << Math.ceil(Math.log2(Math.max(1, n)));
  const leaves = Array(size).fill(0);
  for (let i = 0; i < n; i++) leaves[i] = values[i]!;
  const tree: number[][] = [leaves];
  let cur = leaves;
  while (cur.length > 1) {
    const next: number[] = [];
    for (let i = 0; i < cur.length; i += 2) {
      next.push((cur[i] ?? 0) + (cur[i + 1] ?? 0));
    }
    tree.push(next);
    cur = next;
  }
  return tree;
}

/** Step 0 = leaves; each further step reveals one parent level. */
export function segtreeFrameCount(demo: ArrayDemo): number {
  return buildLevels(demo.values).length;
}

export function SegtreeViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const n = demo.values.length;
  const levels = useMemo(() => buildLevels(demo.values), [demo.values]);
  const reveal = Math.min(Math.max(0, step), levels.length - 1);
  const root = levels[levels.length - 1]?.[0] ?? 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        sum segment tree · showing up to level {reveal}
        {reveal === levels.length - 1 ? ` · root=${root}` : ''}
      </Text>
      {[...levels].reverse().map((level, revIdx) => {
        const depthFromLeaf = levels.length - 1 - revIdx;
        if (depthFromLeaf > reveal) return null;
        return (
          <Animated.View
            key={depthFromLeaf}
            entering={depthFromLeaf === reveal && reveal > 0 ? vizEntering : undefined}
            layout={vizLayout}
            style={styles.level}
          >
            <Text style={styles.levelTag}>
              {depthFromLeaf === 0 ? 'leaves' : `combine ↑${depthFromLeaf}`}
            </Text>
            <View style={styles.row}>
              {level.map((v, i) => (
                <View
                  key={i}
                  style={[
                    styles.cell,
                    depthFromLeaf === 0 && i < n && styles.leaf,
                    depthFromLeaf === 0 && i >= n && styles.pad,
                    depthFromLeaf > 0 && styles.inner,
                  ]}
                >
                  <Text style={styles.val}>{v}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        );
      })}
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
  level: { width: '100%', gap: 4 },
  levelTag: { color: colors.textDim, fontSize: 10, fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
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
  leaf: { borderColor: colors.radar },
  pad: { opacity: 0.35 },
  inner: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700', fontSize: 12 },
});
