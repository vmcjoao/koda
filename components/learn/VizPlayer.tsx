import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import type {
  ArrayDemo,
  GraphDemo,
  KnapsackDemo,
  LearnDemo,
  LearnVizKind,
  PointsDemo,
} from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';
import {
  buildBfsSteps,
  buildDfsSteps,
  buildDijkstraSteps,
  buildMstSteps,
  buildTopoSteps,
} from '@/lib/learnViz';

type Props = {
  kind: LearnVizKind;
  demo: LearnDemo;
};

function isGraph(demo: LearnDemo): demo is GraphDemo {
  return 'nodes' in demo && 'edges' in demo;
}
function isArray(demo: LearnDemo): demo is ArrayDemo {
  return 'values' in demo;
}
function isKnapsack(demo: LearnDemo): demo is KnapsackDemo {
  return 'weights' in demo && 'capacity' in demo;
}
function isPoints(demo: LearnDemo): demo is PointsDemo {
  return 'points' in demo;
}

export function VizPlayer({ kind, demo }: Props) {
  const graphSteps = useMemo(() => {
    if (!isGraph(demo)) return [] as GraphStep[];
    switch (kind) {
      case 'graph-bfs':
        return buildBfsSteps(demo);
      case 'graph-dfs':
        return buildDfsSteps(demo);
      case 'graph-dijkstra':
        return buildDijkstraSteps(demo);
      case 'graph-topo':
        return buildTopoSteps(demo);
      case 'graph-mst':
        return buildMstSteps(demo);
      default:
        return [];
    }
  }, [demo, kind]);

  const maxStep = useMemo(() => {
    if (kind === 'array-binary-search' && isArray(demo)) {
      let lo = 0;
      let hi = demo.values.length;
      const target = demo.target ?? demo.values[Math.floor(demo.values.length / 2)];
      let frames = 1;
      let guard = 0;
      while (lo < hi && guard++ < 20) {
        const mid = lo + Math.floor((hi - lo) / 2);
        frames += 1;
        if (demo.values[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      frames += 1;
      return Math.max(0, frames - 1);
    }
    if (kind === 'array-prefix' && isArray(demo)) return demo.values.length;
    if (kind === 'dsu-merge') return 4;
    if (kind === 'dp-knapsack' && isKnapsack(demo)) return knapsackFrameCount(demo);
    if (kind === 'mono-stack' && isArray(demo)) return monoStackFrameCount(demo) - 1;
    if (kind === 'array-two-pointers' && isArray(demo))
      return Math.max(0, twoPointersFrameCount(demo) - 1);
    if (kind === 'array-lis' && isArray(demo)) return Math.max(0, lisFrameCount(demo) - 1);
    if (kind === 'array-sort' && isArray(demo)) return Math.max(0, sortFrameCount(demo) - 1);
    if (kind === 'array-sieve' && isArray(demo)) return Math.max(0, sieveFrameCount(demo) - 1);
    if (kind === 'geo-orient' && isPoints(demo)) return Math.max(0, orientFrameCount(demo) - 1);
    if (kind === 'geo-hull' && isPoints(demo)) return Math.max(0, hullFrameCount(demo) - 1);
    return Math.max(0, graphSteps.length - 1);
  }, [demo, graphSteps.length, kind]);

  const [step, setStep] = useState(0);
  useEffect(() => setStep(0), [kind, demo]);

  const reset = useCallback(() => setStep(0), []);
  const next = useCallback(() => setStep((s) => Math.min(maxStep, s + 1)), [maxStep]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const captionExtra =
    kind.startsWith('graph-') && graphSteps[step]?.label
      ? ` · ${graphSteps[step].label}`
      : '';

  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        {kind.startsWith('graph-') && isGraph(demo) ? (
          <GraphSearchViz demo={demo} step={graphSteps[Math.min(step, graphSteps.length - 1)]} />
        ) : null}
        {kind === 'array-binary-search' && isArray(demo) ? (
          <BinarySearchViz demo={demo} step={step} />
        ) : null}
        {kind === 'dsu-merge' && isGraph(demo) ? <DsuViz demo={demo} step={step} /> : null}
        {kind === 'array-prefix' && isArray(demo) ? <PrefixViz demo={demo} step={step} /> : null}
        {kind === 'dp-knapsack' && isKnapsack(demo) ? (
          <KnapsackViz demo={demo} step={step} />
        ) : null}
        {kind === 'mono-stack' && isArray(demo) ? (
          <MonoStackViz demo={demo} step={step} />
        ) : null}
        {kind === 'array-two-pointers' && isArray(demo) ? (
          <TwoPointersViz demo={demo} step={step} />
        ) : null}
        {kind === 'array-lis' && isArray(demo) ? <LisViz demo={demo} step={step} /> : null}
        {kind === 'array-sort' && isArray(demo) ? <SortViz demo={demo} step={step} /> : null}
        {kind === 'array-sieve' && isArray(demo) ? <SieveViz demo={demo} step={step} /> : null}
        {kind === 'geo-orient' && isPoints(demo) ? <OrientViz demo={demo} step={step} /> : null}
        {kind === 'geo-hull' && isPoints(demo) ? <HullViz demo={demo} step={step} /> : null}
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
