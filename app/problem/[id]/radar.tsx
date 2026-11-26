import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ChipPicker } from '@/components/ChipPicker';
import { ProseCard } from '@/components/ProseCard';
import { useAttempt } from '@/contexts/AttemptContext';
import { COMPLEXITY_OPTIONS } from '@/constants/tags';
import { colors, spacing } from '@/constants/theme';

export default function RadarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { problem, setComplexityGuess } = useAttempt();
  const [selected, setSelected] = useState<string[]>([]);

  const items = useMemo(
    () => COMPLEXITY_OPTIONS.map((label) => ({ label, aliases: [label.replace(/\s/g, '')] })),
    [],
  );

  if (!problem || problem.id !== id) {
    return (
      <Screen>
        <Text style={styles.muted}>Open the encounter first.</Text>
        <PrimaryButton label="Back" onPress={() => router.replace(`/problem/${id}`)} />
      </Screen>
    );
  }

  function continueNext() {
    const guess = selected[0] ?? null;
    const bonus = !!guess && guess === problem!.target_complexity;
    if (guess) setComplexityGuess(guess, bonus);
    router.push(`/problem/${id}/hypothesis`);
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Constraint Radar</Text>
      <Text style={styles.sub}>
        Read the limits and guess the target complexity. Correct guesses award bonus XP.
      </Text>

      <ProseCard markdown={problem.constraints_text} />

      <View style={styles.hintBox}>
        <Text style={styles.hint}>
          Tip: N ≤ 2×10⁵ usually means O(N log N) or better — not O(N²).
        </Text>
      </View>

      <ChipPicker
        title="Target complexity"
        items={items}
        selected={selected}
        onChange={setSelected}
        multi={false}
      />

      <PrimaryButton
        label={selected.length ? 'Lock guess & continue' : 'Skip radar'}
        onPress={continueNext}
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
    color: colors.radar,
    fontSize: 24,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
  },
  hintBox: {
    marginVertical: spacing.xs,
  },
  hint: {
    color: colors.textDim,
    fontSize: 13,
  },
  muted: {
    color: colors.textMuted,
  },
});
