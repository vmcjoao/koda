import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MarkdownMath } from '@/components/MarkdownMath';
import { useAttempt } from '@/contexts/AttemptContext';
import { fetchProblem } from '@/lib/api';
import { colors, radii, spacing } from '@/constants/theme';

export default function EncounterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { problem, draft, beginProblem, tickTime } = useAttempt();
  const [loading, setLoading] = useState(!problem || problem.id !== id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (problem?.id === id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const p = await fetchProblem(id);
      if (!active) return;
      if (!p) {
        setError('Problem not found');
        setLoading(false);
        return;
      }
      beginProblem(p);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id, problem?.id, beginProblem]);

  useEffect(() => {
    const timer = setInterval(tickTime, 1000);
    return () => clearInterval(timer);
  }, [tickTime]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  if (error || !problem) {
    return (
      <Screen>
        <Text style={styles.error}>{error ?? 'Missing problem'}</Text>
      </Screen>
    );
  }

  const elapsed = draft?.timeSpentSec ?? 0;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.source}>
          {problem.source} · {problem.difficulty_rating}
        </Text>
        <Text style={styles.timer}>
          {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
        </Text>
      </View>
      <Text style={styles.title}>{problem.title}</Text>

      <Text style={styles.label}>Statement</Text>
      <MarkdownMath markdown={problem.statement_md} minHeight={220} />

      <Text style={styles.label}>Constraints</Text>
      <MarkdownMath markdown={problem.constraints_text} minHeight={80} />

      <Text style={styles.label}>Samples</Text>
      {problem.sample_io.map((s, i) => (
        <View key={i} style={styles.sample}>
          <Text style={styles.sampleLabel}>Input</Text>
          <Text style={styles.mono}>{s.input}</Text>
          <Text style={styles.sampleLabel}>Output</Text>
          <Text style={styles.mono}>{s.output}</Text>
        </View>
      ))}

      <PrimaryButton
        label="Constraint Radar"
        onPress={() => router.push(`/problem/${problem.id}/radar`)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timer: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sample: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  sampleLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  mono: {
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  error: {
    color: colors.danger,
  },
});
