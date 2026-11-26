import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BreathingAtmosphere } from '@/components/game/BreathingAtmosphere';
import { colors, spacing } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Soft mint wash behind content (default on). */
  atmosphere?: boolean;
};

export function Screen({
  children,
  scroll,
  style,
  contentStyle,
  refreshing,
  onRefresh,
  atmosphere = true,
}: Props) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
        {atmosphere ? (
          <View pointerEvents="none" style={styles.atmosphereRoot}>
            <BreathingAtmosphere />
          </View>
        ) : null}
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
                colors={[colors.accent]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
      {atmosphere ? (
        <View pointerEvents="none" style={styles.atmosphereRoot}>
          <BreathingAtmosphere />
        </View>
      ) : null}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  atmosphereRoot: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
});
