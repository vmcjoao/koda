import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { OnboardingTips } from '@/components/OnboardingTips';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAttempt } from '@/contexts/AttemptContext';
import {
  fetchAttempts,
  fetchProblems,
  getDailySet,
  getReviewQueue,
  regenerateDailySet,
} from '@/lib/api';
import { relativeDifficulty, SLOT_LABELS, type DailySet } from '@/lib/habit';
import { areRemindersEnabled, formatReminderLabel, getReminderHour } from '@/lib/notifications';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { profile, demoMode, user, refreshProfile } = useAuth();
  const { beginProblem } = useAttempt();
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [daily, setDaily] = useState<DailySet | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reminderHint, setReminderHint] = useState<string | null>(null);

  const load = useCallback(async () => {
    await refreshProfile();
    const [p, a] = await Promise.all([fetchProblems(), fetchAttempts(user?.id ?? null)]);
    const band = profile?.rating_band ?? 1200;
    const [d, review] = await Promise.all([
      getDailySet(p, a, band),
      getReviewQueue(user?.id ?? null, p, a),
    ]);
    setProblems(p);
    setAttempts(a);
    setDaily(d);
    setReviewCount(review.length);
    if (await areRemindersEnabled()) {
      const hour = await getReminderHour();
      setReminderHint(formatReminderLabel(hour));
    } else {
      setReminderHint(null);
    }
  }, [user?.id, refreshProfile, profile?.rating_band]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        await load();
        if (active) setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [load]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function onRegenerateDaily() {
    const band = profile?.rating_band ?? 1200;
    const next = await regenerateDailySet(problems, attempts, band);
    setDaily(next);
  }

  const problemMap = useMemo(() => {
    const m = new Map<string, ProblemWithApproaches>();
    for (const p of problems) m.set(p.id, p);
    return m;
  }, [problems]);

  const dailyDone = daily?.slots.filter((s) => s.completed).length ?? 0;
  const dailyTotal = daily?.slots.length ?? 0;
  const nextDaily = daily?.slots.find((s) => !s.completed);

  function startProblem(problem: ProblemWithApproaches) {
    beginProblem(problem);
    router.push(`/problem/${problem.id}`);
  }

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <OnboardingTips />
      <View style={styles.hero}>
        <BrandWordmark size="hero" />
        <Text style={styles.tagline}>Codeless competitive programming drills</Text>
      </View>

      <View style={styles.stats}>
        <Stat label="Streak" value={`${profile?.streak ?? 0}d`} />
        <Stat label="XP" value={`${profile?.xp ?? 0}`} />
        <Pressable style={{ flex: 1 }} onPress={() => router.push('/settings')}>
          <Stat label="Band ✎" value={`${profile?.rating_band ?? 1200}`} />
        </Pressable>
      </View>

      {demoMode ? (
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.demo}>Guest mode · tap to sign in & sync</Text>
        </Pressable>
      ) : null}

      {reminderHint ? (
        <Pressable onPress={() => router.push('/settings')}>
          <Text style={styles.reminderHint}>Reminder on · {reminderHint}</Text>
        </Pressable>
      ) : null}

      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <>
          <Text style={styles.section}>Daily Set · {dailyDone}/{dailyTotal}</Text>
          <Text style={styles.sectionHint}>Warm-up → Target → Boss</Text>

          {daily?.slots.map((slot) => {
            const p = problemMap.get(slot.problemId);
            if (!p) return null;
            return (
              <Pressable
                key={slot.role}
                style={[styles.card, slot.completed && styles.cardDone]}
                onPress={() => startProblem(p)}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.slotBadge}>{SLOT_LABELS[slot.role]}</Text>
                  <Text style={styles.rating}>
                    {slot.completed ? `${slot.score}%` : p.difficulty_rating}
                  </Text>
                </View>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.meta}>
                  {p.source} · {p.target_complexity} ·{' '}
                  {relativeDifficulty(p.difficulty_rating, profile?.rating_band ?? 1200)}
                  {slot.completed ? ' · done' : ''}
                </Text>
              </Pressable>
            );
          })}

          {nextDaily ? (
            <PrimaryButton
              label={`Continue daily: ${SLOT_LABELS[nextDaily.role]}`}
              onPress={() => {
                const p = problemMap.get(nextDaily.problemId);
                if (p) startProblem(p);
              }}
            />
          ) : (
            <Text style={styles.good}>
              Daily set complete
              {daily?.bonusAwarded ? ' · +50 XP bonus claimed' : ''}.
            </Text>
          )}

          {dailyDone < dailyTotal ? (
            <PrimaryButton
              label="Shuffle daily set"
              variant="ghost"
              onPress={onRegenerateDaily}
            />
          ) : null}

          {reviewCount > 0 ? (
            <PrimaryButton
              label={`Review deck (${reviewCount})`}
              variant="secondary"
              onPress={() => router.push('/(tabs)/review')}
            />
          ) : null}

          <View style={styles.sectionRow}>
            <Text style={[styles.section, styles.sectionFlush]}>Catalog</Text>
            <Pressable onPress={() => router.push('/catalog')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          {problems.slice(0, 6).map((p) => (
            <Pressable key={p.id} style={styles.card} onPress={() => startProblem(p)}>
              <View style={styles.cardTop}>
                <Text style={styles.source}>{p.source}</Text>
                <Text style={styles.rating}>{p.difficulty_rating}</Text>
              </View>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.meta}>{p.target_complexity}</Text>
            </Pressable>
          ))}
          <PrimaryButton
            label={`Browse full catalog (${problems.length})`}
            variant="secondary"
            onPress={() => router.push('/catalog')}
          />
          <Text style={styles.meta}>{attempts.length} attempts logged</Text>
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
  reminderHint: {
    color: colors.textDim,
    fontSize: 12,
  },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionFlush: {
    marginTop: 0,
  },
  seeAll: {
    color: colors.radar,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHint: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: -8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  cardDone: {
    borderColor: colors.accentDim,
    opacity: 0.85,
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
  slotBadge: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '800',
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
  good: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
