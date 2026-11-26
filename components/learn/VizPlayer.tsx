import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GraphSearchViz, type GraphStep } from '@/components/learn/viz/GraphSearchViz';
import { BinarySearchViz } from '@/components/learn/viz/BinarySearchViz';
import { DsuViz } from '@/components/learn/viz/DsuViz';
import { PrefixViz } from '@/components/learn/viz/PrefixViz';
import type { ArrayDemo, GraphDemo, LearnVizKind } from '@/types/learn';
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
  demo: GraphDemo | ArrayDemo;
};

export function VizPlayer({ kind, demo }: Props) {
  const graphSteps = useMemo(() => {
    if (!('nodes' in demo)) return [] as GraphStep[];
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
    if (kind === 'array-binary-search' && 'values' in demo) {
      // lo/hi frames ≈ 2 + ~log2(n) iterations
      return Math.max(2, Math.ceil(Math.log2(demo.values.length + 1)) + 3);
    }
    if (kind === 'array-prefix' && 'values' in demo) return demo.values.length;
    if (kind === 'dsu-merge') return 4;
    return Math.max(0, graphSteps.length - 1);
  }, [demo, graphSteps.length, kind]);

  const [step, setStep] = useState(0);

  const reset = useCallback(() => setStep(0), []);
  const next = useCallback(() => setStep((s) => Math.min(maxStep, s + 1)), [maxStep]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        {kind.startsWith('graph-') && 'nodes' in demo ? (
          <GraphSearchViz demo={demo} step={graphSteps[Math.min(step, graphSteps.length - 1)]} />
        ) : null}
        {kind === 'array-binary-search' && 'values' in demo ? (
          <BinarySearchViz demo={demo} step={step} />
        ) : null}
        {kind === 'dsu-merge' && 'nodes' in demo ? <DsuViz demo={demo} step={step} /> : null}
        {kind === 'array-prefix' && 'values' in demo ? (
          <PrefixViz demo={demo} step={step} />
        ) : null}
      </View>
      <Text style={styles.caption}>
        Step {step}/{maxStep}
        {graphSteps[step]?.label ? ` · ${graphSteps[step].label}` : ''}
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
