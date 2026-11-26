import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { codeBaseStyle, highlightCpp } from '@/lib/cppHighlight';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = 'cpp' }: Props) {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlightCpp(code, language), [code, language]);

  async function onCopy() {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.lang}>{language}</Text>
        <PrimaryButton
          label={copied ? 'Copied' : 'Copy'}
          variant="secondary"
          onPress={onCopy}
          style={styles.copyBtn}
        />
      </View>
      <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}>
        <Text style={styles.code} selectable>
          {highlighted}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lang: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  copyBtn: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  code: {
    ...codeBaseStyle,
    padding: spacing.md,
  },
});
