import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedNumber } from '@/components/game/AnimatedNumber';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  streak: number;
  xp: number;
  band: number;
  onBandPress?: () => void;
};

export function PlayerStrip({ streak, xp, band, onBandPress }: Props) {
  const streakPulse = useSharedValue(1);

  useEffect(() => {
    if (streak <= 0) return;
    streakPulse.value = withSequence(
      withTiming(1.08, { duration: 180 }),
      withTiming(1, { duration: 220 }),
    );
  }, [streak, streakPulse]);

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakPulse.value }],
  }));

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.cell, styles.streakCell, streakStyle]}>
        <Text style={styles.flame}>{streak > 0 ? '◆' : '◇'}</Text>
        <Text style={styles.value}>{streak}d</Text>
        <Text style={styles.label}>Streak</Text>
      </Animated.View>

      <View style={[styles.cell, styles.xpCell]}>
        <AnimatedNumber value={xp} style={styles.valueXp} />
        <Text style={styles.label}>XP</Text>
      </View>

      <Pressable style={[styles.cell, styles.bandCell]} onPress={onBandPress}>
        <Text style={styles.bandMark}>◎</Text>
        <Text style={styles.bandValue}>{band}</Text>
        <Text style={styles.label}>Band ✎</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    gap: 2,
  },
  streakCell: {
    backgroundColor: colors.surface,
    borderColor: colors.warning,
  },
  xpCell: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.xp,
    flex: 1.15,
  },
  bandCell: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.radar,
  },
  flame: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '900',
  },
  bandMark: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '900',
  },
  value: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  valueXp: {
    color: colors.xp,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  bandValue: {
    color: colors.radar,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  label: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
