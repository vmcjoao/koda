import React, { useEffect, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

type Props = {
  value: number;
  durationMs?: number;
  suffix?: string;
  prefix?: string;
  style?: StyleProp<TextStyle>;
  decimals?: number;
};

/** Count-up number for XP / score. */
export function AnimatedNumber({
  value,
  durationMs = 700,
  suffix = '',
  prefix = '',
  style,
  decimals = 0,
}: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : `${Math.round(display)}`;

  return (
    <Text style={style}>
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
}
