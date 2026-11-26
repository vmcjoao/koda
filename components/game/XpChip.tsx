import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  label: string;
  tone?: 'xp' | 'accent' | 'warning';
  delayMs?: number;
};

export function XpChip({ label, tone = 'xp', delayMs = 0 }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(delayMs, withTiming(1, { duration: 280 }));
    scale.value = withDelay(delayMs, withSpring(1, { damping: 12, stiffness: 220 }));
    translateY.value = withDelay(delayMs, withSpring(0, { damping: 14, stiffness: 200 }));
  }, [delayMs, label, opacity, scale, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const border =
    tone === 'accent' ? colors.accentDim : tone === 'warning' ? colors.warning : colors.xp;
  const color =
    tone === 'accent' ? colors.accent : tone === 'warning' ? colors.warning : colors.xp;

  return (
    <Animated.View style={[styles.chip, { borderColor: border }, style]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
});
