import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { AnimatedSlot, PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  heap: number[];
  /** Index that just bubbled */
  hot: number;
};

function siftUp(h: number[], i: number): number {
  let cur = i;
  while (cur > 0) {
    const p = (cur - 1) >> 1;
    if (h[p]! <= h[cur]!) break;
    const t = h[p]!;
    h[p] = h[cur]!;
    h[cur] = t;
    cur = p;
  }
  return cur;
}

function siftDown(h: number[], i: number): number {
  let cur = i;
  const n = h.length;
  while (true) {
    let best = cur;
    const l = cur * 2 + 1;
    const r = cur * 2 + 2;
    if (l < n && h[l]! < h[best]!) best = l;
    if (r < n && h[r]! < h[best]!) best = r;
    if (best === cur) break;
    const t = h[cur]!;
    h[cur] = h[best]!;
    h[best] = t;
    cur = best;
  }
  return cur;
}

/** Push all values then pop until empty (min-heap). */
function buildFrames(values: number[]): Frame[] {
  const heap: number[] = [];
  const frames: Frame[] = [{ label: 'min-heap empty', heap: [], hot: -1 }];
  for (const v of values) {
    heap.push(v);
    const landed = siftUp(heap, heap.length - 1);
    frames.push({
      label: `push ${v} · sift-up → idx ${landed}`,
      heap: [...heap],
      hot: landed,
    });
  }
  while (heap.length) {
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      const landed = siftDown(heap, 0);
      frames.push({
        label: `pop ${top} · sift-down → idx ${landed}`,
        heap: [...heap],
        hot: landed,
      });
    } else {
      frames.push({ label: `pop ${top} · heap empty`, heap: [], hot: -1 });
    }
  }
  return frames;
}

export function heapFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo.values).length;
}

const CELL = 40;
const GAP = 8;

function heapPos(i: number): { x: number; y: number } {
  const depth = Math.floor(Math.log2(i + 1));
  const rowStart = (1 << depth) - 1;
  const posInRow = i - rowStart;
  const rowCount = 1 << depth;
  const rowW = rowCount * CELL + (rowCount - 1) * GAP;
  const x = (360 - rowW) / 2 + posInRow * (CELL + GAP);
  const y = 8 + depth * 52;
  return { x: Math.max(0, x), y };
}

export function HeapViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.values), [demo.values]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const depth = f.heap.length ? Math.floor(Math.log2(f.heap.length)) : 0;
  const canvasH = 8 + (depth + 1) * 52 + 8;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={[styles.canvas, { height: canvasH }]}>
        {f.heap.map((v, i) => {
          const { x, y } = heapPos(i);
          const hot = i === f.hot;
          return (
            <AnimatedSlot key={`${v}-${i}-${f.heap.length}`} x={x} y={y}>
              <PulseOnActive active={hot}>
                <View style={[styles.cell, i === 0 && styles.root, hot && styles.hot]}>
                  <Text style={styles.idx}>{i}</Text>
                  <Text style={styles.val}>{v}</Text>
                </View>
              </PulseOnActive>
            </AnimatedSlot>
          );
        })}
        {f.heap.length === 0 ? <Text style={styles.empty}>[ ]</Text> : null}
      </View>
      <Text style={styles.arr}>
        array: [{f.heap.join(', ') || ' '}]
      </Text>
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
  canvas: { width: 360, position: 'relative', alignSelf: 'center' },
  empty: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    marginTop: 24,
    textAlign: 'center',
  },
  cell: {
    width: CELL,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  root: { borderColor: colors.accent },
  hot: { borderColor: colors.warning, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  arr: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    alignSelf: 'flex-start',
  },
});
