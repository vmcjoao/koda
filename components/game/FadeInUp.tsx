import React, { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useLaunchReady } from '@/contexts/LaunchContext';

type Props = {
  children: React.ReactNode;
  delayMs?: number;
  durationMs?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
  /** Wait for boot overlay (default true). */
  waitForLaunch?: boolean;
};

/** Soft rise + fade for section entrances. */
export function FadeInUp({
  children,
  delayMs = 0,
  durationMs = 420,
  distance = 14,
  style,
  waitForLaunch = true,
}: Props) {
  const launchReady = useLaunchReady();
  const ready = !waitForLaunch || launchReady;
  const progress = useSharedValue(ready ? 0 : 0);

  useEffect(() => {
    if (!ready) {
      progress.value = 0;
      return;
    }
    progress.value = 0;
    progress.value = withDelay(
      delayMs,
      withTiming(1, { duration: durationMs, easing: Easing.out(Easing.cubic) }),
    );
  }, [delayMs, durationMs, progress, ready]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
}
