import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { OnboardingTips } from '@/components/OnboardingTips';
import { DailyPath } from '@/components/game/DailyPath';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PlayerStrip } from '@/components/game/PlayerStrip';
import { PressableScale } from '@/components/game/PressableScale';
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
import { beatCountForDate, dailyAlgoStreak, lessonForDate } from '@/lib/dailyAlgorithm';
import { getClearedDailyAlgoDates } from '@/lib/dailyAlgorithmProgress';
import { SLOT_LABELS, todayIso, type DailySet } from '@/lib/habit';
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
  const [dailyAlgoCleared, setDailyAlgoCleared] = useState(false);
  const [dailyAlgoStreakCount, setDailyAlgoStreakCount] = useState(0);
  const hasLoadedRef = useRef(false);

  const today = todayIso();
  const todayAlgo = useMemo(() => lessonForDate(today), [today]);
  const todayAlgoBeats = useMemo(() => beatCountForDate(today), [today]);

  const load = useCallback(
    async (mode: 'focus' | 'refresh' = 'focus') => {
      // Soft tab re-entry: don't block on profile network round-trip.
      if (mode === 'refresh') await refreshProfile();
      else void refreshProfile();

      const [p, a, algoDates] = await Promise.all([
        fetchProblems(mode === 'refresh' ? { force: true } : undefined),
        fetchAttempts(user?.id ?? null),
        getClearedDailyAlgoDates(),
      ]);
      const band = profile?.rating_band ?? 1200;
      const [d, review] = await Promise.all([
        getDailySet(p, a, band),
        getReviewQueue(user?.id ?? null, p, a),
      ]);
      setProblems(p);
      setAttempts(a);
      setDaily(d);
      setReviewCount(review.length);
      const day = todayIso();
      setDailyAlgoCleared(algoDates.has(day));
      setDailyAlgoStreakCount(dailyAlgoStreak(algoDates, day));
      if (await areRemindersEnabled()) {
        const hour = await getReminderHour();
        setReminderHint(formatReminderLabel(hour));
      } else {
        setReminderHint(null);
      }
    },
    [user?.id, refreshProfile, profile?.rating_band],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        if (!hasLoadedRef.current) setLoading(true);
        await load('focus');
        if (!active) return;
        hasLoadedRef.current = true;
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [load]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load('refresh');
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
  const runComplete = dailyTotal > 0 && dailyDone >= dailyTotal;

  function startProblem(problem: ProblemWithApproaches) {
    beginProblem(problem);
    // If a prior run left screens under Home, clear them before opening the next.
    if (router.canDismiss()) router.dismissAll();
    router.push(`/problem/${problem.id}`);
  }

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <OnboardingTips />
      <FadeInUp delayMs={40}>
        <View style={styles.hero}>
          <BrandWordmark size="hero" animateKOnPress />
          <Text style={styles.tagline}>Clear Warm-up → Target → Boss</Text>
        </View>
      </FadeInUp>

      <FadeInUp delayMs={120}>
        <PlayerStrip
          streak={profile?.streak ?? 0}
          xp={profile?.xp ?? 0}
          band={profile?.rating_band ?? 1200}
          onBandPress={() => router.push('/settings')}
        />
      </FadeInUp>

      {demoMode ? (
        <FadeInUp delayMs={180}>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.demo}>Guest mode · tap to sign in (uploads local progress)</Text>
          </Pressable>
        </FadeInUp>
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
          <FadeInUp delayMs={180}>
            <PressableScale
              haptic="medium"
              style={[styles.algoCard, dailyAlgoCleared && styles.algoCardDone]}
              onPress={() =>
                router.push(
                  dailyAlgoCleared
                    ? '/daily-algorithm'
                    : `/daily-algorithm/${today}`,
                )
              }
            >
              <View style={styles.algoTop}>
                <Text style={styles.algoKicker}>DAILY ALGORITHM</Text>
                <Text style={styles.algoStatus}>
                  {dailyAlgoCleared ? 'CLEARED' : 'OPEN'}
                </Text>
              </View>
              <Text style={styles.algoTitle}>{todayAlgo?.title ?? 'Skill check'}</Text>
              <Text style={styles.algoSub} numberOfLines={2}>
                {dailyAlgoCleared
                  ? `Streak ${dailyAlgoStreakCount} · open the calendar to catch up or replay.`
                  : `${todayAlgoBeats} beat${todayAlgoBeats === 1 ? '' : 's'} today · streak ${dailyAlgoStreakCount}.`}
              </Text>
              <Text style={styles.algoCta}>
                {dailyAlgoCleared ? 'View calendar →' : 'Solve today →'}
              </Text>
            </PressableScale>
          </FadeInUp>

          <FadeInUp delayMs={220}>
            <View style={styles.runHeader}>
              <Text style={styles.runTitle}>Today&apos;s run</Text>
              <Text style={styles.runProgress}>
                {dailyDone}/{dailyTotal}
              </Text>
            </View>
          </FadeInUp>

          {daily ? (
            <FadeInUp delayMs={280}>
              <DailyPath daily={daily} problemMap={problemMap} onSelect={startProblem} />
            </FadeInUp>
          ) : null}

          <FadeInUp delayMs={360}>
            {nextDaily ? (
              <PrimaryButton
                label={
                  dailyDone === 0
                    ? `Start run · ${SLOT_LABELS[nextDaily.role]}`
                    : `Continue run · ${SLOT_LABELS[nextDaily.role]}`
                }
                onPress={() => {
                  const p = problemMap.get(nextDaily.problemId);
                  if (p) startProblem(p);
                }}
              />
            ) : (
              <View style={styles.cleared}>
                <Text style={styles.clearedTitle}>Run cleared</Text>
                <Text style={styles.good}>
                  {daily?.bonusAwarded ? '+50 XP daily bonus claimed' : 'All three slots done'}
                </Text>
              </View>
            )}
          </FadeInUp>

          <FadeInUp delayMs={420}>
            {!runComplete ? (
              <PrimaryButton label="Shuffle run" variant="ghost" onPress={onRegenerateDaily} />
            ) : null}

            {reviewCount > 0 ? (
              <PrimaryButton
                label={`Review deck (${reviewCount})`}
                variant="secondary"
                onPress={() => router.push('/(tabs)/review')}
              />
            ) : null}

            <PrimaryButton
              label="Playlists"
              variant="secondary"
              onPress={() => router.push('/playlists')}
            />
          </FadeInUp>

          <FadeInUp delayMs={500}>
            <View style={styles.secondaryBlock}>
              <View style={styles.sectionRow}>
                <Text style={styles.secondaryTitle}>Catalog</Text>
                <Pressable onPress={() => router.push('/catalog')}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </View>
              <Text style={styles.secondaryHint}>
                {problems.length} problems · {attempts.length} attempts logged
              </Text>
              {problems.slice(0, 3).map((p) => (
                <PressableScale
                  key={p.id}
                  style={styles.quietCard}
                  onPress={() => startProblem(p)}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.source}>{p.source}</Text>
                    <Text style={styles.rating}>{p.difficulty_rating}</Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {p.title}
                  </Text>
                </PressableScale>
              ))}
              <PrimaryButton
                label="Browse catalog"
                variant="ghost"
                onPress={() => router.push('/catalog')}
              />
            </View>
          </FadeInUp>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  demo: {
    color: colors.radar,
    fontSize: 13,
  },
  reminderHint: {
    color: colors.textDim,
    fontSize: 12,
  },
  algoCard: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: spacing.md,
    gap: 4,
  },
  algoCardDone: {
    borderColor: colors.accentDim,
    backgroundColor: colors.chipSelected,
  },
  algoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  algoKicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  algoStatus: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: 'SpaceMono',
  },
  algoTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  algoSub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  algoCta: {
    color: colors.radar,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  runHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  runTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  runProgress: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  cleared: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    padding: spacing.md,
    gap: 4,
  },
  clearedTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  good: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryBlock: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  secondaryTitle: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryHint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: -4,
  },
  seeAll: {
    color: colors.radar,
    fontSize: 13,
    fontWeight: '600',
  },
  quietCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  source: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rating: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: 'SpaceMono',
  },
  cardTitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
