import React from 'react';
import { ActivityIndicator, StyleSheet, Text, type ViewStyle } from 'react-native';
import { PressableScale } from '@/components/game/PressableScale';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      haptic={isPrimary ? 'medium' : 'light'}
      style={[
        styles.base,
        isPrimary && styles.primary,
        variant === 'secondary' && styles.secondary,
        isGhost && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.background : colors.accent} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary && styles.labelPrimary,
            !isPrimary && styles.labelSecondary,
          ]}
        >
          {label}
        </Text>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelPrimary: {
    color: colors.background,
  },
  labelSecondary: {
    color: colors.text,
  },
});
