import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ArrayDemo } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

/** Frames: start + one per prime p with p² ≤ N + final. */
export function sieveFrameCount(demo: ArrayDemo): number {
  const n = Math.max(2, Math.min(28, demo.target ?? demo.values[0] ?? 20));
  let frames = 2; // start + done
  const prime = Array(n + 1).fill(true);
  prime[0] = prime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!prime[p]) continue;
    frames += 1;
    for (let j = p * p; j <= n; j += p) prime[j] = false;
  }
  return frames;
}

export function SieveViz({ demo, step }: { demo: ArrayDemo; step: number }) {
  const n = Math.max(2, Math.min(28, demo.target ?? demo.values[0] ?? 20));

  const frames = useMemo(() => {
    const prime = Array(n + 1).fill(true);
    prime[0] = prime[1] = false;
    const out: { prime: boolean[]; focus: number; label: string }[] = [
      { prime: [...prime], focus: -1, label: 'start · 0,1 not prime' },
    ];
    for (let p = 2; p * p <= n; p++) {
      if (!prime[p]) continue;
      for (let j = p * p; j <= n; j += p) prime[j] = false;
      out.push({
        prime: [...prime],
        focus: p,
        label: `p=${p} · mark multiples from ${p * p}`,
      });
    }
    out.push({ prime: [...prime], focus: -1, label: 'done · primes remain' });
    return out;
  }, [n]);

  const frame = frames[Math.min(Math.max(0, step), frames.length - 1)]!;
  const primesLeft = frame.prime.reduce((a, p, i) => a + (i >= 2 && p ? 1 : 0), 0);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        Sieve ≤ {n} · {frame.label} · {primesLeft} primes
      </Text>
      <View style={styles.row}>
        {frame.prime.map((isPrime, i) => {
          if (i === 0) return null;
          const isFocus = i === frame.focus;
          const marked = i > 1 && !isPrime;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                isPrime && i > 1 && styles.prime,
                marked && styles.composite,
                isFocus && styles.focus,
              ]}
            >
              <Text
                style={[
                  styles.val,
                  isPrime && i > 1 && styles.valPrime,
                  marked && styles.valComp,
                ]}
              >
                {i}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: '100%', alignItems: 'center' },
  meta: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: {
    minWidth: 28,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  prime: { borderColor: colors.accent, backgroundColor: colors.chipSelected },
  composite: { opacity: 0.4, borderColor: colors.textDim },
  focus: { borderColor: colors.warning, borderWidth: 2 },
  val: { color: colors.text, fontFamily: 'SpaceMono', fontWeight: '700', fontSize: 12 },
  valPrime: { color: colors.accent },
  valComp: { color: colors.textDim, textDecorationLine: 'line-through' },
});
