import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems, updateAttemptStatus } from '@/lib/api';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function QueueScreen() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [problems, setProblems] = useState<Record<string, ProblemWithApproaches>>({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [a, p] = await Promise.all([fetchAttempts(user?.id ?? null), fetchProblems()]);
    const map: Record<string, ProblemWithApproaches> = {};
    for (const item of p) map[item.id] = item;
    setAttempts(a.filter((x) => x.status === 'drafted' || x.pseudocode_draft));
    setProblems(map);
    setLoading(false);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function markAc(id: string) {
    await updateAttemptStatus(id, user?.id ?? null, 'implemented_ac');
    await reload();
  }

  async function markReview(id: string) {
    await updateAttemptStatus(id, user?.id ?? null, 'needs_review');
    await reload();
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Implement Queue</Text>
      <Text style={styles.sub}>
        Blueprints ready for your PC — open the OJ link, code from your draft, then mark AC.
      </Text>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {!loading && attempts.length === 0 ? (
        <Text style={styles.empty}>No drafts yet. Solve a problem and save a blueprint.</Text>
      ) : null}

      {attempts.map((a) => {
        const problem = problems[a.problem_id];
        return (
          <View key={a.id} style={styles.card}>
            <Text style={styles.source}>{problem?.source ?? 'Problem'}</Text>
            <Text style={styles.cardTitle}>{problem?.title ?? a.problem_id}</Text>
            <Text style={styles.meta}>
              Score {a.score_accuracy}% · {a.status.replace('_', ' ')}
            </Text>
            {a.pseudocode_draft ? (
              <Text style={styles.draft} numberOfLines={6}>
                {a.pseudocode_draft}
              </Text>
            ) : (
              <Text style={styles.meta}>No pseudocode saved</Text>
            )}
            {problem?.url ? <Text style={styles.link}>{problem.url}</Text> : null}
            <View style={styles.actions}>
              <PrimaryButton
                label="Mark AC"
                onPress={() => markAc(a.id)}
                style={styles.actionBtn}
              />
              <PrimaryButton
                label="Needs review"
                variant="secondary"
                onPress={() => markReview(a.id)}
                style={styles.actionBtn}
              />
            </View>
          </View>
        );
      })}
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
    marginBottom: spacing.sm,
  },
  empty: {
    color: colors.textDim,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  source: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  draft: {
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  link: {
    color: colors.radar,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});
