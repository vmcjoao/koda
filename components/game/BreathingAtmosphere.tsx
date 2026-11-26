import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

/** Slow drifting mint / gold washes behind screen content. */
export function BreathingAtmosphere() {
  const a = useSharedValue(0);
  const b = useSharedValue(0);

  useEffect(() => {
    a.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    b.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 6800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [a, b]);

  const blobA = useAnimatedStyle(() => ({
    opacity: 0.55 + a.value * 0.45,
    transform: [
      { translateY: a.value * 18 },
      { translateX: a.value * 10 },
      { scale: 1 + a.value * 0.08 },
    ],
  }));

  const blobB = useAnimatedStyle(() => ({
    opacity: 0.35 + b.value * 0.4,
    transform: [
      { translateY: -b.value * 14 },
      { translateX: -b.value * 12 },
      { scale: 1 + b.value * 0.1 },
    ],
  }));

  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.blobA, blobA]} />
      <Animated.View pointerEvents="none" style={[styles.blobB, blobB]} />
    </>
  );
}

const styles = StyleSheet.create({
  blobA: {
    position: 'absolute',
    top: -80,
    left: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.atmosphere,
  },
  blobB: {
    position: 'absolute',
    top: 120,
    right: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.atmosphereBoss,
  },
});
