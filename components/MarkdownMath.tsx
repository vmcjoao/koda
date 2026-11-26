import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, radii, spacing } from '@/constants/theme';
import {
  plainStatement,
  statementHasFigures,
  statementToHtml,
} from '@/lib/statementRender';

type Props = {
  markdown: string;
  minHeight?: number;
  /**
   * Fit a parent card (lessons): 100% width, no extra border.
   * Keeps KaTeX WebView with inner scroll — does not auto-resize height
   * (that path blanked content on some devices).
   */
  embedded?: boolean;
};

/** @deprecated use plainStatement — kept for call sites / tests */
export function plainMath(markdown: string): string {
  return plainStatement(markdown);
}

export function MarkdownMath({ markdown, minHeight = 160, embedded = false }: Props) {
  const { width } = useWindowDimensions();
  const html = useMemo(() => statementToHtml(markdown), [markdown]);
  const fallback = useMemo(() => plainStatement(markdown), [markdown]);
  const [useFallback, setUseFallback] = useState(false);
  const tall = statementHasFigures(markdown);
  const height = Math.max(minHeight, tall ? 280 : minHeight);

  if (useFallback) {
    return (
      <View
        style={[
          styles.wrap,
          styles.fallbackBox,
          embedded ? styles.embedded : { width: width - 32 },
          { minHeight: height },
        ]}
      >
        <Text style={styles.fallbackText}>{fallback}</Text>
        <Pressable onPress={() => setUseFallback(false)}>
          <Text style={styles.toggle}>Try rich view again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        embedded ? styles.embedded : { width: width - 32 },
        { minHeight: height },
      ]}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={[styles.web, { minHeight: height, backgroundColor: colors.surface }]}
        scrollEnabled
        nestedScrollEnabled
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
        onError={() => setUseFallback(true)}
        onHttpError={() => setUseFallback(true)}
      />
      {!embedded ? (
        <Pressable onPress={() => setUseFallback(true)} style={styles.fallbackLink}>
          <Text style={styles.toggle}>Plain text (offline)</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  embedded: {
    alignSelf: 'stretch',
    width: '100%',
    borderWidth: 0,
    borderRadius: 0,
  },
  web: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  fallbackBox: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  fallbackText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'SpaceMono',
  },
  fallbackLink: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-end',
  },
  toggle: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '600',
  },
});
