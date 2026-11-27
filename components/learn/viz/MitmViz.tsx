import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';

type Frame = {
  label: string;
  phase: 'split' | 'left' | 'right' | 'meet';
  leftSums: number[];
  rightSums: number[];
  hit?: number;
};

function subsets(a: number[]): number[] {
  const out: number[] = [];
  const n = a.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s += a[i]!;
    out.push(s);
  }
  return out.sort((x, y) => x - y);
}

function buildFrames(demo: ArrayDemo): Frame[] {
  const a = demo.values.slice(0, 6);
  const target = demo.target ?? a.reduce((s, v) => s + v, 0) >> 1;
  const mid = Math.floor(a.length / 2);
  const left = a.slice(0, mid);
  const right = a.slice(mid);
  const frames: Frame[] = [
    {
      label: `split n=${a.length} · target=${target}`,
      phase: 'split',
      leftSums: [],
      rightSums: [],
    },
  ];
  const L = subsets(left);
  frames.push({
    label: `enumerate left (${left.length} items) → ${L.length} sums`,
    phase: 'left',
    leftSums: L,
    rightSums: [],
  });
  const R = subsets(right);
  frames.push({
    label: `enumerate right → ${R.length} sums`,
    phase: 'right',
    leftSums: L,
    rightSums: R,
  });

  let hit: number | undefined;
  const Rset = new Set(R);
  for (const s of L) {
    if (Rset.has(target - s)) {
      hit = s;
      break;
    }
  }
  frames.push({
    label:
      hit == null
        ? `no pair sums to ${target}`
        : `meet · left ${hit} + right ${target - hit} = ${target}`,
    phase: 'meet',
    leftSums: L,
    rightSums: R,
    hit,
  });
  return frames;
}

export function mitmFrameCount(demo: ArrayDemo): number {
  return buildFrames(demo).length;
}

export function MitmViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo), [demo]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const a = demo.values.slice(0, 6);
  const mid = Math.floor(a.length / 2);
  const target = demo.target ?? a.reduce((s, v) => s + v, 0) >> 1;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <View style={styles.row}>
        {a.map((v, i) => (
          <View
            key={i}
            style={[styles.cell, i < mid ? styles.left : styles.right]}
          >
            <Text style={styles.idx}>{i}</Text>
            <Text style={styles.val}>{v}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>left sums</Text>
      <View style={styles.row}>
        {f.leftSums.slice(0, 12).map((s, i) => (
          <PulseOnActive key={`L${i}`} active={f.hit === s}>
            <View style={[styles.sum, f.hit === s && styles.hit]}>
              <Text style={styles.val}>{s}</Text>
            </View>
          </PulseOnActive>
        ))}
      </View>
      <Text style={styles.label}>right sums · target={target}</Text>
      <View style={styles.row}>
        {f.rightSums.slice(0, 12).map((s, i) => (
          <PulseOnActive
            key={`R${i}`}
            active={f.hit != null && s === target - f.hit}
          >
            <View
              style={[
                styles.sum,
                f.hit != null && s === target - f.hit && styles.hit,
              ]}
            >
              <Text style={styles.val}>{s}</Text>
            </View>
          </PulseOnActive>
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
  label: { color: colors.textDim, fontSize: 11, fontWeight: '700', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: {
    minWidth: 32,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 2,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  left: { borderColor: colors.accent },
  right: { borderColor: colors.radar },
  sum: {
    minWidth: 28,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  hit: { borderColor: colors.warning, borderWidth: 2, backgroundColor: colors.chipSelected },
  idx: { color: colors.textDim, fontSize: 9 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800', fontSize: 12 },
});
