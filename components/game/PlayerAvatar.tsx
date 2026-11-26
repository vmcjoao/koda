import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { getAvatarPreset, initialsFromName } from '@/lib/avatar';
import { colors } from '@/constants/theme';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  avatarId?: string | null;
  displayName?: string | null;
  size?: Size;
  /** Show initials under/instead of glyph when true — default glyph only */
  showInitials?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZE_PX: Record<Size, number> = { sm: 36, md: 52, lg: 88 };
const GLYPH: Record<Size, number> = { sm: 16, md: 22, lg: 36 };
const INITIALS: Record<Size, number> = { sm: 9, md: 11, lg: 13 };

export function PlayerAvatar({
  avatarId,
  displayName,
  size = 'md',
  showInitials = false,
  style,
}: Props) {
  const preset = getAvatarPreset(avatarId);
  const px = SIZE_PX[size];

  return (
    <View
      style={[
        styles.wrap,
        {
          width: px,
          height: px,
          borderRadius: px / 2,
          borderColor: preset.color,
          backgroundColor: `${preset.color}22`,
        },
        style,
      ]}
    >
      <Text style={[styles.glyph, { fontSize: GLYPH[size], color: preset.color }]}>
        {preset.glyph}
      </Text>
      {showInitials ? (
        <Text style={[styles.initials, { fontSize: INITIALS[size] }]}>
          {initialsFromName(displayName)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  glyph: {
    fontWeight: '800',
  },
  initials: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
