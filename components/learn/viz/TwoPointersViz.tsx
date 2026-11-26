import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

/** Sliding-window frames for non-negative sum ≤ target (target defaults to a sensible budget). */
export function twoPointersFrameCount(demo: ArrayDemo): number {
  const budget = demo.target ?? Math.max(5, Math.floor(demo.values.reduce((s, v) => s + v, 0) / 2));
  let frames = 1;
  let l = 0;
  let sum = 0;
  for (let r = 0; r < demo.values.length; r++) {
    sum += demo.values[r]!;
    frames += 1;
    while (sum > budget && l <= r) {
      sum -= demo.values[l]!;
      l += 1;
      frames += 1;
    }
  }
  return Math.max(1, frames);
}

type Frame = { l: number; r: number; sum: number; best: number };

function buildFrames(demo: ArrayDemo): Frame[] {
  const budget = demo.target ?? Math.max(5, Math.floor(demo.values.reduce((s, v) => s + v, 0) / 2));
  const frames: Frame[] = [{ l: 0, r: -1, sum: 0, best: 0 }];
  let l = 0;
  let sum = 0;
  let best = 0;
  for (let r = 0; r < demo.values.length; r++) {
    sum += demo.values[r]!;
    frames.push({ l, r, sum, best });
    while (sum > budget && l <= r) {
      sum -= demo.values[l]!;
      l += 1;
      frames.push({ l, r, sum, best });
    }
    best = Math.max(best, r - l + 1);
    frames[frames.length - 1] = { l, r, sum, best };
  }
  return frames;
}

export function TwoPointersViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo), [demo]);
  const budget = demo.target ?? Math.max(5, Math.floor(demo.values.reduce((s, v) => s + v, 0) / 2));
  const f = frames[Math.min(step, frames.length - 1)]!;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        budget {budget} · sum {f.sum} · best {f.best}
      </Text>
      <View style={styles.row}>
        {demo.values.map((v, i) => {
          const inWin = f.r >= 0 && i >= f.l && i <= f.r;
          const isL = i === f.l && f.r >= 0;
          const isR = i === f.r && f.r >= 0;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                inWin && styles.inWin,
                isL && styles.ptrL,
                isR && styles.ptrR,
              ]}
            >
              <Text style={styles.idx}>{i}</Text>
              <Text style={styles.val}>{v}</Text>
              {isL ? <Text style={styles.tag}>L</Text> : null}
              {isR && !isL ? <Text style={styles.tag}>R</Text> : null}
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: {
    minWidth: 40,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  inWin: { backgroundColor: colors.chipSelected },
  ptrL: { borderColor: colors.accent },
  ptrR: { borderColor: colors.warning },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
  tag: {
    color: colors.radar,
    fontSize: 10,
    fontWeight: '900',
  },
});
