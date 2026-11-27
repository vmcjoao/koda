import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StringDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { PulseOnActive } from '@/components/learn/viz/AnimatedSlot';
import { FitCanvas } from '@/components/learn/viz/FitCanvas';

type Node = { id: number; label: string; end: boolean; depth: number; parent: number };

type Frame = {
  label: string;
  nodes: Node[];
  edges: { from: number; to: number; ch: string }[];
  hot: number[];
};

function parseWords(text: string): string[] {
  return text
    .split(/[\s|,]+/)
    .map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))
    .filter(Boolean)
    .slice(0, 5);
}

function buildFrames(text: string): Frame[] {
  const words = parseWords(text);
  const nodes: Node[] = [{ id: 0, label: 'ε', end: false, depth: 0, parent: -1 }];
  const edges: { from: number; to: number; ch: string }[] = [];
  const child = new Map<string, number>(); // `${u}|${ch}` → v
  const frames: Frame[] = [
    { label: 'empty trie · root ε', nodes: [...nodes], edges: [], hot: [0] },
  ];

  for (const w of words) {
    let u = 0;
    const path = [0];
    for (const ch of w) {
      const key = `${u}|${ch}`;
      let v = child.get(key);
      if (v == null) {
        v = nodes.length;
        child.set(key, v);
        nodes.push({ id: v, label: ch, end: false, depth: nodes[u]!.depth + 1, parent: u });
        edges.push({ from: u, to: v, ch });
      }
      u = v;
      path.push(u);
      frames.push({
        label: `insert "${w}" · edge '${ch}' → node ${u}`,
        nodes: nodes.map((n) => ({ ...n })),
        edges: edges.map((e) => ({ ...e })),
        hot: [...path],
      });
    }
    nodes[u]!.end = true;
    frames.push({
      label: `mark end of "${w}" at node ${u}`,
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      hot: [u],
    });
  }
  frames.push({
    label: `done · ${words.length} words`,
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    hot: nodes.filter((n) => n.end).map((n) => n.id),
  });
  return frames;
}

export function trieFrameCount(demo: StringDemo): number {
  return buildFrames(demo.text).length;
}

const CELL = 34;
const GAP_X = 8;
const ROW_H = 48;

export function TrieViz({ demo, step }: { demo: StringDemo; step: number }) {
  const frames = useMemo(() => buildFrames(demo.text), [demo.text]);
  const f = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const maxDepth = f.nodes.reduce((m, n) => Math.max(m, n.depth), 0);

  // Layout: group by depth
  const byDepth: Node[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const n of f.nodes) byDepth[n.depth]!.push(n);

  const pos = new Map<number, { x: number; y: number }>();
  for (let d = 0; d <= maxDepth; d++) {
    const row = byDepth[d]!;
    const rowW = row.length * CELL + Math.max(0, row.length - 1) * GAP_X;
    const startX = Math.max(8, (320 - rowW) / 2);
    row.forEach((n, i) => {
      pos.set(n.id, { x: startX + i * (CELL + GAP_X), y: 8 + d * ROW_H });
    });
  }

  const canvasH = 8 + (maxDepth + 1) * ROW_H + 8;

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>{f.label}</Text>
      <Text style={styles.words}>
        words: {parseWords(demo.text).map((w) => `"${w}"`).join(' ')}
      </Text>
      <FitCanvas logicalWidth={320} logicalHeight={canvasH}>
        <View style={[styles.canvas, { height: canvasH }]}>
          {f.edges.map((e) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;
            const midX = (a.x + b.x) / 2 + CELL / 2;
            const midY = (a.y + b.y) / 2 + CELL / 2;
            return (
              <Text
                key={`${e.from}-${e.to}`}
                style={[styles.edgeCh, { left: midX - 6, top: midY - 8 }]}
              >
                {e.ch}
              </Text>
            );
          })}
          {f.nodes.map((n) => {
            const p = pos.get(n.id)!;
            const hot = f.hot.includes(n.id);
            return (
              <View key={n.id} style={[styles.nodeAbs, { left: p.x, top: p.y }]}>
                <PulseOnActive active={hot}>
                  <View
                    style={[
                      styles.node,
                      n.end && styles.end,
                      hot && styles.hot,
                      n.id === 0 && styles.root,
                    ]}
                  >
                    <Text style={styles.val}>{n.label}</Text>
                  </View>
                </PulseOnActive>
              </View>
            );
          })}
        </View>
      </FitCanvas>
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
  words: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    alignSelf: 'flex-start',
  },
  canvas: { width: 320, position: 'relative', alignSelf: 'center' },
  nodeAbs: { position: 'absolute' },
  node: {
    width: CELL,
    height: CELL,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: { borderColor: colors.radar },
  end: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  hot: { borderColor: colors.warning },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '800' },
  edgeCh: {
    position: 'absolute',
    color: colors.textDim,
    fontSize: 10,
    fontFamily: 'SpaceMono',
  },
});
