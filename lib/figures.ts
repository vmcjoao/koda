import { BINARY_TREES_SVG } from '@/data/figures/binary-trees';
import { HEX_HIVE_SVG } from '@/data/figures/hex-hive';
import { SPIRAL_GRID_SVG } from '@/data/figures/spiral-grid';

export type FigureAsset = {
  id: string;
  alt: string;
  /** Inline SVG markup (preferred for diagrams). */
  svg: string;
};

/** Bundled statement figures — reference as `asset:<id>` in markdown images. */
export const FIGURE_ASSETS: Record<string, FigureAsset> = {
  'binary-trees': {
    id: 'binary-trees',
    alt: 'Four labeled binary trees with nodes A and B',
    svg: BINARY_TREES_SVG,
  },
  'spiral-grid': {
    id: 'spiral-grid',
    alt: 'Spiral cell numbering on a square grid centered at 0',
    svg: SPIRAL_GRID_SVG,
  },
  'hex-hive': {
    id: 'hex-hive',
    alt: 'Hex honeycomb: Maja (x,y) vs Willi spiral ids',
    svg: HEX_HIVE_SVG,
  },
};

export function getFigure(idOrSrc: string): FigureAsset | null {
  const id = idOrSrc.replace(/^asset:/, '').trim();
  return FIGURE_ASSETS[id] ?? null;
}

/** data: URI for use in <img src> when inline SVG injection is unavailable. */
export function figureDataUri(fig: FigureAsset): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fig.svg)}`;
}

export function isRemoteOrDataUrl(src: string): boolean {
  return (
    src.startsWith('https://') ||
    src.startsWith('http://') ||
    src.startsWith('data:')
  );
}
