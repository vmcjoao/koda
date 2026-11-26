import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { AnimatedNumber } from '@/components/game/AnimatedNumber';
import { PressableScale } from '@/components/game/PressableScale';
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

  const due = queue.length;
  const formLine =
    due === 0
      ? 'Deck clear — nothing due. Misses will resurface here.'
      : due === 1
        ? 'One card due — clear it while the miss is fresh.'
        : `${due} cards due — spaced reps until the pattern sticks.`;

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <Text style={styles.kicker}>SPACED REPS</Text>
        <Text style={styles.title}>Review</Text>
        <Text style={styles.sub}>{formLine}</Text>
      </View>

      <View style={styles.deckPlate}>
        <View>
          <Text style={styles.deckLabel}>Due now</Text>
          <AnimatedNumber value={due} style={styles.deckValue} />
        </View>
        <Text style={styles.deckHint}>Missed paradigms & twists resurface until cleared</Text>
      </View>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {!loading && due === 0 ? (
        <View style={styles.clearCard}>
          <Text style={styles.clearTitle}>Deck cleared</Text>
          <Text style={styles.clearSub}>
            Nail a few runs or mark misses for review to fill this queue.
          </Text>
        </View>
      ) : null}

      {queue.map((p, i) => {
        const isNext = i === 0;
        return (
          <PressableScale
            key={p.id}
            style={[styles.card, isNext && styles.cardNext]}
            haptic={isNext ? 'medium' : 'light'}
            onPress={() => start(p)}
          >
            <View style={styles.cardTop}>
              <Text style={[styles.badge, isNext && styles.badgeNext]}>
                {isNext ? 'NEXT' : `#${i + 1}`}
              </Text>
              <Text style={styles.rating}>{p.difficulty_rating}</Text>
            </View>
            <Text style={styles.source}>{p.source}</Text>
            <Text style={styles.cardTitle}>{p.title}</Text>
            <Text style={styles.meta}>{p.target_complexity}</Text>
            {isNext ? <Text style={styles.cta}>Draw →</Text> : null}
          </PressableScale>
        );
      })}

      {queue[0] ? (
        <PrimaryButton label="Review next" onPress={() => start(queue[0])} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 4,
  },
  kicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  deckPlate: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: spacing.md,
    gap: 4,
  },
  deckLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  deckValue: {
    color: colors.warning,
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  deckHint: {
    color: colors.textDim,
    fontSize: 12,
  },
  clearCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    padding: spacing.md,
    gap: 4,
  },
  clearTitle: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  clearSub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  cardNext: {
    borderColor: colors.warning,
    borderWidth: 2,
    backgroundColor: '#1C1810',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  badgeNext: {
    color: colors.warning,
  },
  source: {
    color: colors.warning,
    fontSize: 11,
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
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  cta: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
});
