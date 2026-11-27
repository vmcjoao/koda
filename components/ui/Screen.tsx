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
import { GithubCredit } from '@/components/GithubCredit';
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
  /** Hide the scroll-end GitHub credit. Default false on scroll screens. */
  hideCredit?: boolean;
  /** Sticky footer outside the ScrollView (e.g. floating continue CTA). */
  footer?: React.ReactNode;
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
  hideCredit = false,
  footer,
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

  const atmosphereNode = atmosphere ? (
    <View pointerEvents="none" style={styles.atmosphereRoot}>
      <BreathingAtmosphere />
    </View>
  ) : null;

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
        {atmosphereNode}
        <ScrollView
          contentContainerStyle={[
            styles.content,
            footer ? styles.contentWithFooter : null,
            contentStyle,
          ]}
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
          {!hideCredit ? <GithubCredit style={styles.credit} /> : null}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
      {atmosphereNode}
      <View style={[styles.content, contentStyle]}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
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
  contentWithFooter: {
    paddingBottom: spacing.xl,
  },
  footer: {
    backgroundColor: colors.background,
  },
  atmosphereRoot: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  credit: {
    marginTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
