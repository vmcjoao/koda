import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MarkdownMath } from '@/components/MarkdownMath';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  markdown: string;
  /** Override auto height from content length. */
  minHeight?: number;
};

function autoMinHeight(markdown: string): number {
  return Math.min(480, Math.max(140, 90 + markdown.length * 0.42));
}

/** Lesson-style prose surface: bordered card + embedded KaTeX WebView. */
export function ProseCard({ markdown, minHeight }: Props) {
  const height = useMemo(
    () => minHeight ?? autoMinHeight(markdown),
    [markdown, minHeight],
  );

  return (
    <View style={styles.card}>
      <MarkdownMath markdown={markdown} minHeight={height} embedded />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
});
