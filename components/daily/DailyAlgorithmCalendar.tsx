import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '@/components/game/PressableScale';
import {
  WEEKDAYS,
  isFutureDate,
  isToday,
  monthMatrix,
  monthTitle,
} from '@/lib/dailyAlgorithm';
import { todayIso } from '@/lib/habit';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  year: number;
  monthIndex: number; // 0-based
  cleared: Set<string>;
  onSelectDate: (iso: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function DailyAlgorithmCalendar({
  year,
  monthIndex,
  cleared,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const today = todayIso();
  const rows = useMemo(() => monthMatrix(year, monthIndex), [year, monthIndex]);
  const title = monthTitle(year, monthIndex);

  const canGoNext = useMemo(() => {
    const now = new Date();
    return year < now.getFullYear() || (year === now.getFullYear() && monthIndex < now.getMonth());
  }, [year, monthIndex]);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <PressableScale haptic="light" onPress={onPrevMonth} style={styles.chevBtn}>
          <Text style={styles.chev}>‹</Text>
        </PressableScale>
        <Text style={styles.title}>{title}</Text>
        <PressableScale
          haptic="light"
          disabled={!canGoNext}
          onPress={onNextMonth}
          style={[styles.chevBtn, !canGoNext && styles.chevDisabled]}
        >
          <Text style={[styles.chev, !canGoNext && styles.chevMuted]}>›</Text>
        </PressableScale>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={`${d}-${i}`} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {rows.map((row, ri) => (
          <View key={`r${ri}`} style={styles.row}>
            {row.map((iso, ci) => {
              if (!iso) return <View key={`e${ri}-${ci}`} style={styles.cell} />;

              const dayNum = Number(iso.slice(-2));
              const done = cleared.has(iso);
              const future = isFutureDate(iso, today);
              const todayCell = isToday(iso, today);
              const locked = future;

              return (
                <PressableScale
                  key={iso}
                  disabled={locked}
                  haptic={todayCell ? 'medium' : 'light'}
                  scaleTo={0.9}
                  onPress={() => onSelectDate(iso)}
                  style={styles.cell}
                >
                  <View
                    style={[
                      styles.day,
                      done && styles.dayDone,
                      todayCell && !done && styles.dayToday,
                      locked && styles.dayLocked,
                    ]}
                  >
                    {done ? (
                      <Text style={styles.check}>✓</Text>
                    ) : (
                      <Text
                        style={[
                          styles.dayNum,
                          todayCell && styles.dayNumToday,
                          locked && styles.dayNumLocked,
                        ]}
                      >
                        {dayNum}
                      </Text>
                    )}
                  </View>
                </PressableScale>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.dayDone]} />
          <Text style={styles.legendText}>Solved</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.dayToday]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.dayLocked]} />
          <Text style={styles.legendText}>Locked</Text>
        </View>
      </View>
    </View>
  );
}

const CELL = 44;

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
  },
  chevDisabled: { opacity: 0.35 },
  chev: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  chevMuted: { color: colors.textDim },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  weekday: {
    width: CELL,
    textAlign: 'center',
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
  },
  grid: { gap: 6 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: CELL,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayToday: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  dayLocked: {
    opacity: 0.35,
    backgroundColor: colors.runTrack,
  },
  dayNum: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  dayNumToday: { color: colors.accent },
  dayNumLocked: { color: colors.textDim },
  check: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '900',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    paddingTop: spacing.xs,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
