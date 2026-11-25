import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing } from '@/constants/theme';

const SYMBOLS = ['→', '∞', '≤', '≥', '≠', '∑', '∈', '[]', 'dp[i]', 'for', 'while', 'if', 'O(N)', 'mod'];

type Props = {
  onInsert: (symbol: string) => void;
};

export function SymbolBar({ onInsert }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {SYMBOLS.map((s) => (
        <Pressable key={s} onPress={() => onInsert(s)} style={styles.chip}>
          <Text style={styles.text}>{s}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
});
