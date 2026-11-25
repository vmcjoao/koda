import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '@/constants/theme';

type Props = {
  markdown: string;
  minHeight?: number;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Lightweight markdown → HTML with KaTeX for $...$ / $$...$$ */
function toHtml(markdown: string): string {
  let body = escapeHtml(markdown);

  // Fenced-ish paragraphs
  body = body.replace(/\n\n+/g, '</p><p>');
  body = body.replace(/\n/g, '<br/>');

  // Display math $$...$$
  body = body.replace(/\$\$([^$]+)\$\$/g, (_m, tex: string) => {
    return `<div class="math">\\[${tex.trim()}\\]</div>`;
  });

  // Inline math $...$
  body = body.replace(/\$([^$\n]+)\$/g, (_m, tex: string) => {
    return `<span class="math">\\(${tex.trim()}\\)</span>`;
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'\\\\(',right:'\\\\)',display:false},{left:'\\\\[',right:'\\\\]',display:true}],throwOnError:false})"></script>
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: ${colors.surface};
    color: ${colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    line-height: 1.55;
  }
  body { padding: 12px; }
  p { margin: 0 0 12px 0; }
  .math { color: ${colors.text}; }
  a { color: ${colors.accent}; }
</style>
</head>
<body><p>${body}</p></body>
</html>`;
}

export function MarkdownMath({ markdown, minHeight = 160 }: Props) {
  const { width } = useWindowDimensions();
  const html = useMemo(() => toHtml(markdown), [markdown]);

  return (
    <View style={[styles.wrap, { width: width - 32, minHeight }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={[styles.web, { minHeight }]}
        scrollEnabled
        nestedScrollEnabled
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  web: {
    backgroundColor: colors.surface,
    flex: 1,
  },
});
