import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PressableScale } from '@/components/game/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAttempt } from '@/contexts/AttemptContext';
import { exitProblemFlow } from '@/lib/openProblem';
import { stuckHintSteps, stuckLearnLinks } from '@/lib/stuckHints';
import { colors, radii, spacing } from '@/constants/theme';

export default function StuckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { problem } = useAttempt();
  const [unlocked, setUnlocked] = useState(0);

  const steps = useMemo(() => (problem ? stuckHintSteps(problem) : []), [problem]);
  const learnLinks = useMemo(
    () => stuckLearnLinks(problem?.approaches[0]),
    [problem],
  );

  if (!problem || problem.id !== id) {
    return (
      <Screen>
        <Text style={styles.muted}>Open the encounter first.</Text>
        <PrimaryButton label="Back" onPress={() => router.replace(`/problem/${id}`)} />
      </Screen>
    );
  }

  const visible = steps.filter((s) => s.level <= unlocked);
  const canUnlockMore = unlocked < Math.max(...steps.map((s) => s.level));

  function revealAnyway() {
    // Empty hypothesis → low score, but editorial + drill-next still load.
    router.push(`/problem/${id}/reveal?from=stuck`);
  }

  return (
    <Screen scroll>
      <Text style={styles.kicker}>STUCK PATH</Text>
      <Text style={styles.title}>Coaching, not spoilers</Text>
      <Text style={styles.sub}>
        Unlock hints one layer at a time. When you are ready, resume diagnosing — or reveal the
        editorial and drill what you missed.
      </Text>

      <View style={styles.stack}>
        {visible.map((step) => (
          <View key={step.level} style={styles.card}>
            <Text style={styles.cardKicker}>Hint {step.level}</Text>
            <Text style={styles.cardTitle}>{step.title}</Text>
            <Text style={styles.cardBody}>{step.body}</Text>
          </View>
        ))}
      </View>

      {canUnlockMore ? (
        <PrimaryButton
          label="Unlock next hint"
          onPress={() => setUnlocked((u) => u + 1)}
        />
      ) : (
        <Text style={styles.done}>All coaching layers unlocked for this problem.</Text>
      )}

      {learnLinks.length ? (
        <View style={styles.learnBox}>
          <Text style={styles.learnLabel}>Related Learn</Text>
          {learnLinks.map((link) => (
            <PressableScale
              key={link.lesson.id}
              style={styles.learnRow}
              onPress={() => {
                exitProblemFlow('/(tabs)/learn');
                router.push(`/learn/${link.lesson.id}`);
              }}
            >
              <Text style={styles.learnTitle}>{link.lesson.title}</Text>
              <Text style={styles.learnCta}>Open</Text>
            </PressableScale>
          ))}
        </View>
      ) : null}

      <PrimaryButton
        label="Resume · Constraint Radar"
        variant="secondary"
        onPress={() => router.push(`/problem/${id}/radar`)}
      />
      <PrimaryButton
        label="Reveal editorial anyway"
        variant="ghost"
        onPress={revealAnyway}
      />
      <PrimaryButton
        label="Back to statement"
        variant="ghost"
        onPress={() => router.replace(`/problem/${id}`)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  stack: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  cardKicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  done: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  learnBox: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  learnLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  learnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  learnTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  learnCta: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  muted: {
    color: colors.textMuted,
  },
});
