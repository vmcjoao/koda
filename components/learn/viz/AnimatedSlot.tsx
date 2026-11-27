import React, { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const MOVE_MS = 340;
const EASE = Easing.out(Easing.cubic);

type SlotProps = {
  x: number;
  y: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Skip tween on first layout (default true). */
  snapFirst?: boolean;
};

/** Absolutely positioned cell that tweens between (x,y) targets. */
export function AnimatedSlot({ x, y, children, style, snapFirst = true }: SlotProps) {
  const tx = useSharedValue(x);
  const ty = useSharedValue(y);
  const first = useSharedValue(true);

  useEffect(() => {
    if (snapFirst && first.value) {
      tx.value = x;
      ty.value = y;
      first.value = false;
      return;
    }
    tx.value = withTiming(x, { duration: MOVE_MS, easing: EASE });
    ty.value = withTiming(y, { duration: MOVE_MS, easing: EASE });
  }, [x, y, snapFirst, tx, ty, first]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: 0, top: 0 }, animStyle, style]}>
      {children}
    </Animated.View>
  );
}

type PulseProps = {
  active: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Soft scale punch when `active` flips on (highlights, mid, new cell). */
export function PulseOnActive({ active, children, style }: PulseProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!active) return;
    scale.value = withSequence(
      withTiming(1.08, { duration: 120, easing: EASE }),
      withTiming(1, { duration: 200, easing: EASE }),
    );
  }, [active, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
}

/** Layout-friendly enter for growing rows (prefix, LIS, stack). */
export const vizEntering = FadeIn.duration(220);
export const vizExiting = FadeOut.duration(160);
export const vizLayout = LinearTransition.duration(MOVE_MS);

export const VIZ_MOVE_MS = MOVE_MS;
