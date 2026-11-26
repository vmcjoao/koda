import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '@/constants/theme';

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

/** Graph-like lowercase k: stem + two branches as nodes/edges. */
export function GraphK({
  size = 40,
  color = colors.accent,
}: {
  size?: number;
  color?: string;
}) {
  // viewBox matches geometric draft: 100 x 140
  const stroke = 11;
  const r = 12;
  return (
    <Svg width={size} height={size * 1.4} viewBox="0 0 100 140" accessibilityLabel="k">
      <Line x1={28} y1={18} x2={28} y2={72} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <Line x1={28} y1={72} x2={78} y2={30} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <Line x1={28} y1={72} x2={78} y2={120} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <Circle cx={28} cy={18} r={r} fill={color} />
      <Circle cx={28} cy={72} r={r} fill={color} />
      <Circle cx={78} cy={30} r={r} fill={color} />
      <Circle cx={78} cy={120} r={r} fill={color} />
    </Svg>
  );
}

type Props = {
  size?: Size;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/** Wordmark: graph-K mark + “oda”. */
export function BrandWordmark({
  size = 'md',
  color = colors.accent,
  textColor = colors.accent,
  style,
  textStyle,
}: Props) {
  const s = SIZES[size];
  return (
    <View style={[styles.row, { gap: s.gap }, style]} accessibilityRole="header" accessibilityLabel="Koda">
      <GraphK size={s.k} color={color} />
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
