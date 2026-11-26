// CJS build — Metro/Expo resolve `katex` to .mjs which can break renderToString.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const katex = require('katex') as typeof import('katex');
import { figureDataUri, getFigure, isRemoteOrDataUrl } from '@/lib/figures';
import { colors } from '@/constants/theme';
import { KATEX_CSS } from '@/lib/vendor/katexCss';

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
    });
  } catch {
    return `<code class="tex-fallback">${escapeHtml(tex.trim())}</code>`;
  }
}

type Slot = { html: string };

/**
 * Convert Koda statement markdown into HTML for the math WebView.
 * Math is pre-rendered with KaTeX (no CDN) so it works offline.
 */
export function statementToHtml(markdown: string): string {
  const slots: Slot[] = [];
  const park = (html: string) => {
    const i = slots.length;
    slots.push({ html });
    return `%%KODA_SLOT_${i}%%`;
  };

  let src = markdown.replace(/\r\n/g, '\n');

  // ```svg ... ```
  src = src.replace(/```svg\s*\n([\s\S]*?)```/gi, (_m, body: string) => {
    const svg = body.trim();
    if (!/^<svg[\s>]/i.test(svg) || !svg.includes('</svg>')) {
      return park(`<pre class="grid">${escapeHtml(svg)}</pre>`);
    }
    return park(`<div class="figure">${svg}</div>`);
  });

  // ``` or ```text|grid|ascii ... ```
  src = src.replace(/```(?:text|grid|ascii|)?\s*\n([\s\S]*?)```/gi, (_m, body: string) => {
    return park(`<pre class="grid">${escapeHtml(body.replace(/\n$/, ''))}</pre>`);
  });

  // [[figure:id]]
  src = src.replace(/\[\[figure:([a-z0-9_-]+)\]\]/gi, (_m, id: string) => {
    const fig = getFigure(id);
    if (!fig) return park(`<p class="missing">[missing figure: ${escapeHtml(id)}]</p>`);
    return park(
      `<div class="figure" role="img" aria-label="${escapeHtml(fig.alt)}">${fig.svg}</div>`,
    );
  });

  // ![alt](src)
  src = src.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt: string, rawSrc: string) => {
    const url = rawSrc.trim();
    const fig = getFigure(url);
    if (fig) {
      return park(
        `<div class="figure" role="img" aria-label="${escapeHtml(alt || fig.alt)}">${fig.svg}</div>`,
      );
    }
    if (isRemoteOrDataUrl(url)) {
      return park(
        `<div class="figure"><img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" /></div>`,
      );
    }
    return park(`<p class="missing">[missing figure: ${escapeHtml(url)}]</p>`);
  });

  // Math BEFORE escaping — Codeforces $$$...$$$, $$...$$, $...$
  src = src.replace(/\$\$\$([^$]+)\$\$\$/g, (_m, tex: string) =>
    park(`<span class="math">${renderTex(tex, false)}</span>`),
  );
  src = src.replace(/\$\$([^$]+)\$\$/g, (_m, tex: string) =>
    park(`<div class="math">${renderTex(tex, true)}</div>`),
  );
  src = src.replace(/\$([^$\n]+)\$/g, (_m, tex: string) =>
    park(`<span class="math">${renderTex(tex, false)}</span>`),
  );

  // Inline `code` (after math so $n$ isn’t eaten)
  src = src.replace(/`([^`]+)`/g, (_m, code: string) =>
    park(`<code class="inline">${escapeHtml(code)}</code>`),
  );

  let body = escapeHtml(src);
  body = body.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  body = body.replace(/\n\n+/g, '</p><p>');
  body = body.replace(/\n/g, '<br/>');

  body = body.replace(/%%KODA_SLOT_(\d+)%%/g, (_m, idx: string) => {
    return slots[Number(idx)]?.html ?? '';
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<style>
${KATEX_CSS}
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
  .katex { color: ${colors.text}; font-size: 1.05em; }
  .katex-display { margin: 0.6em 0; overflow-x: auto; overflow-y: hidden; }
  a { color: ${colors.accent}; }
  code.inline, code.tex-fallback {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.92em;
    background: ${colors.surfaceElevated};
    border: 1px solid ${colors.border};
    border-radius: 4px;
    padding: 1px 5px;
    color: ${colors.accent};
  }
  pre.grid {
    background: ${colors.surfaceElevated};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    padding: 10px 12px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.35;
    white-space: pre;
    color: ${colors.text};
  }
  .figure {
    margin: 8px 0 14px;
    padding: 8px;
    background: ${colors.surfaceElevated};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    overflow-x: auto;
    text-align: center;
  }
  .figure svg { max-width: 100%; height: auto; }
  .figure img { max-width: 100%; height: auto; border-radius: 6px; }
  .missing { color: ${colors.warning}; font-size: 13px; }
  strong { font-weight: 700; color: ${colors.text}; }
</style>
</head>
<body><p>${body}</p></body>
</html>`;
}

/** Plain fallback: keep grids, drop figure markup to alt text. */
export function plainStatement(markdown: string): string {
  return markdown
    .replace(/```svg\s*\n[\s\S]*?```/gi, '[diagram]')
    .replace(/```(?:text|grid|ascii)?\s*\n([\s\S]*?)```/gi, (_m, body: string) => body.trimEnd())
    .replace(/\[\[figure:([a-z0-9_-]+)\]\]/gi, (_m, id: string) => {
      const fig = getFigure(id);
      return fig ? `[figure: ${fig.alt}]` : `[figure: ${id}]`;
    })
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt: string, src: string) => {
      const fig = getFigure(src);
      return `[figure: ${alt || fig?.alt || src}]`;
    })
    .replace(/\$\$\$([^$]+)\$\$\$/g, (_, tex: string) => tex.trim())
    .replace(/\$\$([^$]+)\$\$/g, (_, tex: string) => tex.trim())
    .replace(/\$([^$\n]+)\$/g, (_, tex: string) => tex.trim())
    .replace(/\\\\/g, '\\')
    .trim();
}

export function statementHasFigures(markdown: string): boolean {
  return (
    /```svg/i.test(markdown) ||
    /!\[/.test(markdown) ||
    /\[\[figure:/i.test(markdown) ||
    /```(?:text|grid|ascii)/i.test(markdown)
  );
}

/** Exported for tests — resolve asset refs without building full HTML. */
export function resolveImageHtml(alt: string, src: string): string {
  const fig = getFigure(src);
  if (fig) {
    return `<div class="figure" role="img" aria-label="${escapeHtml(alt || fig.alt)}">${fig.svg}</div>`;
  }
  if (isRemoteOrDataUrl(src)) {
    return `<div class="figure"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" /></div>`;
  }
  const maybe = getFigure(`asset:${src}`);
  if (maybe) {
    return `<img src="${figureDataUri(maybe)}" alt="${escapeHtml(alt || maybe.alt)}" />`;
  }
  return `<p class="missing">[missing figure: ${escapeHtml(src)}]</p>`;
}
