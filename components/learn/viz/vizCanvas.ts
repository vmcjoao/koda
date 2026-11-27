/** Logical graph / absolute-layout canvas (viewBox units). */
export const VIZ_W = 360;
export const VIZ_H = 220;
/** Keep node centers this far from the canvas edge (stroke + label room). */
export const VIZ_NODE_INSET = 28;

export function clampVizPoint(
  x: number,
  y: number,
  inset = VIZ_NODE_INSET,
  w = VIZ_W,
  h = VIZ_H,
): { x: number; y: number } {
  return {
    x: Math.min(w - inset, Math.max(inset, x)),
    y: Math.min(h - inset, Math.max(inset, y)),
  };
}

/** Scale factor so a logical-width canvas fits the measured parent. */
export function fitScale(parentWidth: number, logicalW: number): number {
  if (parentWidth <= 0 || logicalW <= 0) return 1;
  return Math.min(1, parentWidth / logicalW);
}
