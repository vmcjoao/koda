import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

type Size = 'sm' | 'md' | 'lg' | 'hero';

const SIZES: Record<
  Size,
  { k: number; font: number; gap: number; odaNudge: number; weight: TextStyle['fontWeight'] }
> = {
  // odaNudge pushes “oda” down to sit on the graph-k optical baseline (not the tall glyph center)
  sm: { k: 18, font: 20, gap: 2, odaNudge: 4, weight: '700' },
  md: { k: 22, font: 26, gap: 3, odaNudge: 5, weight: '700' },
  lg: { k: 28, font: 34, gap: 3, odaNudge: 7, weight: '800' },
  hero: { k: 36, font: 40, gap: 3, odaNudge: 9, weight: '800' },
};

const CENTER = { x: 28, y: 72 };
const TOP = { x: 28, y: 18 };
const NE = { x: 78, y: 30 };
const SE = { x: 78, y: 120 };

const SPRING = { damping: 13, stiffness: 88, mass: 0.85 };
const STAGGER = 140;

/** Graph-like lowercase k: stem + two branches as nodes/edges. */
export function GraphK({
  size = 40,
  color = colors.accent,
  animateOnPress = false,
}: {
  size?: number;
  color?: string;
  /** Replay the launch mitosis on the in-place mark (no fullscreen overlay). */
  animateOnPress?: boolean;
}) {
  const stroke = 11;
  const r = 12;

  const splitTop = useSharedValue(1);
  const splitNe = useSharedValue(1);
  const splitSe = useSharedValue(1);
  const centerPulse = useSharedValue(1);
  const busy = useSharedValue(0);

  const replay = useCallback(() => {
    if (!animateOnPress) return;
    if (busy.value) return;
    busy.value = 1;

    cancelAnimation(splitTop);
    cancelAnimation(splitNe);
    cancelAnimation(splitSe);
    cancelAnimation(centerPulse);

    const collapse = withTiming(0, { duration: 160, easing: Easing.in(Easing.cubic) });
    // Hold briefly at center, then peel out top → NE → SE (overlapping).
    const hold = 120;

    splitTop.value = withSequence(collapse, withDelay(hold, withSpring(1, SPRING)));
    splitNe.value = withSequence(
      collapse,
      withDelay(hold + STAGGER, withSpring(1, SPRING)),
    );
    splitSe.value = withSequence(
      collapse,
      withDelay(
        hold + STAGGER * 2,
        withSpring(1, SPRING, (done) => {
          if (done) busy.value = 0;
        }),
      ),
    );

    centerPulse.value = withDelay(
      80,
      withSequence(
        withTiming(1.28, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 160 }),
      ),
    );
  }, [animateOnPress, busy, centerPulse, splitNe, splitSe, splitTop]);

  const topProps = useAnimatedProps(() => {
    const t = splitTop.value;
    return {
      cx: CENTER.x + (TOP.x - CENTER.x) * t,
      cy: CENTER.y + (TOP.y - CENTER.y) * t,
      opacity: Math.min(1, 0.2 + t * 0.8),
    };
  });

  const neProps = useAnimatedProps(() => {
    const t = splitNe.value;
    return {
      cx: CENTER.x + (NE.x - CENTER.x) * t,
      cy: CENTER.y + (NE.y - CENTER.y) * t,
      opacity: Math.min(1, 0.2 + t * 0.8),
    };
  });

  const seProps = useAnimatedProps(() => {
    const t = splitSe.value;
    return {
      cx: CENTER.x + (SE.x - CENTER.x) * t,
      cy: CENTER.y + (SE.y - CENTER.y) * t,
      opacity: Math.min(1, 0.2 + t * 0.8),
    };
  });

  const centerProps = useAnimatedProps(() => ({
    cx: CENTER.x,
    cy: CENTER.y,
    r: r * centerPulse.value,
  }));

  const stemProps = useAnimatedProps(() => {
    const t = splitTop.value;
    return {
      x1: CENTER.x,
      y1: CENTER.y,
      x2: CENTER.x + (TOP.x - CENTER.x) * t,
      y2: CENTER.y + (TOP.y - CENTER.y) * t,
      strokeOpacity: Math.min(1, t),
    };
  });

  const neLineProps = useAnimatedProps(() => {
    const t = splitNe.value;
    return {
      x1: CENTER.x,
      y1: CENTER.y,
      x2: CENTER.x + (NE.x - CENTER.x) * t,
      y2: CENTER.y + (NE.y - CENTER.y) * t,
      strokeOpacity: Math.min(1, t),
    };
  });

  const seLineProps = useAnimatedProps(() => {
    const t = splitSe.value;
    return {
      x1: CENTER.x,
      y1: CENTER.y,
      x2: CENTER.x + (SE.x - CENTER.x) * t,
      y2: CENTER.y + (SE.y - CENTER.y) * t,
      strokeOpacity: Math.min(1, t),
    };
  });

  // Static mark when interaction is off (login / tips / etc.).
  if (!animateOnPress) {
    return (
      <Svg width={size} height={size * 1.4} viewBox="0 0 100 140" accessibilityLabel="k">
        <Line
          x1={28}
          y1={18}
          x2={28}
          y2={72}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <Line
          x1={28}
          y1={72}
          x2={78}
          y2={30}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <Line
          x1={28}
          y1={72}
          x2={78}
          y2={120}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <Circle cx={28} cy={18} r={r} fill={color} />
        <Circle cx={28} cy={72} r={r} fill={color} />
        <Circle cx={78} cy={30} r={r} fill={color} />
        <Circle cx={78} cy={120} r={r} fill={color} />
      </Svg>
    );
  }

  return (
    <Pressable
      onPress={replay}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Replay Koda mark animation"
    >
      <Svg width={size} height={size * 1.4} viewBox="0 0 100 140">
        <AnimatedLine
          animatedProps={stemProps}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <AnimatedLine
          animatedProps={neLineProps}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <AnimatedLine
          animatedProps={seLineProps}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <AnimatedCircle animatedProps={topProps} r={r} fill={color} />
        <AnimatedCircle animatedProps={neProps} r={r} fill={color} />
        <AnimatedCircle animatedProps={seProps} r={r} fill={color} />
        <AnimatedCircle animatedProps={centerProps} fill={color} />
      </Svg>
    </Pressable>
  );
}

type Props = {
  size?: Size;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** When true, tapping the graph-K replays the mitosis animation in place. */
  animateKOnPress?: boolean;
};

/** Wordmark: graph-K mark + “oda”. */
export function BrandWordmark({
  size = 'md',
  color = colors.accent,
  textColor = colors.accent,
  style,
  textStyle,
  animateKOnPress = false,
}: Props) {
  const s = SIZES[size];
  return (
    <View
      style={[styles.row, { gap: s.gap }, style]}
      accessibilityRole="header"
      accessibilityLabel="Koda"
    >
      <GraphK size={s.k} color={color} animateOnPress={animateKOnPress} />
      <Text
        style={[
          styles.oda,
          {
            fontSize: s.font,
            fontWeight: s.weight,
            color: textColor,
            lineHeight: s.font * 1.15,
            letterSpacing: size === 'hero' ? 1.5 : 0.5,
            transform: [{ translateY: s.odaNudge }],
          },
          textStyle,
        ]}
      >
        oda
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oda: {
    includeFontPadding: false,
  },
});
