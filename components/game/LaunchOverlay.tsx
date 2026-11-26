import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
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

type Props = {
  onFinished?: () => void;
};

/** Final graph-K geometry (viewBox 100×140). */
const CENTER = { x: 28, y: 72 };
const TOP = { x: 28, y: 18 };
const NE = { x: 78, y: 30 };
const SE = { x: 78, y: 120 };

const K_SIZE = 108;
const ODA_FONT = 86;
const GAP = 6;

/**
 * Boot logo: center vertex mitoses into the graph-K, then the mark slides left
 * just enough for the full “koda” to sit on the screen center.
 */
export function LaunchOverlay({ onFinished }: Props) {
  const { width: screenW } = useWindowDimensions();
  const [visible, setVisible] = useState(true);
  const [odaW, setOdaW] = useState(0);

  const rootOpacity = useSharedValue(1);
  const wash = useSharedValue(0);
  /** Staggered mitosis: NE → top → SE (each starts before the previous finishes). */
  const splitTop = useSharedValue(0);
  const splitNe = useSharedValue(0);
  const splitSe = useSharedValue(0);
  const centerPulse = useSharedValue(1);
  const reveal = useSharedValue(0);
  const odaWidthSV = useSharedValue(0);

  useEffect(() => {
    odaWidthSV.value = odaW;
  }, [odaW, odaWidthSV]);

  useEffect(() => {
    const spring = { damping: 13, stiffness: 88, mass: 0.85 };
    /** Overlap: next vertex begins ~140ms after the previous starts. */
    const stagger = 140;
    const splitStart = 400;

    wash.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });

    centerPulse.value = withSequence(
      withTiming(1.28, { duration: 240, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 180 }),
    );

    // Order 2-1-3: top-right, then top, then bottom-right.
    splitNe.value = withDelay(splitStart, withSpring(1, spring));
    splitTop.value = withDelay(splitStart + stagger, withSpring(1, spring));
    splitSe.value = withDelay(splitStart + stagger * 2, withSpring(1, spring));

    reveal.value = withDelay(
      1180,
      withTiming(1, { duration: 560, easing: Easing.out(Easing.cubic) }),
    );

    rootOpacity.value = withDelay(
      2050,
      withTiming(0, { duration: 400, easing: Easing.inOut(Easing.cubic) }, (done) => {
        if (done) {
          runOnJS(setVisible)(false);
          if (onFinished) runOnJS(onFinished)();
        }
      }),
    );
  }, [centerPulse, onFinished, reveal, rootOpacity, splitNe, splitSe, splitTop, wash]);

  const rootStyle = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
  }));

  const washStyle = useAnimatedStyle(() => ({
    opacity: wash.value * 0.85,
    transform: [{ scale: 0.88 + wash.value * 0.2 }],
  }));

  /**
   * Absolute left edge:
   *  t=0 → K alone centered: (screenW - K_SIZE) / 2
   *  t=1 → full koda centered: (screenW - K_SIZE - GAP - odaW) / 2
   */
  const markStyle = useAnimatedStyle(() => {
    const ow = odaWidthSV.value;
    const startLeft = (screenW - K_SIZE) / 2;
    const endLeft = (screenW - K_SIZE - GAP - ow) / 2;
    return {
      left: interpolate(reveal.value, [0, 1], [startLeft, endLeft]),
    };
  });

  const odaBoxStyle = useAnimatedStyle(() => {
    const ow = odaWidthSV.value;
    return {
      width: interpolate(reveal.value, [0, 1], [0, ow || 0]),
      opacity: ow > 0 ? reveal.value : 0,
    };
  });

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
    r: 12 * centerPulse.value,
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

  if (!visible) return null;

  const stroke = 11;
  const r = 12;
  const color = colors.accent;

  return (
    <Animated.View pointerEvents="none" style={[styles.root, rootStyle]}>
      <Animated.View style={[styles.wash, washStyle]} />
      <Animated.View style={[styles.washSecondary, washStyle]} />

      {/* Invisible measurer — real “oda” width for true centering */}
      <Text
        style={styles.odaMeasure}
        onLayout={(e) => setOdaW(e.nativeEvent.layout.width)}
      >
        oda
      </Text>

      <Animated.View style={[styles.mark, markStyle]} accessibilityLabel="Koda">
        <Svg width={K_SIZE} height={K_SIZE * 1.4} viewBox="0 0 100 140">
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

        <Animated.View style={[styles.odaBox, odaBoxStyle]}>
          {/* Full-width text; parent clips — no numberOfLines (avoids “…” ellipsis). */}
          <Text style={[styles.oda, odaW > 0 && { width: odaW }]}>oda</Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    zIndex: 100,
  },
  wash: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    width: 420,
    height: 420,
    marginTop: -210,
    borderRadius: 210,
    backgroundColor: colors.atmosphere,
  },
  washSecondary: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.atmosphereBoss,
    bottom: '22%',
    right: '6%',
  },
  mark: {
    position: 'absolute',
    top: '50%',
    marginTop: -(K_SIZE * 1.4) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
  },
  odaBox: {
    overflow: 'hidden',
    height: ODA_FONT * 1.2,
    justifyContent: 'center',
  },
  oda: {
    color: colors.accent,
    fontSize: ODA_FONT,
    fontWeight: '800',
    letterSpacing: 2,
    includeFontPadding: false,
    lineHeight: ODA_FONT * 1.12,
  },
  odaMeasure: {
    position: 'absolute',
    opacity: 0,
    fontSize: ODA_FONT,
    fontWeight: '800',
    letterSpacing: 2,
    includeFontPadding: false,
  },
});
