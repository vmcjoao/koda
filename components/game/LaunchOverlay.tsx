import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BrandWordmark } from '@/components/BrandWordmark';
import { colors, spacing } from '@/constants/theme';

type Props = {
  onFinished?: () => void;
};

/**
 * Post-splash brand beat — mint wash + wordmark spring, then fades into the app.
 * Mount once after fonts are ready.
 */
export function LaunchOverlay({ onFinished }: Props) {
  const [visible, setVisible] = useState(true);
  const rootOpacity = useSharedValue(1);
  const markScale = useSharedValue(0.72);
  const markOpacity = useSharedValue(0);
  const tagOpacity = useSharedValue(0);
  const wash = useSharedValue(0);

  useEffect(() => {
    wash.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    markOpacity.value = withTiming(1, { duration: 280 });
    markScale.value = withSpring(1, { damping: 12, stiffness: 160 });
    tagOpacity.value = withDelay(280, withTiming(1, { duration: 320 }));

    rootOpacity.value = withDelay(
      900,
      withTiming(0, { duration: 420, easing: Easing.inOut(Easing.cubic) }, (done) => {
        if (done) {
          runOnJS(setVisible)(false);
          if (onFinished) runOnJS(onFinished)();
        }
      }),
    );
  }, [markOpacity, markScale, onFinished, rootOpacity, tagOpacity, wash]);

  const rootStyle = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
  }));

  const washStyle = useAnimatedStyle(() => ({
    opacity: wash.value * 0.9,
    transform: [{ scale: 0.85 + wash.value * 0.25 }],
  }));

  const markStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{ scale: markScale.value }],
  }));

  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
    transform: [{ translateY: (1 - tagOpacity.value) * 8 }],
  }));

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.root, rootStyle]}>
      <Animated.View style={[styles.wash, washStyle]} />
      <Animated.View style={[styles.washSecondary, washStyle]} />
      <View style={styles.center}>
        <Animated.View style={markStyle}>
          <BrandWordmark size="hero" />
        </Animated.View>
        <Animated.View style={tagStyle}>
          <Text style={styles.tag}>Clear the run</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wash: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.atmosphere,
    top: '28%',
  },
  washSecondary: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.atmosphereBoss,
    bottom: '22%',
    right: '12%',
  },
  center: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  tag: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});
