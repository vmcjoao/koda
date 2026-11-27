import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { AnimatedSlot } from '@/components/learn/viz/AnimatedSlot';
import {
  buildSortFrames,
  sortFrameCount as countFrames,
  type SortFrame,
} from '@/lib/learnSortFrames';

export function sortFrameCount(demo: ArrayDemo, lessonId?: string): number {
  return countFrames(demo, lessonId);
}

const CELL_W = 40;
const CELL_H = 52;
const GAP = 6;
const ROW_GAP = 58;
const PAD_X = 8;

function slotPos(
  index: number,
  n: number,
  frame: SortFrame,
): { x: number; y: number } {
  const baseX = PAD_X;
  const x = baseX + index * (CELL_W + GAP);

  if (frame.layout === 'row' || !frame.bands?.length) {
    return { x, y: 8 };
  }

  const band = frame.bands.find((b) => index >= b.lo && index < b.hi);
  if (!band) return { x, y: 8 };

  const depthY = 8 + band.depth * ROW_GAP;
  if (frame.layout === 'split' && band.role === 'active') {
    // Pull left/right halves apart so divide is visible.
    const bandMid = (band.lo + band.hi - 1) / 2;
    const arrayMid = (n - 1) / 2;
    const pull = Math.sign(bandMid - arrayMid || -1) * 14;
    return { x: x + pull, y: depthY };
  }
  if (frame.layout === 'merge') {
    return { x, y: depthY };
  }
  return { x, y: depthY };
}

export function SortViz({
  demo,
  step,
  lessonId,
}: {
  demo: ArrayDemo;
  step: number;
  lessonId?: string;
}) {
  const frames = useMemo(() => buildSortFrames(demo, lessonId), [demo, lessonId]);
  const frame = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const n = frame.order.length;
  const canvasW = Math.max(n * CELL_W + (n - 1) * GAP + PAD_X * 2, 200);
  const maxDepth = frame.bands?.reduce((m, b) => Math.max(m, b.depth), 0) ?? 0;
  const canvasH = 8 + CELL_H + maxDepth * ROW_GAP + 12;

  const idToItem = useMemo(() => {
    const m = new Map(frame.items.map((it) => [it.id, it]));
    return m;
  }, [frame.items]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{frame.label}</Text>
      <View style={[styles.canvas, { width: canvasW, height: canvasH }]}>
        {frame.order.map((id, index) => {
          const item = idToItem.get(id)!;
          const { x, y } = slotPos(index, n, frame);
          const h = frame.highlight;
          const inRange =
            h?.lo != null && h?.hi != null && index >= h.lo && index < h.hi;
          const isA = h?.a === index;
          const isB = h?.b === index;
          const isPivot = h?.pivot === index;
          return (
            <AnimatedSlot key={id} x={x} y={y}>
              <View
                style={[
                  styles.cell,
                  inRange && styles.done,
                  isA && styles.scan,
                  isB && styles.scan,
                  isPivot && styles.pivot,
                ]}
              >
                <Text style={styles.idx}>{index}</Text>
                <Text style={styles.val}>{item.value}</Text>
              </View>
            </AnimatedSlot>
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
    position: 'relative',
    alignSelf: 'center',
  },
  cell: {
    width: CELL_W,
    minHeight: CELL_H - 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  done: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  pivot: { borderColor: colors.warning, borderWidth: 2 },
  scan: { borderColor: colors.radar, borderWidth: 2 },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700' },
});
