import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { colors, radii, spacing } from '@/constants/theme';
import {
  plainStatement,
  statementHasFigures,
  statementToHtml,
} from '@/lib/statementRender';

type Props = {
  markdown: string;
  /** Seed height before content reports its size. */
  minHeight?: number;
  /**
   * Fit a parent ProseCard: 100% width, no extra border / plain-text link.
   * Height grows to content so the page ScrollView is the only scroller.
   */
  embedded?: boolean;
};

/** Safety valve — absurdly long statements still get an inner scroll. */
const MAX_AUTO_HEIGHT = 2400;

/** @deprecated use plainStatement — kept for call sites / tests */
export function plainMath(markdown: string): string {
  return plainStatement(markdown);
}

export function MarkdownMath({ markdown, minHeight = 120, embedded = false }: Props) {
  const { width } = useWindowDimensions();
  const html = useMemo(() => statementToHtml(markdown), [markdown]);
  const fallback = useMemo(() => plainStatement(markdown), [markdown]);
  const [useFallback, setUseFallback] = useState(false);
  const tall = statementHasFigures(markdown);
  const seed = Math.max(minHeight, tall ? 200 : minHeight);
  const [height, setHeight] = useState(seed);

  useEffect(() => {
    setHeight(seed);
    setUseFallback(false);
  }, [markdown, seed]);

  function onMessage(e: WebViewMessageEvent) {
    try {
      const data = JSON.parse(e.nativeEvent.data) as { type?: string; height?: number };
      if (data.type === 'height' && typeof data.height === 'number' && data.height > 0) {
        setHeight(Math.min(MAX_AUTO_HEIGHT, Math.max(seed, Math.ceil(data.height))));
      }
    } catch {
      /* ignore */
    }
  }

  if (useFallback) {
    return (
      <View
        style={[
          styles.wrap,
          styles.fallbackBox,
          embedded ? styles.embedded : { width: width - 32 },
        ]}
      >
        <Text style={styles.fallbackText}>{fallback}</Text>
        <Pressable onPress={() => setUseFallback(false)}>
          <Text style={styles.toggle}>Try rich view again</Text>
        </Pressable>
      </View>
    );
  }

  const capped = height >= MAX_AUTO_HEIGHT;

  return (
    <View
      style={[
        styles.wrap,
        embedded ? styles.embedded : { width: width - 32 },
        { height },
      ]}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={[styles.web, { height, backgroundColor: colors.surface }]}
        scrollEnabled={capped}
        nestedScrollEnabled={capped}
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
        onMessage={onMessage}
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
    width: '100%',
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
