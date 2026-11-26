/** Dual hex coordinate systems (image.pdf / Maja style), simplified. */
export const HEX_HIVE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" role="img" aria-label="Maja and Willi hexagonal coordinate systems">
  <style>
    .h { fill: #222; stroke: #3DDC97; stroke-width: 1.5; }
    .t { fill: #F2F2F2; font: 600 10px ui-sans-serif, system-ui, sans-serif; }
    .cap { fill: #3DDC97; font: 700 12px ui-sans-serif, system-ui, sans-serif; }
  </style>
  <text class="cap" x="150" y="22" text-anchor="middle">Maja (x, y)</text>
  <text class="cap" x="470" y="22" text-anchor="middle">Willi (spiral id)</text>
  <!-- flat-top hex helper positions for ring 0..2, two copies -->
  <g transform="translate(150 160) scale(0.92)">
    <polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/>
    <text class="t" x="0" y="4" text-anchor="middle">0,0</text>
    <g transform="translate(0 60)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">0,1</text></g>
    <g transform="translate(0 -60)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">0,-1</text></g>
    <g transform="translate(52 30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">1,0</text></g>
    <g transform="translate(52 -30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">1,-1</text></g>
    <g transform="translate(-52 30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">-1,1</text></g>
    <g transform="translate(-52 -30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">-1,0</text></g>
  </g>
  <g transform="translate(470 160) scale(0.92)">
    <polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/>
    <text class="t" x="0" y="4" text-anchor="middle">1</text>
    <g transform="translate(0 60)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">2</text></g>
    <g transform="translate(-52 30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">3</text></g>
    <g transform="translate(-52 -30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">4</text></g>
    <g transform="translate(0 -60)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">5</text></g>
    <g transform="translate(52 -30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">6</text></g>
    <g transform="translate(52 30)"><polygon class="h" points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20"/><text class="t" x="0" y="4" text-anchor="middle">7</text></g>
  </g>
</svg>`;
