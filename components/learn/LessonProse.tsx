import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type Props = {
  markdown: string;
};

type Part = { text: string; bold?: boolean };

function parseInline(line: string): Part[] {
  const parts: Part[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push({ text: line.slice(last, m.index) });
    parts.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push({ text: line.slice(last) });
  return parts.length ? parts : [{ text: line }];
}

/**
 * Simple lesson markdown → native Text (no WebView).
 * Supports paragraphs, line breaks, and **bold**.
 */
export function LessonProse({ markdown }: Props) {
  const blocks = useMemo(() => {
    const normalized = markdown.replace(/\r\n/g, '\n').trim();
    return normalized.split(/\n\n+/).filter(Boolean);
  }, [markdown]);

  return (
    <View style={styles.wrap}>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        return (
          <Text key={i} style={styles.paragraph}>
            {lines.map((line, li) => (
              <React.Fragment key={li}>
                {li > 0 ? '\n' : null}
                {parseInline(line).map((p, pi) => (
                  <Text key={pi} style={p.bold ? styles.bold : undefined}>
                    {p.text}
                  </Text>
                ))}
              </React.Fragment>
            ))}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  paragraph: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 23,
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
});
