import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive, VIZ_MOVE_MS } from '@/components/learn/viz/AnimatedSlot';
import { FitCanvas } from '@/components/learn/viz/FitCanvas';

const CELL = 36;
const GAP = 6;
const ROW_H = 64;
const EASE = Easing.out(Easing.cubic);

export function BinarySearchViz({
  demo,
  step,
  onTargetChange,
}: {
  demo: ArrayDemo;
  step: number;
  /** When set, show an editable target field (Replay interactivity). */
  onTargetChange?: (target: number) => void;
}) {
  const target =
    demo.target ?? demo.values[Math.floor(demo.values.length / 2)] ?? 0;
  /** Local typing buffer; null means mirror `target` from the demo. */
  const [draft, setDraft] = useState<string | null>(null);
  const [syncedTarget, setSyncedTarget] = useState(target);
  if (syncedTarget !== target) {
    setSyncedTarget(target);
    setDraft(null);
  }
  const draftText = draft ?? String(target);
  const snapshot = useMemo(() => {
    let lo = 0;
    let hi = demo.values.length;
    const frames: { lo: number; hi: number; mid: number }[] = [];
    frames.push({ lo, hi, mid: -1 });
    let guard = 0;
    while (lo < hi && guard++ < 20) {
      const mid = lo + Math.floor((hi - lo) / 2);
      frames.push({ lo, hi, mid });
      if (demo.values[mid]! < target) lo = mid + 1;
      else hi = mid;
    }
    frames.push({ lo, hi, mid: lo < demo.values.length ? lo : -1 });
    return frames;
  }, [demo.values, target]);

  const frame = snapshot[Math.min(step, snapshot.length - 1)]!;
  const midVal = frame.mid >= 0 ? demo.values[frame.mid] : undefined;
  let action = 'start · half-open [lo, hi)';
  if (frame.mid < 0 && step === 0) action = 'start · half-open [lo, hi)';
  else if (frame.mid < 0 || (frame.lo >= frame.hi && step > 0)) {
    action =
      frame.lo < demo.values.length && demo.values[frame.lo] === target
        ? `found at lo=${frame.lo}`
        : `done · insert/bound at lo=${frame.lo}`;
  } else if (midVal != null && midVal < target) {
    action = `a[mid]=${midVal} < ${target} → lo = mid+1`;
  } else if (midVal != null) {
    action = `a[mid]=${midVal} ≥ ${target} → hi = mid`;
  }

  const n = demo.values.length;
  const rowW = n * CELL + Math.max(0, n - 1) * GAP;
  const rangeLeft = frame.lo * (CELL + GAP);
  const rangeW = Math.max(0, frame.hi - frame.lo) * (CELL + GAP) - (frame.hi > frame.lo ? GAP : 0);
  const midX =
    frame.mid >= 0 ? frame.mid * (CELL + GAP) + CELL / 2 : rangeLeft + rangeW / 2;

  const left = useSharedValue(rangeLeft);
  const width = useSharedValue(Math.max(rangeW, 0));
  const midTx = useSharedValue(midX);

  useEffect(() => {
    left.value = withTiming(rangeLeft, { duration: VIZ_MOVE_MS, easing: EASE });
    width.value = withTiming(Math.max(rangeW, 2), { duration: VIZ_MOVE_MS, easing: EASE });
    midTx.value = withTiming(midX, { duration: VIZ_MOVE_MS, easing: EASE });
  }, [rangeLeft, rangeW, midX, left, width, midTx]);

  const rangeStyle = useAnimatedStyle(() => ({
    left: left.value,
    width: width.value,
  }));
  const midStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: midTx.value - 10 }],
  }));

  function commitTarget(raw: string) {
    setDraft(raw);
    if (!onTargetChange) return;
    const trimmed = raw.trim();
    if (trimmed === '' || trimmed === '-') return;
    const nTarget = Number(trimmed);
    if (!Number.isFinite(nTarget)) return;
    onTargetChange(Math.trunc(nTarget));
  }

  return (
    <View style={styles.wrap}>
      {onTargetChange ? (
        <View style={styles.targetRow}>
          <Text style={styles.targetLabel}>target</Text>
          <TextInput
            value={draftText}
            onChangeText={commitTarget}
            keyboardType="numbers-and-punctuation"
            selectTextOnFocus
            placeholder="n"
            placeholderTextColor={colors.textDim}
            style={styles.targetInput}
          />
        </View>
      ) : (
        <Text style={styles.target}>target = {target}</Text>
      )}
      <Text style={styles.action}>{action}</Text>
      <FitCanvas logicalWidth={Math.max(rowW, 1)} logicalHeight={ROW_H}>
        <View style={[styles.canvas, { width: rowW }]}>
          <Animated.View style={[styles.rangeBand, rangeStyle]} />
          {demo.values.map((v, i) => {
            const inRange = i >= frame.lo && i < frame.hi;
            const isMid = i === frame.mid;
            return (
              <PulseOnActive
                key={i}
                active={isMid}
                style={[styles.cellAbs, { left: i * (CELL + GAP) }]}
              >
                <View style={[styles.cell, inRange && styles.inRange, isMid && styles.mid]}>
                  <Text style={[styles.idx, isMid && styles.onMid]}>{i}</Text>
                  <Text style={[styles.val, isMid && styles.onMid]}>{v}</Text>
                </View>
              </PulseOnActive>
            );
          })}
          {frame.mid >= 0 ? (
            <Animated.View style={[styles.midTick, midStyle]}>
              <Text style={styles.midTickText}>▼</Text>
            </Animated.View>
          ) : null}
        </View>
      </FitCanvas>
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
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'stretch',
  },
  targetLabel: {
    color: colors.xp,
    fontFamily: 'SpaceMono',
    fontWeight: '700',
    fontSize: 13,
  },
  targetInput: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontWeight: '700',
    backgroundColor: colors.surfaceElevated,
  },
  action: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  canvas: {
    position: 'relative',
    height: 64,
    alignSelf: 'center',
  },
  rangeBand: {
    position: 'absolute',
    top: 4,
    bottom: 14,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(91, 140, 255, 0.18)',
    borderWidth: 1,
    borderColor: colors.radar,
  },
  cellAbs: { position: 'absolute', top: 8 },
  cell: {
    width: CELL,
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
  onMid: { color: colors.background },
  midTick: { position: 'absolute', top: -2, width: 20, alignItems: 'center' },
  midTickText: { color: colors.accent, fontSize: 10, fontWeight: '900' },
  meta: { color: colors.textMuted, fontSize: 12, fontFamily: 'SpaceMono' },
});
