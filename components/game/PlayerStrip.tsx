import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedNumber } from '@/components/game/AnimatedNumber';
import { PlayerAvatar } from '@/components/game/PlayerAvatar';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  streak: number;
  xp: number;
  band: number;
  displayName?: string | null;
  avatarId?: string | null;
  onBandPress?: () => void;
  onProfilePress?: () => void;
};

export function PlayerStrip({
  streak,
  xp,
  band,
  displayName,
  avatarId,
  onBandPress,
  onProfilePress,
}: Props) {
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
    <View style={styles.wrap}>
      <Pressable style={styles.identity} onPress={onProfilePress}>
        <PlayerAvatar avatarId={avatarId} displayName={displayName} size="md" />
        <View style={styles.identityText}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName?.trim() || 'Coder'}
          </Text>
          <Text style={styles.nameHint}>Profile</Text>
        </View>
      </Pressable>
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
          <Text style={styles.bandValue}>{band}</Text>
          <Text style={styles.label}>Band ✎</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  identityText: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  nameHint: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  flame: {
    color: colors.warning,
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
    fontSize: 20,
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
