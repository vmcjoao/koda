import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { XpChip } from '@/components/game/XpChip';
import { DailyAlgorithmCalendar } from '@/components/daily/DailyAlgorithmCalendar';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import {
  dailyAlgoStreak,
  isToday,
  lessonForDate,
} from '@/lib/dailyAlgorithm';
import { getClearedDailyAlgoDates } from '@/lib/dailyAlgorithmProgress';
import { todayIso } from '@/lib/habit';
import { colors, radii, spacing } from '@/constants/theme';

export default function DailyAlgorithmCalendarScreen() {
  const today = todayIso();
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [cleared, setCleared] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const dates = await getClearedDailyAlgoDates();
        if (active) setCleared(dates);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const todayLesson = lessonForDate(today);
  const todayDone = cleared.has(today);
  const streak = dailyAlgoStreak(cleared, today);
  const clearedThisMonth = useMemo(() => {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    let n = 0;
    for (const d of cleared) if (d.startsWith(prefix)) n += 1;
    return n;
  }, [cleared, year, monthIndex]);

  function shiftMonth(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
  }

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <Text style={styles.kicker}>DAILY ALGORITHM</Text>
        <Text style={styles.title}>Puzzle calendar</Text>
        <Text style={styles.sub}>
          One skill-check a day — like Duolingo Chess daily puzzles. Tap a day to play.
        </Text>
      </FadeInUp>

      <FadeInUp delayMs={60} waitForLaunch={false}>
        <View style={styles.statsRow}>
          <XpChip label={`${streak} DAY STREAK`} tone="accent" />
          <XpChip label={`${clearedThisMonth} THIS MONTH`} tone="xp" delayMs={60} />
        </View>
      </FadeInUp>

      <FadeInUp delayMs={100} waitForLaunch={false}>
        <PressableScale
          haptic="medium"
          style={[styles.todayCard, todayDone && styles.todayCardDone]}
          onPress={() => router.push(`/daily-algorithm/${today}`)}
        >
          <Text style={styles.todayKicker}>{todayDone ? 'TODAY · CLEARED' : 'TODAY\'S PUZZLE'}</Text>
          <Text style={styles.todayTitle}>{todayLesson?.title ?? 'Algorithm'}</Text>
          <Text style={styles.todaySub} numberOfLines={2}>
            {todayLesson?.summary ?? 'Open the calendar day to train.'}
          </Text>
          <Text style={styles.todayCta}>{todayDone ? 'Replay →' : 'Solve today →'}</Text>
        </PressableScale>
      </FadeInUp>

      <FadeInUp delayMs={140} waitForLaunch={false}>
        <DailyAlgorithmCalendar
          year={year}
          monthIndex={monthIndex}
          cleared={cleared}
          onPrevMonth={() => shiftMonth(-1)}
          onNextMonth={() => shiftMonth(1)}
          onSelectDate={(iso) => {
            if (isToday(iso) || iso <= today) router.push(`/daily-algorithm/${iso}`);
          }}
        />
      </FadeInUp>

      <FadeInUp delayMs={200} waitForLaunch={false}>
        <PrimaryButton
          label="Back to run"
          variant="ghost"
          onPress={() => router.back()}
          style={styles.back}
        />
      </FadeInUp>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.sm,
  },
  todayCard: {
    backgroundColor: colors.chipSelected,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    gap: 4,
    marginBottom: spacing.md,
  },
  todayCardDone: {
    borderColor: colors.accentDim,
  },
  todayKicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  todayTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  todaySub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  todayCta: {
    color: colors.radar,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  back: { marginTop: spacing.md, marginBottom: spacing.xl },
});
