import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAttempt } from '@/contexts/AttemptContext';
import { fetchAttempts, fetchProblems, getReviewQueue } from '@/lib/api';
import type { ProblemWithApproaches } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function ReviewScreen() {
  const { user } = useAuth();
  const { beginProblem } = useAttempt();
  const [queue, setQueue] = useState<ProblemWithApproaches[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [p, a] = await Promise.all([fetchProblems(), fetchAttempts(user?.id ?? null)]);
        const review = await getReviewQueue(user?.id ?? null, p, a);
        if (!active) return;
        setQueue(review);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user?.id]),
  );

  function start(problem: ProblemWithApproaches) {
    beginProblem(problem);
    router.push(`/problem/${problem.id}`);
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Review Deck</Text>
      <Text style={styles.sub}>
        Spaced repetition for missed paradigms and twists. Due cards resurface until you clear them.
      </Text>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {!loading && queue.length === 0 ? (
        <Text style={styles.empty}>Nothing due — nail a few problems or mark misses for review.</Text>
      ) : null}

      {queue.map((p) => (
        <Pressable key={p.id} style={styles.card} onPress={() => start(p)}>
          <View style={styles.cardTop}>
            <Text style={styles.source}>{p.source}</Text>
            <Text style={styles.rating}>{p.difficulty_rating}</Text>
          </View>
          <Text style={styles.cardTitle}>{p.title}</Text>
          <Text style={styles.meta}>{p.target_complexity}</Text>
        </Pressable>
      ))}

      {queue[0] ? (
        <PrimaryButton label="Review next" onPress={() => start(queue[0])} />
      ) : null}
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
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  source: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rating: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
