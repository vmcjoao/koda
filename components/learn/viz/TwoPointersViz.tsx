import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive, VIZ_MOVE_MS } from '@/components/learn/viz/AnimatedSlot';

const CELL = 40;
const GAP = 6;
const EASE = Easing.out(Easing.cubic);

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
  const n = demo.values.length;
  const rowW = n * CELL + Math.max(0, n - 1) * GAP;

  const winL = f.r >= 0 ? f.l * (CELL + GAP) : 0;
  const winW =
    f.r >= 0
      ? Math.max(0, f.r - f.l + 1) * (CELL + GAP) - GAP
      : 0;
  const lX = f.r >= 0 ? f.l * (CELL + GAP) + CELL / 2 : 0;
  const rX = f.r >= 0 ? f.r * (CELL + GAP) + CELL / 2 : 0;

  const bandL = useSharedValue(winL);
  const bandW = useSharedValue(Math.max(winW, 0));
  const ptrL = useSharedValue(lX);
  const ptrR = useSharedValue(rX);

  useEffect(() => {
    bandL.value = withTiming(winL, { duration: VIZ_MOVE_MS, easing: EASE });
    bandW.value = withTiming(Math.max(winW, 0), { duration: VIZ_MOVE_MS, easing: EASE });
    ptrL.value = withTiming(lX, { duration: VIZ_MOVE_MS, easing: EASE });
    ptrR.value = withTiming(rX, { duration: VIZ_MOVE_MS, easing: EASE });
  }, [winL, winW, lX, rX, bandL, bandW, ptrL, ptrR]);

  const bandStyle = useAnimatedStyle(() => ({
    left: bandL.value,
    width: Math.max(bandW.value, 0),
    opacity: bandW.value > 0 ? 1 : 0,
  }));
  const lStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ptrL.value - 10 }],
    opacity: f.r >= 0 ? 1 : 0,
  }));
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ptrR.value - 10 }],
    opacity: f.r >= 0 ? 1 : 0,
  }));

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        budget {budget} · sum {f.sum} · best {f.best}
      </Text>
      <View style={[styles.canvas, { width: rowW }]}>
        <Animated.View style={[styles.winBand, bandStyle]} />
        {demo.values.map((v, i) => {
          const inWin = f.r >= 0 && i >= f.l && i <= f.r;
          const isL = i === f.l && f.r >= 0;
          const isR = i === f.r && f.r >= 0;
          return (
            <PulseOnActive
              key={i}
              active={isR}
              style={[styles.cellAbs, { left: i * (CELL + GAP) }]}
            >
              <View
                style={[
                  styles.cell,
                  inWin && styles.inWin,
                  isL && styles.ptrL,
                  isR && styles.ptrR,
                ]}
              >
                <Text style={styles.idx}>{i}</Text>
                <Text style={styles.val}>{v}</Text>
              </View>
            </PulseOnActive>
          );
        })}
        <Animated.View style={[styles.tagFloat, lStyle]}>
          <Text style={[styles.tag, { color: colors.accent }]}>L</Text>
        </Animated.View>
        <Animated.View style={[styles.tagFloat, rStyle]}>
          <Text style={[styles.tag, { color: colors.warning }]}>R</Text>
        </Animated.View>
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
  canvas: { position: 'relative', height: 72, alignSelf: 'center' },
  winBand: {
    position: 'absolute',
    top: 14,
    bottom: 18,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(61, 220, 151, 0.14)',
  },
  cellAbs: { position: 'absolute', top: 16 },
  cell: {
    width: CELL,
    minWidth: CELL,
    paddingVertical: 8,
    paddingHorizontal: 4,
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
  tagFloat: { position: 'absolute', top: 0, width: 20, alignItems: 'center' },
  tag: { fontSize: 11, fontWeight: '900' },
});
