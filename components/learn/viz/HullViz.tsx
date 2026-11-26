import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PointsDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

const W = 280;
const H = 180;

type Pt = { x: number; y: number; label?: string };

function cross(a: Pt, b: Pt, c: Pt): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

export function hullFrameCount(demo: PointsDemo): number {
  return buildHullFrames(demo.points).length;
}

function buildHullFrames(raw: Pt[]): { hull: Pt[]; focus: number; label: string }[] {
  const pts = [...raw].sort((a, b) => a.x - b.x || a.y - b.y);
  const frames: { hull: Pt[]; focus: number; label: string }[] = [
    { hull: [], focus: -1, label: 'sorted by (x, y)' },
  ];
  const lo: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!;
    while (lo.length >= 2 && cross(lo[lo.length - 2]!, lo[lo.length - 1]!, p) <= 0) {
      lo.pop();
    }
    lo.push(p);
    frames.push({
      hull: [...lo],
      focus: i,
      label: `lower · add ${p.label ?? i}`,
    });
  }
  const hi: Pt[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]!;
    while (hi.length >= 2 && cross(hi[hi.length - 2]!, hi[hi.length - 1]!, p) <= 0) {
      hi.pop();
    }
    hi.push(p);
    frames.push({
      hull: [...lo.slice(0, -1), ...hi],
      focus: i,
      label: `upper · add ${p.label ?? i}`,
    });
  }
  const hull = [...lo.slice(0, -1), ...hi.slice(0, -1)];
  frames.push({ hull, focus: -1, label: `done · ${hull.length} hull vertices` });
  return frames;
}

export function HullViz({ demo, step }: { demo: PointsDemo; step: number }) {
  const frames = useMemo(() => buildHullFrames(demo.points), [demo.points]);
  const frame = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const sorted = useMemo(
    () => [...demo.points].sort((a, b) => a.x - b.x || a.y - b.y),
    [demo.points],
  );

  const hullSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of frame.hull) s.add(`${p.x},${p.y}`);
    return s;
  }, [frame.hull]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>Andrew monotone chain · {frame.label}</Text>
      <View style={styles.canvas}>
        {frame.hull.length >= 2
          ? frame.hull.slice(0, -1).map((p, i) => {
              const q = frame.hull[i + 1]!;
              const dx = q.x - p.x;
              const dy = q.y - p.y;
              const len = Math.hypot(dx, dy);
              return (
                <View
                  key={`e${i}`}
                  style={[
                    styles.edge,
                    {
                      left: p.x,
                      top: p.y,
                      width: len,
                      transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
                    },
                  ]}
                />
              );
            })
          : null}
        {sorted.map((p, i) => {
          const onHull = hullSet.has(`${p.x},${p.y}`);
          const focused = frame.focus === i;
          return (
            <View
              key={`${p.x},${p.y},${i}`}
              style={[
                styles.dot,
                { left: p.x - 9, top: p.y - 9 },
                onHull && styles.dotHull,
                focused && styles.dotFocus,
              ]}
            >
              <Text style={styles.dotLabel}>{p.label ?? String(i)}</Text>
            </View>
          );
        })}
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
    height: 2,
    backgroundColor: colors.accent,
    transformOrigin: 'left center',
  },
  dot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotHull: { backgroundColor: colors.accent },
  dotFocus: { borderWidth: 2, borderColor: colors.warning },
  dotLabel: {
    color: colors.background,
    fontSize: 9,
    fontWeight: '900',
  },
});
