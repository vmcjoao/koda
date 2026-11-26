import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { FadeInUp } from '@/components/game/FadeInUp';
import { XpChip } from '@/components/game/XpChip';
import { LessonExercise } from '@/components/learn/LessonExercise';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import {
  isFutureDate,
  lessonForDate,
  seedForDate,
} from '@/lib/dailyAlgorithm';
import {
  isDailyAlgoCleared,
  markDailyAlgoCleared,
} from '@/lib/dailyAlgorithmProgress';
import { buildExercises } from '@/lib/learnExerciseGen';
import { todayIso } from '@/lib/habit';
import { colors, radii, spacing } from '@/constants/theme';

export default function DailyAlgorithmPuzzleScreen() {
  const { date: dateParam } = useLocalSearchParams<{ date: string }>();
  const iso = String(dateParam ?? todayIso());
  const navigation = useNavigation();
  const today = todayIso();
  const lesson = lessonForDate(iso);
  const seed = seedForDate(iso);
  const drills = useMemo(
    () => (lesson ? buildExercises(lesson.id, seed) : []),
    [lesson, seed],
  );

  const [cleared, setCleared] = useState(false);
  const [justCleared, setJustCleared] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: lesson ? `Daily · ${lesson.title}` : 'Daily algorithm',
    });
  }, [lesson, navigation]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setJustCleared(false);
      (async () => {
        const done = await isDailyAlgoCleared(iso);
        if (active) setCleared(done);
      })();
      return () => {
        active = false;
      };
    }, [iso]),
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
    setCleared(true);
    setJustCleared(true);
    await markDailyAlgoCleared(iso);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      /* optional */
    }
  }

  const isToday = iso === today;

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>
            {isToday ? 'TODAY' : iso} · {lesson.tagLabel}
          </Text>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.summary}>{lesson.summary}</Text>
          <View style={styles.chips}>
            {cleared ? <XpChip label="CLEARED" tone="accent" /> : <XpChip label="OPEN" tone="xp" />}
            <XpChip label="1 DRILL" tone="warning" delayMs={60} />
          </View>
        </View>
      </FadeInUp>

      {justCleared ? (
        <FadeInUp delayMs={40} waitForLaunch={false}>
          <View style={styles.banner}>
            <Text style={styles.bannerKicker}>DAILY CLEARED</Text>
            <Text style={styles.bannerText}>
              Calendar day marked — keep the streak alive tomorrow.
            </Text>
          </View>
        </FadeInUp>
      ) : null}

      <FadeInUp delayMs={80} waitForLaunch={false}>
        <View style={styles.panel}>
          <Text style={styles.panelKicker}>SKILL CHECK</Text>
          <Text style={styles.prompt}>Solve today&apos;s instance of this algorithm.</Text>
          <LessonExercise exercises={drills} onAllCleared={onAllCleared} />
        </View>
      </FadeInUp>

      <FadeInUp delayMs={120} waitForLaunch={false}>
        <View style={styles.footer}>
          {cleared ? (
            <PrimaryButton
              label="Back to calendar"
              onPress={() => router.replace('/daily-algorithm')}
            />
          ) : (
            <PrimaryButton
              label="Calendar"
              variant="secondary"
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
