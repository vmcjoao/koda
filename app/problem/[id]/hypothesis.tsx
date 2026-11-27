import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { FloatingCta } from '@/components/ui/FloatingCta';
import { ChipPicker } from '@/components/ChipPicker';
import { useAttempt } from '@/contexts/AttemptContext';
import { tagsByKind } from '@/constants/tags';
import { colors } from '@/constants/theme';

export default function HypothesisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { problem, draft, setHypothesis } = useAttempt();

  const twistItems = useMemo(() => {
    if (!problem) return [];
    const set = new Set<string>();
    for (const a of problem.approaches) {
      for (const t of a.key_insights) set.add(t);
    }
    // Add a few distractors so it's not trivial
    const distractors = [
      'Reverse the graph edges',
      'Compress coordinates first',
      'State is (index, mask)',
      'Sort by end time instead of start time',
      'Iterate weights backwards to save space',
      'Meet in the middle on half the array',
    ];
    for (const d of distractors) set.add(d);
    return [...set].map((label) => ({ label }));
  }, [problem]);

  if (!problem || !draft || problem.id !== id) {
    return (
      <Screen>
        <Text style={styles.muted}>Open the encounter first.</Text>
        <PrimaryButton label="Back" onPress={() => router.replace(`/problem/${id}`)} />
      </Screen>
    );
  }

  const canContinue =
    draft.paradigms.length > 0 || draft.algorithms.length > 0 || draft.dataStructures.length > 0;

  return (
    <Screen
      scroll
      footer={
        <FloatingCta
          label="Blueprint scratchpad"
          onPress={() => router.push(`/problem/${id}/blueprint`)}
          disabled={!canContinue}
          secondaryLabel="Skip blueprint → Reveal"
          onSecondaryPress={() => router.push(`/problem/${id}/reveal`)}
          secondaryDisabled={!canContinue}
        />
      }
    >
      <Text style={styles.title}>Hypothesis</Text>
      <Text style={styles.sub}>
        Build your solution path with chips — paradigm, algorithm, structures, and the key twist.
      </Text>

      <ChipPicker
        title="Paradigm / Idea"
        items={tagsByKind('paradigm').map((t) => ({ label: t.label, aliases: t.aliases }))}
        selected={draft.paradigms}
        onChange={(paradigms) => setHypothesis({ paradigms })}
      />

      <ChipPicker
        title="Core Algorithm"
        items={tagsByKind('algorithm').map((t) => ({ label: t.label, aliases: t.aliases }))}
        selected={draft.algorithms}
        onChange={(algorithms) => setHypothesis({ algorithms })}
      />

      <ChipPicker
        title="Data Structures"
        items={tagsByKind('data_structure').map((t) => ({ label: t.label, aliases: t.aliases }))}
        selected={draft.dataStructures}
        onChange={(dataStructures) => setHypothesis({ dataStructures })}
      />

      <ChipPicker
        title="Key Twist / Adaptation"
        hint="Pick the catch that makes the standard technique work"
        items={twistItems}
        selected={draft.twists}
        onChange={(twists) => setHypothesis({ twists })}
      />

      <PrimaryButton
        label="Stuck? Hint path"
        variant="ghost"
        onPress={() => router.push(`/problem/${id}/stuck`)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
  },
  muted: {
    color: colors.textMuted,
  },
});
