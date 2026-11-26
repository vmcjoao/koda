import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { useAttempt } from '@/contexts/AttemptContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function HistoryScreen() {
  const { user } = useAuth();
  const { beginProblem } = useAttempt();
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [problems, setProblems] = useState<Record<string, ProblemWithApproaches>>({});
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [a, p] = await Promise.all([fetchAttempts(user?.id ?? null), fetchProblems()]);
        if (!active) return;
        const map: Record<string, ProblemWithApproaches> = {};
        for (const item of p) map[item.id] = item;
        setAttempts(a);
        setProblems(map);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user?.id]),
  );

  const sorted = useMemo(
    () => [...attempts].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    [attempts],
  );

  function reopen(a: UserAttempt) {
    const p = problems[a.problem_id];
    if (!p) return;
    beginProblem(p);
    router.push(`/problem/${p.id}`);
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Attempt history</Text>
      <Text style={styles.sub}>Past diagnoses — tap to retry a problem.</Text>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {!loading && sorted.length === 0 ? (
        <Text style={styles.empty}>No attempts yet. Finish a Daily Set problem to start logging.</Text>
      ) : null}

      {sorted.map((a) => {
        const p = problems[a.problem_id];
        const when = new Date(a.timestamp);
        const timeLabel = Number.isNaN(when.getTime())
          ? a.timestamp
          : when.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
        return (
          <Pressable key={a.id} style={styles.card} onPress={() => reopen(a)}>
            <View style={styles.cardTop}>
              <Text style={styles.source}>{p?.source ?? 'Problem'}</Text>
              <Text
                style={[
                  styles.score,
                  a.score_accuracy >= 70 ? styles.scoreGood : styles.scoreWeak,
                ]}
              >
                {a.score_accuracy}%
              </Text>
            </View>
            <Text style={styles.cardTitle}>{p?.title ?? a.problem_id}</Text>
            <Text style={styles.meta}>
              {timeLabel} · {Math.round(a.time_spent_sec / 60)}m insight · {a.status.replace('_', ' ')}
            </Text>
            {a.mistake_types?.length ? (
              <Text style={styles.miss} numberOfLines={1}>
                {a.mistake_types.join(' · ')}
              </Text>
            ) : (
              <Text style={styles.ok}>Clean read</Text>
            )}
            {a.complexity_bonus ? <Text style={styles.ok}>Radar bonus</Text> : null}
          </Pressable>
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
  score: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    fontWeight: '700',
  },
  scoreGood: {
    color: colors.accent,
  },
  scoreWeak: {
    color: colors.warning,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  miss: {
    color: colors.warning,
    fontSize: 12,
  },
  ok: {
    color: colors.accentDim,
    fontSize: 12,
  },
});
