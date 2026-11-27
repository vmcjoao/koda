import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, spacing } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Optional secondary action under the primary (e.g. Skip). */
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  secondaryDisabled?: boolean;
};

/** Sticky bottom CTA bar for problem-flow continue actions. */
export function FloatingCta({
  label,
  onPress,
  disabled,
  loading,
  secondaryLabel,
  onSecondaryPress,
  secondaryDisabled,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <PrimaryButton label={label} onPress={onPress} disabled={disabled} loading={loading} />
      {secondaryLabel && onSecondaryPress ? (
        <PrimaryButton
          label={secondaryLabel}
          variant="secondary"
          onPress={onSecondaryPress}
          disabled={secondaryDisabled}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
});
