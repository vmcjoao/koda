import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAttempt } from '@/contexts/AttemptContext';
import { fetchAttempts, fetchProblems, pickNextProblem } from '@/lib/api';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { profile, demoMode, user, refreshProfile } = useAuth();
  const { beginProblem } = useAttempt();
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        await refreshProfile();
        const [p, a] = await Promise.all([fetchProblems(), fetchAttempts(user?.id ?? null)]);
        if (!active) return;
        setProblems(p);
        setAttempts(a);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user?.id, refreshProfile]),
  );

  const next = pickNextProblem(problems, attempts, profile?.rating_band ?? 1200);
  const lastDraft = attempts.find((a) => a.status === 'drafted' && a.pseudocode_draft);

  function startProblem(problem: ProblemWithApproaches) {
    beginProblem(problem);
    router.push(`/problem/${problem.id}`);
  }

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <Text style={styles.brand}>Koda</Text>
        <Text style={styles.tagline}>Codeless competitive programming drills</Text>
      </View>

      <View style={styles.stats}>
        <Stat label="Streak" value={`${profile?.streak ?? 0}d`} />
        <Stat label="XP" value={`${profile?.xp ?? 0}`} />
        <Stat label="Band" value={`${profile?.rating_band ?? 1200}`} />
      </View>

      {demoMode ? (
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.demo}>Guest mode · tap to sign in & sync</Text>
        </Pressable>
      ) : null}

      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <>
          <PrimaryButton
            label={next ? `Start: ${next.title}` : 'No problems available'}
            onPress={() => next && startProblem(next)}
            disabled={!next}
          />

          {lastDraft ? (
            <PrimaryButton
              label="Continue last blueprint"
              variant="secondary"
              onPress={() => {
                const p = problems.find((x) => x.id === lastDraft.problem_id);
                if (p) startProblem(p);
              }}
            />
          ) : null}

          <Text style={styles.section}>Browse catalog</Text>
          {problems.slice(0, 8).map((p) => (
            <Pressable key={p.id} style={styles.card} onPress={() => startProblem(p)}>
              <View style={styles.cardTop}>
                <Text style={styles.source}>{p.source}</Text>
                <Text style={styles.rating}>{p.difficulty_rating}</Text>
              </View>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.meta}>{p.target_complexity}</Text>
            </Pressable>
          ))}
          <Text style={styles.meta}>{problems.length} problems loaded</Text>
        </>
      )}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  brand: {
    color: colors.accent,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 15,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  demo: {
    color: colors.radar,
    fontSize: 13,
  },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.sm,
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
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rating: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: 'SpaceMono',
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
