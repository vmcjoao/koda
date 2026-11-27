import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { GraphDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';
import {
  buildFloydFrames,
  floydFrameCount as countFrames,
  FLOYD_INF,
} from '@/lib/learnFloyd';

export function floydFrameCount(demo: GraphDemo): number {
  return countFrames(demo);
}

function fmt(v: number): string {
  return v >= FLOYD_INF / 2 ? '∞' : String(v);
}

export function FloydViz({ demo, step }: { demo: GraphDemo; step: number }) {
  const frames = useMemo(() => buildFloydFrames(demo), [demo]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const n = demo.nodes.length;

  function isHot(i: number, j: number) {
    return f.hot.some(([a, b]) => a === i && b === j);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.matrix}>
        <View style={styles.row}>
          <View style={styles.corner} />
          {Array.from({ length: n }, (_, j) => (
            <Text key={`h${j}`} style={styles.hdr}>
              {j}
            </Text>
          ))}
        </View>
        {f.d.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.hdr}>{i}</Text>
            {row.map((v, j) => {
              const hot = isHot(i, j);
              const viaK = f.k >= 0 && f.k < n && (i === f.k || j === f.k);
              return (
                <PulseOnActive key={j} active={hot}>
                  <View
                    style={[
                      styles.cell,
                      i === j && styles.diag,
                      viaK && styles.via,
                      hot && styles.hot,
                    ]}
                  >
                    <Text style={styles.val}>{fmt(v)}</Text>
                  </View>
                </PulseOnActive>
              );
            })}
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
  matrix: { gap: 3, alignSelf: 'center' },
  row: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  corner: { width: 18 },
  hdr: {
    width: 36,
    textAlign: 'center',
    color: colors.textDim,
    fontSize: 10,
    fontFamily: 'SpaceMono',
  },
  cell: {
    width: 36,
    height: 32,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diag: { opacity: 0.7 },
  via: { borderColor: colors.radar },
  hot: { borderColor: colors.warning, borderWidth: 2, backgroundColor: colors.chipSelected },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700', fontSize: 11 },
});
