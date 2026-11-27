import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MarkdownMath } from '@/components/MarkdownMath';
import { colors, spacing } from '@/constants/theme';

type Props = {
  markdown: string;
  /** Optional seed height before the WebView reports content size. */
  minHeight?: number;
};

/**
 * Statement section that grows with content — page ScrollView is the only scroller
 * (WebView inner scroll only kicks in for extremely long statements).
 */
export function ProseCard({ markdown, minHeight = 80 }: Props) {
  return (
    <View style={styles.section}>
      <MarkdownMath markdown={markdown} minHeight={minHeight} embedded />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: 'stretch',
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
