import React, { useCallback } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  haptic?: boolean | 'light' | 'medium';
  scaleTo?: number;
};

export function PressableScale({
  children,
  style,
  onPressIn,
  onPressOut,
  onPress,
  haptic = 'light',
  scaleTo = 0.97,
  disabled,
  ...rest
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      scale.value = withSpring(scaleTo, { damping: 18, stiffness: 420 });
      onPressIn?.(e);
    },
    [onPressIn, scale, scaleTo],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      scale.value = withSpring(1, { damping: 14, stiffness: 320 });
      onPressOut?.(e);
    },
    [onPressOut, scale],
  );

  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (haptic && !disabled) {
        const style =
          haptic === 'medium'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light;
        Haptics.impactAsync(style).catch(() => {});
      }
      onPress?.(e);
    },
    [disabled, haptic, onPress],
  );

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
