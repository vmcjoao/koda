import React, { useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
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
  /** Fired when the user scrolls near the bottom (ScrollView only). */
  onEndReached?: () => void;
  /** Distance from bottom (px) that triggers onEndReached. Default 240. */
  onEndReachedThreshold?: number;
};

export function Screen({
  children,
  scroll,
  style,
  contentStyle,
  refreshing,
  onRefresh,
  atmosphere = true,
  onEndReached,
  onEndReachedThreshold = 240,
}: Props) {
  const locked = useRef(false);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!onEndReached) return;
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distance = contentSize.height - (layoutMeasurement.height + contentOffset.y);
    if (distance < onEndReachedThreshold) {
      if (locked.current) return;
      locked.current = true;
      onEndReached();
    } else {
      locked.current = false;
    }
  }

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
          scrollEventThrottle={16}
          onScroll={onEndReached ? handleScroll : undefined}
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
