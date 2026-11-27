import React from 'react';
import { Linking, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors, spacing } from '@/constants/theme';

export const GITHUB_HANDLE = 'vmcjoao';
export const GITHUB_URL = `https://github.com/${GITHUB_HANDLE}`;

type Props = {
  style?: StyleProp<ViewStyle>;
  /** Larger / brighter for the launch overlay. */
  tone?: 'muted' | 'launch';
};

export function GithubCredit({ style, tone = 'muted' }: Props) {
  const launch = tone === 'launch';
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`GitHub ${GITHUB_HANDLE}`}
      onPress={() => Linking.openURL(GITHUB_URL)}
      hitSlop={12}
      style={[styles.row, style]}
    >
      <FontAwesome
        name="github"
        size={launch ? 18 : 14}
        color={launch ? colors.textMuted : colors.textDim}
      />
      <Text style={[styles.handle, launch && styles.handleLaunch]}>{GITHUB_HANDLE}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  handle: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  handleLaunch: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
});
