import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GraphSearchViz, type GraphStep } from '@/components/learn/viz/GraphSearchViz';
import { BinarySearchViz } from '@/components/learn/viz/BinarySearchViz';
import { DsuViz } from '@/components/learn/viz/DsuViz';
import { PrefixViz } from '@/components/learn/viz/PrefixViz';
import { KnapsackViz, knapsackFrameCount } from '@/components/learn/viz/KnapsackViz';
import { MonoStackViz, monoStackFrameCount } from '@/components/learn/viz/MonoStackViz';
import {
  TwoPointersViz,
  twoPointersFrameCount,
} from '@/components/learn/viz/TwoPointersViz';
import { LisViz, lisFrameCount } from '@/components/learn/viz/LisViz';
import { SortViz, sortFrameCount } from '@/components/learn/viz/SortViz';
import { SieveViz, sieveFrameCount } from '@/components/learn/viz/SieveViz';
import { OrientViz, orientFrameCount } from '@/components/learn/viz/OrientViz';
import { HullViz, hullFrameCount } from '@/components/learn/viz/HullViz';
import { StringZViz, stringZFrameCount } from '@/components/learn/viz/StringZViz';
import { KmpViz, kmpFrameCount } from '@/components/learn/viz/KmpViz';
import { NimViz, nimFrameCount } from '@/components/learn/viz/NimViz';
import { StackQueueViz, stackQueueFrameCount } from '@/components/learn/viz/StackQueueViz';
import { SegtreeViz, segtreeFrameCount } from '@/components/learn/viz/SegtreeViz';
import { FenwickViz, fenwickFrameCount } from '@/components/learn/viz/FenwickViz';
import { SparseTableViz, sparseTableFrameCount } from '@/components/learn/viz/SparseTableViz';
import { DiffArrayViz, diffArrayFrameCount } from '@/components/learn/viz/DiffArrayViz';
import { FloydViz, floydFrameCount } from '@/components/learn/viz/FloydViz';
import { HeapViz, heapFrameCount } from '@/components/learn/viz/HeapViz';
import type {
  ArrayDemo,
  GraphDemo,
  KnapsackDemo,
  LearnDemo,
  LearnVizKind,
  PointsDemo,
  StringDemo,
} from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import { randomLessonDemo } from '@/lib/learnDemoGen';
import { buildSortFrames } from '@/lib/learnSortFrames';
import {
  build01BfsSteps,
  buildBellmanSteps,
  buildBfsSteps,
  buildBridgeSteps,
  buildDfsSteps,
  buildDijkstraSteps,
  buildMstSteps,
  buildSccSteps,
  buildTopoSteps,
} from '@/lib/learnViz';

type Props = {
  kind: LearnVizKind;
  demo: LearnDemo;
  /** Used for purpose-fit shuffle overrides (e.g. LCA tree). */
  lessonId?: string;
};

function isGraph(demo: LearnDemo): demo is GraphDemo {
  return 'nodes' in demo && 'edges' in demo;
}
function isArray(demo: LearnDemo): demo is ArrayDemo {
  return 'values' in demo && !('weights' in demo);
}
function isKnapsack(demo: LearnDemo): demo is KnapsackDemo {
  return 'weights' in demo && 'capacity' in demo;
}
function isPoints(demo: LearnDemo): demo is PointsDemo {
  return 'points' in demo;
}
function isString(demo: LearnDemo): demo is StringDemo {
  return 'text' in demo;
}

/** Remount (via `key` on the parent) when lesson/kind changes so curated demo resets. */
export function VizPlayer({ kind, demo, lessonId }: Props) {
  const [liveDemo, setLiveDemo] = useState<LearnDemo>(demo);
  const [step, setStep] = useState(0);

  const graphSteps = useMemo(() => {
    if (!isGraph(liveDemo)) return [] as GraphStep[];
    switch (kind) {
      case 'graph-bfs':
        return buildBfsSteps(liveDemo);
      case 'graph-dfs':
        return buildDfsSteps(liveDemo);
      case 'graph-dijkstra':
        return buildDijkstraSteps(liveDemo);
      case 'graph-topo':
        return buildTopoSteps(liveDemo);
      case 'graph-mst':
        return buildMstSteps(liveDemo);
      case 'graph-scc':
        return buildSccSteps(liveDemo);
      case 'graph-bridges':
        return buildBridgeSteps(liveDemo);
      case 'graph-bellman':
        return buildBellmanSteps(liveDemo);
      case 'graph-01-bfs':
        return build01BfsSteps(liveDemo);
      default:
        return [];
    }
  }, [liveDemo, kind]);

  const maxStep = useMemo(() => {
    if (kind === 'array-binary-search' && isArray(liveDemo)) {
      let lo = 0;
      let hi = liveDemo.values.length;
      const target = liveDemo.target ?? liveDemo.values[Math.floor(liveDemo.values.length / 2)];
      let frames = 1;
      let guard = 0;
      while (lo < hi && guard++ < 20) {
        const mid = lo + Math.floor((hi - lo) / 2);
        frames += 1;
        if (liveDemo.values[mid]! < target!) lo = mid + 1;
        else hi = mid;
      }
      frames += 1;
      return Math.max(0, frames - 1);
    }
    if (kind === 'array-prefix' && isArray(liveDemo)) return liveDemo.values.length;
    if (kind === 'array-fenwick' && isArray(liveDemo))
      return Math.max(0, fenwickFrameCount(liveDemo) - 1);
    if (kind === 'array-sparse' && isArray(liveDemo))
      return Math.max(0, sparseTableFrameCount(liveDemo) - 1);
    if (kind === 'array-diff' && isArray(liveDemo))
      return Math.max(0, diffArrayFrameCount(liveDemo) - 1);
    if (kind === 'graph-floyd' && isGraph(liveDemo))
      return Math.max(0, floydFrameCount(liveDemo) - 1);
    if (kind === 'dsu-merge') return 4;
    if (kind === 'dp-knapsack' && isKnapsack(liveDemo)) return knapsackFrameCount(liveDemo);
    if (kind === 'mono-stack' && isArray(liveDemo)) return monoStackFrameCount(liveDemo) - 1;
    if (kind === 'array-two-pointers' && isArray(liveDemo))
      return Math.max(0, twoPointersFrameCount(liveDemo) - 1);
    if (kind === 'array-lis' && isArray(liveDemo)) return Math.max(0, lisFrameCount(liveDemo) - 1);
    if (kind === 'array-sort' && isArray(liveDemo))
      return Math.max(0, sortFrameCount(liveDemo, lessonId) - 1);
    if (kind === 'array-sieve' && isArray(liveDemo)) return Math.max(0, sieveFrameCount(liveDemo) - 1);
    if (kind === 'geo-orient' && isPoints(liveDemo)) return Math.max(0, orientFrameCount(liveDemo) - 1);
    if (kind === 'geo-hull' && isPoints(liveDemo)) return Math.max(0, hullFrameCount(liveDemo) - 1);
    if (kind === 'string-z' && isString(liveDemo)) return Math.max(0, stringZFrameCount(liveDemo) - 1);
    if (kind === 'string-kmp' && isString(liveDemo)) return Math.max(0, kmpFrameCount(liveDemo) - 1);
    if (kind === 'nim-heaps' && isArray(liveDemo)) return Math.max(0, nimFrameCount(liveDemo) - 1);
    if (kind === 'heap-pq' && isArray(liveDemo)) return Math.max(0, heapFrameCount(liveDemo) - 1);
    if ((kind === 'array-stack' || kind === 'array-queue') && isArray(liveDemo))
      return Math.max(0, stackQueueFrameCount(liveDemo) - 1);
    if (kind === 'segtree-sum' && isArray(liveDemo)) return Math.max(0, segtreeFrameCount(liveDemo) - 1);
    return Math.max(0, graphSteps.length - 1);
  }, [liveDemo, graphSteps.length, kind, lessonId]);

  const sortFrames = useMemo(() => {
    if (kind !== 'array-sort' || !isArray(liveDemo)) return null;
    return buildSortFrames(liveDemo, lessonId);
  }, [kind, liveDemo, lessonId]);

  const reset = useCallback(() => setStep(0), []);
  const next = useCallback(() => setStep((s) => Math.min(maxStep, s + 1)), [maxStep]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const shuffle = useCallback(() => {
    setLiveDemo(randomLessonDemo(kind, Date.now() ^ (Math.random() * 1e9), lessonId));
    setStep(0);
  }, [kind, lessonId]);

  const setBinaryTarget = useCallback((target: number) => {
    setLiveDemo((prev) => {
      if (!isArray(prev)) return prev;
      if (prev.target === target) return prev;
      return { ...prev, target };
    });
    setStep(0);
  }, []);

  const captionExtra =
    kind.startsWith('graph-') && graphSteps[step]?.label
      ? ` · ${graphSteps[step]!.label}`
      : sortFrames?.[Math.min(step, sortFrames.length - 1)]?.label
        ? ` · ${sortFrames[Math.min(step, sortFrames.length - 1)]!.label}`
        : '';

  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        {kind.startsWith('graph-') && kind !== 'graph-floyd' && isGraph(liveDemo) ? (
          <GraphSearchViz
            demo={liveDemo}
            step={graphSteps[Math.min(step, Math.max(0, graphSteps.length - 1))]}
          />
        ) : null}
        {kind === 'graph-floyd' && isGraph(liveDemo) ? (
          <FloydViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'array-binary-search' && isArray(liveDemo) ? (
          <BinarySearchViz demo={liveDemo} step={step} onTargetChange={setBinaryTarget} />
        ) : null}
        {kind === 'dsu-merge' && isGraph(liveDemo) ? <DsuViz demo={liveDemo} step={step} /> : null}
        {kind === 'array-prefix' && isArray(liveDemo) ? (
          <PrefixViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'array-fenwick' && isArray(liveDemo) ? (
          <FenwickViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'array-sparse' && isArray(liveDemo) ? (
          <SparseTableViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'array-diff' && isArray(liveDemo) ? (
          <DiffArrayViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'dp-knapsack' && isKnapsack(liveDemo) ? (
          <KnapsackViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'mono-stack' && isArray(liveDemo) ? (
          <MonoStackViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'array-two-pointers' && isArray(liveDemo) ? (
          <TwoPointersViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'array-lis' && isArray(liveDemo) ? <LisViz demo={liveDemo} step={step} /> : null}
        {kind === 'array-sort' && isArray(liveDemo) ? (
          <SortViz demo={liveDemo} step={step} lessonId={lessonId} />
        ) : null}
        {kind === 'array-sieve' && isArray(liveDemo) ? (
          <SieveViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'geo-orient' && isPoints(liveDemo) ? (
          <OrientViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'geo-hull' && isPoints(liveDemo) ? <HullViz demo={liveDemo} step={step} /> : null}
        {kind === 'string-z' && isString(liveDemo) ? (
          <StringZViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'string-kmp' && isString(liveDemo) ? (
          <KmpViz demo={liveDemo} step={step} />
        ) : null}
        {kind === 'nim-heaps' && isArray(liveDemo) ? <NimViz demo={liveDemo} step={step} /> : null}
        {kind === 'heap-pq' && isArray(liveDemo) ? <HeapViz demo={liveDemo} step={step} /> : null}
        {kind === 'array-stack' && isArray(liveDemo) ? (
          <StackQueueViz demo={liveDemo} step={step} mode="stack" />
        ) : null}
        {kind === 'array-queue' && isArray(liveDemo) ? (
          <StackQueueViz demo={liveDemo} step={step} mode="queue" />
        ) : null}
        {kind === 'segtree-sum' && isArray(liveDemo) ? (
          <SegtreeViz demo={liveDemo} step={step} />
        ) : null}
      </View>
      <Text style={styles.caption}>
        Step {step}/{maxStep}
        {captionExtra}
      </Text>
      <View style={styles.controls}>
        <PrimaryButton label="Reset" variant="ghost" onPress={reset} style={styles.btn} />
        <PrimaryButton label="Back" variant="secondary" onPress={prev} style={styles.btn} />
        <PrimaryButton label="Step" onPress={next} style={styles.btn} />
      </View>
      <PrimaryButton label="Shuffle example" variant="secondary" onPress={shuffle} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  stage: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    minHeight: 44,
  },
});
