import React from 'react';
import { Text, type TextStyle } from 'react-native';
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';
import { colors } from '@/constants/theme';

hljs.registerLanguage('cpp', cpp);

const TOKEN_COLOR: Record<string, string> = {
  keyword: '#C792EA',
  built_in: '#82AAFF',
  type: '#82AAFF',
  title: '#82AAFF',
  'title.function': '#82AAFF',
  params: colors.text,
  string: '#C3E88D',
  meta: '#89DDFF',
  'meta-string': '#C3E88D',
  comment: colors.textDim,
  number: '#F78C6C',
  literal: '#F78C6C',
  punct: colors.textMuted,
  operator: colors.textMuted,
  'template-tag': '#C792EA',
  'template-variable': '#F07178',
  symbol: '#F78C6C',
  attr: '#FFCB6B',
  variable: colors.text,
  'class title': '#FFCB6B',
};

function colorForClasses(classAttr: string | undefined): string | undefined {
  if (!classAttr) return undefined;
  const names = classAttr
    .split(/\s+/)
    .filter((c) => c.startsWith('hljs-'))
    .map((c) => c.slice(5));
  for (const name of names) {
    if (TOKEN_COLOR[name]) return TOKEN_COLOR[name];
  }
  // nested like "hljs-title function_" → title
  for (const name of names) {
    const base = name.split('_')[0]?.split('.')[0];
    if (base && TOKEN_COLOR[base]) return TOKEN_COLOR[base];
  }
  return undefined;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

type Node = { className?: string; children: (Node | string)[] };

function parseHljsHtml(html: string): Node {
  const root: Node = { children: [] };
  const stack: Node[] = [root];
  const re = /<\/?span\b[^>]*>|[^<]+/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tok = m[0];
    if (tok.startsWith('</')) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    if (tok.startsWith('<span')) {
      const cls = /class="([^"]*)"/.exec(tok)?.[1];
      const node: Node = { className: cls, children: [] };
      stack[stack.length - 1]!.children.push(node);
      stack.push(node);
      continue;
    }
    stack[stack.length - 1]!.children.push(decodeEntities(tok));
  }
  return root;
}

function renderNode(node: Node | string, key: string, inherited?: string): React.ReactNode {
  if (typeof node === 'string') {
    return (
      <Text key={key} style={inherited ? { color: inherited } : undefined}>
        {node}
      </Text>
    );
  }
  const color = colorForClasses(node.className) ?? inherited;
  return (
    <Text key={key} style={color ? { color } : undefined}>
      {node.children.map((child, i) => renderNode(child, `${key}.${i}`, color))}
    </Text>
  );
}

/** Highlight C++ (or plain fallback) into nested RN Text nodes. */
export function highlightCpp(code: string, language = 'cpp'): React.ReactNode {
  let html: string;
  try {
    const lang = language === 'c++' || language === 'cxx' ? 'cpp' : language;
    if (lang === 'cpp' || hljs.getLanguage(lang)) {
      html = hljs.highlight(code, { language: lang === 'cpp' ? 'cpp' : lang, ignoreIllegals: true }).value;
    } else {
      html = hljs.highlight(code, { language: 'cpp', ignoreIllegals: true }).value;
    }
  } catch {
    return code;
  }
  const tree = parseHljsHtml(html);
  return renderNode(tree, 'root');
}

export const codeBaseStyle: TextStyle = {
  color: colors.text,
  fontFamily: 'SpaceMono',
  fontSize: 12,
  lineHeight: 18,
};
