/** Four labeled binary trees with A/B (arrow.pdf style). Dark-theme strokes. */
export const BINARY_TREES_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 140" role="img" aria-label="Four binary trees with two labeled nodes">
  <style>
    .n { fill: #3DDC97; font: 700 16px ui-sans-serif, system-ui, sans-serif; }
    .e { stroke: #A0A0A0; stroke-width: 2; fill: none; }
  </style>
  <!-- A left→B -->
  <text class="n" x="40" y="28" text-anchor="middle">A</text>
  <path class="e" d="M40 34 L18 78" marker-end="url(#arr)"/>
  <text class="n" x="18" y="100" text-anchor="middle">B</text>
  <!-- A right→B -->
  <text class="n" x="150" y="28" text-anchor="middle">A</text>
  <path class="e" d="M150 34 L172 78" marker-end="url(#arr)"/>
  <text class="n" x="172" y="100" text-anchor="middle">B</text>
  <!-- B left→A -->
  <text class="n" x="300" y="28" text-anchor="middle">B</text>
  <path class="e" d="M300 34 L278 78" marker-end="url(#arr)"/>
  <text class="n" x="278" y="100" text-anchor="middle">A</text>
  <!-- B right→A -->
  <text class="n" x="440" y="28" text-anchor="middle">B</text>
  <path class="e" d="M440 34 L462 78" marker-end="url(#arr)"/>
  <text class="n" x="462" y="100" text-anchor="middle">A</text>
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#A0A0A0"/>
    </marker>
  </defs>
</svg>`;
