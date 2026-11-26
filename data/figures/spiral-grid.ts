/** Spiral cell IDs around origin (matrix.pdf / Euclidiana style). */
export const SPIRAL_GRID_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" role="img" aria-label="Spiral coordinate grid centered at 0">
  <style>
    .c { fill: #F2F2F2; font: 600 11px ui-monospace, SFMono-Regular, Menlo, monospace; }
    .dot { fill: #6B6B6B; font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace; }
    .box { fill: #222; stroke: #2A2A2A; stroke-width: 1; }
  </style>
  ${(() => {
    // Build a small spiral: right, up, left, down with increasing run lengths
    const cells = new Map<string, number>();
    let x = 0;
    let y = 0;
    let n = 0;
    cells.set('0,0', 0);
    const dirs = [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1],
    ];
    let len = 1;
    let di = 0;
    while (n < 24) {
      for (let rep = 0; rep < 2; rep++) {
        const [dx, dy] = dirs[di % 4];
        for (let i = 0; i < len && n < 24; i++) {
          x += dx;
          y += dy;
          n += 1;
          cells.set(`${x},${y}`, n);
        }
        di += 1;
      }
      len += 1;
    }
    const size = 36;
    const origin = 180;
    let rects = '';
    for (let gy = -3; gy <= 3; gy++) {
      for (let gx = -3; gx <= 3; gx++) {
        const px = origin + gx * size - size / 2;
        const py = origin + gy * size - size / 2;
        rects += `<rect class="box" x="${px}" y="${py}" width="${size - 2}" height="${size - 2}" rx="4"/>`;
        const key = `${gx},${gy}`;
        const val = cells.get(key);
        const tx = origin + gx * size;
        const ty = origin + gy * size + 4;
        if (val != null) {
          rects += `<text class="c" x="${tx}" y="${ty}" text-anchor="middle">${val}</text>`;
        } else if (Math.abs(gx) + Math.abs(gy) <= 5) {
          rects += `<text class="dot" x="${tx}" y="${ty}" text-anchor="middle">·</text>`;
        }
      }
    }
    return rects;
  })()}
</svg>`;
