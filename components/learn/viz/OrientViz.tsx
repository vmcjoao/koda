import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PointsDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { FitCanvas } from '@/components/learn/viz/FitCanvas';

const W = 280;
const H = 180;

export function orientFrameCount(_demo: PointsDemo): number {
  return 3;
}

function cross(
  o: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** Orientation / cross-product walkthrough for three labeled points. */
export function OrientViz({ demo, step }: { demo: PointsDemo; step: number }) {
  const pts = demo.points.slice(0, 3);
  const o = pts[0] ?? { x: 40, y: 140, label: 'A' };
  const a = pts[1] ?? { x: 140, y: 40, label: 'B' };
  const b = pts[2] ?? { x: 240, y: 120, label: 'C' };
  const v = useMemo(() => cross(o, a, b), [o, a, b]);
  const sign = v > 0 ? 1 : v < 0 ? -1 : 0;
  const turn =
    sign > 0 ? 'LEFT (CCW)' : sign < 0 ? 'RIGHT (CW)' : 'COLLINEAR';

  const phase = Math.min(Math.max(0, step), 2);
  const labels = [
    'Place A (origin), B, C',
    'Vectors AB and AC',
    `cross = ${v} → ${turn}`,
  ];

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{labels[phase]}</Text>
      <View style={styles.canvas}>
        {/* AB */}
        {phase >= 1 ? (
          <View
            style={[
              styles.edge,
              {
                left: o.x,
                top: o.y,
                width: Math.hypot(a.x - o.x, a.y - o.y),
                transform: [
                  {
                    rotate: `${Math.atan2(a.y - o.y, a.x - o.x)}rad`,
                  },
                ],
              },
            ]}
          />
        ) : null}
        {/* AC */}
        {phase >= 1 ? (
          <View
            style={[
              styles.edge,
              styles.edgeC,
              {
                left: o.x,
                top: o.y,
                width: Math.hypot(b.x - o.x, b.y - o.y),
                transform: [
                  {
                    rotate: `${Math.atan2(b.y - o.y, b.x - o.x)}rad`,
                  },
                ],
              },
            ]}
          />
        ) : null}
        {[o, a, b].map((p, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { left: p.x - 10, top: p.y - 10 },
              phase >= 2 && sign > 0 && i === 2 && styles.dotLeft,
              phase >= 2 && sign < 0 && i === 2 && styles.dotRight,
            ]}
          >
            <Text style={styles.dotLabel}>{p.label ?? ['A', 'B', 'C'][i]}</Text>
          </View>
        ))}
      </View>
      {phase >= 2 ? (
        <Text style={styles.result}>
          (B−A)×(C−A) = {v} → C is {turn.toLowerCase()} of directed AB
        </Text>
      ) : null}
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
  canvas: {
    width: W,
    height: H,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  edge: {
    position: 'absolute',
    height: 3,
    backgroundColor: colors.radar,
    transformOrigin: 'left center',
  },
  edgeC: { backgroundColor: colors.warning },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotLeft: { backgroundColor: colors.accent },
  dotRight: { backgroundColor: colors.danger },
  dotLabel: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '900',
  },
  result: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
});
