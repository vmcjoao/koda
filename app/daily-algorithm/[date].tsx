import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { FadeInUp } from '@/components/game/FadeInUp';
import { XpChip } from '@/components/game/XpChip';
import { LessonExercise } from '@/components/learn/LessonExercise';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { awardDailyAlgorithmXp } from '@/lib/api';
import {
  DAILY_ALGO_XP,
  dailyAlgoStreak,
  formatPuzzleDate,
  isFutureDate,
  isToday as isTodayIso,
  lessonForDate,
  seedForDate,
} from '@/lib/dailyAlgorithm';
import {
  getClearedDailyAlgoDates,
  isDailyAlgoCleared,
  markDailyAlgoCleared,
} from '@/lib/dailyAlgorithmProgress';
import { buildExercises, countExerciseBeats } from '@/lib/learnExerciseGen';
import { todayIso } from '@/lib/habit';
import { colors, radii, spacing } from '@/constants/theme';

export default function DailyAlgorithmPuzzleScreen() {
  const { date: dateParam } = useLocalSearchParams<{ date: string }>();
  const iso = String(dateParam ?? todayIso());
  const navigation = useNavigation();
  const { user, refreshProfile } = useAuth();
  const today = todayIso();
  const lesson = lessonForDate(iso);
  const seed = seedForDate(iso);
  const drills = useMemo(
    () => (lesson ? buildExercises(lesson.id, seed) : []),
    [lesson, seed],
  );
  const beatCount = useMemo(() => countExerciseBeats(drills), [drills]);

  const [cleared, setCleared] = useState(false);
  const [justCleared, setJustCleared] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      title: lesson ? `Daily · ${lesson.title}` : 'Daily algorithm',
    });
  }, [lesson, navigation]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setJustCleared(false);
      setXpAwarded(0);
      (async () => {
        const [done, dates] = await Promise.all([
          isDailyAlgoCleared(iso),
          getClearedDailyAlgoDates(),
        ]);
        if (!active) return;
        setCleared(done);
        setStreak(dailyAlgoStreak(dates, today));
      })();
      return () => {
        active = false;
      };
    }, [iso, today]),
  );

  if (isFutureDate(iso, today)) {
    return (
      <Screen>
        <Text style={styles.missing}>That day is still locked.</Text>
        <PrimaryButton label="Back to calendar" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!lesson || !drills.length) {
    return (
      <Screen>
        <Text style={styles.missing}>No puzzle for this day.</Text>
        <PrimaryButton label="Back to calendar" onPress={() => router.back()} />
      </Screen>
    );
  }

  async function onAllCleared() {
    const first = await markDailyAlgoCleared(iso);
    setCleared(true);
    setJustCleared(true);

    if (first) {
      const profile = await awardDailyAlgorithmXp(user?.id ?? null, DAILY_ALGO_XP);
      setXpAwarded(DAILY_ALGO_XP);
      await refreshProfile();
      const dates = await getClearedDailyAlgoDates();
      setStreak(dailyAlgoStreak(dates, today));
      void profile;
    } else {
      const dates = await getClearedDailyAlgoDates();
      setStreak(dailyAlgoStreak(dates, today));
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      /* optional */
    }
  }

  const isToday = isTodayIso(iso, today);
  const isCatchUp = iso < today;

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>
            {isToday ? 'TODAY' : isCatchUp ? 'CATCH-UP' : formatPuzzleDate(iso)} ·{' '}
            {lesson.tagLabel}
          </Text>
          <Text style={styles.dateLine}>{formatPuzzleDate(iso)}</Text>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.summary}>{lesson.summary}</Text>
          <View style={styles.chips}>
            {cleared ? (
              <XpChip label="CLEARED" tone="accent" />
            ) : (
              <XpChip label="OPEN" tone="xp" />
            )}
            <XpChip
              label={`${beatCount} BEAT${beatCount === 1 ? '' : 'S'}`}
              tone="warning"
              delayMs={40}
            />
            {streak > 0 ? (
              <XpChip label={`${streak} STREAK`} tone="accent" delayMs={80} />
            ) : null}
          </View>
        </View>
      </FadeInUp>

      {justCleared ? (
        <FadeInUp delayMs={40} waitForLaunch={false}>
          <View style={styles.banner}>
            <Text style={styles.bannerKicker}>DAILY CLEARED</Text>
            <Text style={styles.bannerText}>
              {xpAwarded > 0
                ? `+${xpAwarded} XP · streak ${streak}. Come back tomorrow.`
                : `Replay logged — streak sits at ${streak}.`}
            </Text>
          </View>
        </FadeInUp>
      ) : null}

      <FadeInUp delayMs={80} waitForLaunch={false}>
        <View style={styles.panel}>
          <Text style={styles.panelKicker}>SKILL CHECK</Text>
          <Text style={styles.prompt}>
            {isCatchUp
              ? 'Catch up — same seeded instance as that calendar day.'
              : 'Solve today’s seeded instance of this algorithm.'}
          </Text>
          <LessonExercise key={seed} exercises={drills} onAllCleared={onAllCleared} />
        </View>
      </FadeInUp>

      <FadeInUp delayMs={120} waitForLaunch={false}>
        <View style={styles.footer}>
          <PrimaryButton
            label="Open Learn lesson"
            variant="secondary"
            onPress={() => router.push(`/learn/${lesson.id}`)}
          />
          {cleared ? (
            <PrimaryButton
              label="Back to calendar"
              onPress={() => router.replace('/daily-algorithm')}
            />
          ) : (
            <PrimaryButton
              label="Calendar"
              variant="ghost"
              onPress={() => router.back()}
            />
          )}
        </View>
      </FadeInUp>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { color: colors.textMuted, fontSize: 16, marginBottom: spacing.md },
  hero: { gap: spacing.sm, marginBottom: spacing.sm },
  kicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  dateLine: {
    color: colors.textDim,
    fontSize: 13,
    fontFamily: 'SpaceMono',
    marginTop: -4,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  summary: {
    color: colors.textMuted,
    fontSize: 14,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  banner: {
    backgroundColor: colors.chipSelected,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    gap: 2,
    marginBottom: spacing.sm,
  },
  bannerKicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  bannerText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  panelKicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  prompt: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
});
