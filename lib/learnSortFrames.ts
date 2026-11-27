import type { ArrayDemo } from '@/types/learn';

export type SortAlgo = 'selection' | 'merge' | 'quick';

export type SortItem = { id: string; value: number };

export type SortBand = {
  lo: number;
  hi: number;
  depth: number;
  role: 'active' | 'idle' | 'merged';
};

export type SortFrame = {
  label: string;
  /** Logical array order (ids left→right). */
  order: string[];
  items: SortItem[];
  highlight?: {
    a?: number;
    b?: number;
    lo?: number;
    hi?: number;
    pivot?: number;
  };
  layout: 'row' | 'split' | 'merge';
  bands?: SortBand[];
};

export function resolveSortAlgo(lessonId?: string): SortAlgo {
  if (lessonId === 'mergesort' || lessonId === 'divide-conquer') return 'merge';
  if (lessonId === 'quicksort') return 'quick';
  return 'selection';
}

function toItems(values: number[]): SortItem[] {
  return values.map((value, i) => ({ id: `v${i}`, value }));
}

function byOrder(items: SortItem[], order: string[]): SortItem[] {
  const map = new Map(items.map((it) => [it.id, it]));
  return order.map((id) => map.get(id)!);
}

function valuesOf(items: SortItem[], order: string[]): number[] {
  return byOrder(items, order).map((it) => it.value);
}

export function buildSelectionFrames(values: number[]): SortFrame[] {
  const items = toItems(values);
  const order = items.map((it) => it.id);
  const frames: SortFrame[] = [
    { label: 'Selection sort · start', order: [...order], items, layout: 'row' },
  ];

  for (let i = 0; i < order.length; i++) {
    let best = i;
    for (let j = i + 1; j < order.length; j++) {
      const a = items.find((it) => it.id === order[j])!.value;
      const b = items.find((it) => it.id === order[best])!.value;
      if (a < b) best = j;
      frames.push({
        label: `scan j=${j} · best=${best}`,
        order: [...order],
        items,
        layout: 'row',
        highlight: { lo: i, hi: order.length, a: i, b: best, pivot: i },
      });
    }
    if (best !== i) {
      // Pre-swap highlight (same order) then post-swap order so cells tween on Step.
      frames.push({
        label: `swap ${i} ↔ ${best}`,
        order: [...order],
        items,
        layout: 'row',
        highlight: { a: i, b: best, pivot: i },
      });
      const t = order[i]!;
      order[i] = order[best]!;
      order[best] = t;
      frames.push({
        label: `swapped ${i} ↔ ${best}`,
        order: [...order],
        items,
        layout: 'row',
        highlight: { a: i, b: best, pivot: i },
      });
    }
    frames.push({
      label: `fixed prefix 0…${i}`,
      order: [...order],
      items,
      layout: 'row',
      highlight: { pivot: i, lo: 0, hi: i + 1 },
    });
  }

  frames.push({
    label: 'done · sorted',
    order: [...order],
    items,
    layout: 'row',
    highlight: { lo: 0, hi: order.length },
  });
  return frames;
}

function mergeSortRec(
  items: SortItem[],
  order: string[],
  lo: number,
  hi: number,
  depth: number,
  frames: SortFrame[],
): void {
  if (hi - lo <= 1) return;

  const mid = lo + Math.floor((hi - lo) / 2);
  frames.push({
    label: `divide [${lo},${hi}) → mid=${mid}`,
    order: [...order],
    items,
    layout: 'split',
    highlight: { lo, hi },
    bands: [
      { lo, hi: mid, depth: depth + 1, role: 'active' },
      { lo: mid, hi, depth: depth + 1, role: 'active' },
      ...(lo > 0 || hi < order.length
        ? ([
            ...(lo > 0 ? [{ lo: 0, hi: lo, depth, role: 'idle' as const }] : []),
            ...(hi < order.length ? [{ lo: hi, hi: order.length, depth, role: 'idle' as const }] : []),
          ] as SortBand[])
        : []),
    ],
  });

  mergeSortRec(items, order, lo, mid, depth + 1, frames);
  mergeSortRec(items, order, mid, hi, depth + 1, frames);

  const left = order.slice(lo, mid);
  const right = order.slice(mid, hi);
  const merged: string[] = [];
  let i = 0;
  let j = 0;
  frames.push({
    label: `merge [${lo},${mid}) + [${mid},${hi})`,
    order: [...order],
    items,
    layout: 'merge',
    highlight: { lo, hi, a: lo, b: mid },
    bands: [
      { lo, hi: mid, depth: depth + 1, role: 'active' },
      { lo: mid, hi, depth: depth + 1, role: 'active' },
    ],
  });

  while (i < left.length || j < right.length) {
    const takeLeft =
      j >= right.length ||
      (i < left.length &&
        items.find((it) => it.id === left[i])!.value <=
          items.find((it) => it.id === right[j])!.value);
    if (takeLeft) {
      merged.push(left[i]!);
      i += 1;
    } else {
      merged.push(right[j]!);
      j += 1;
    }
    const next = [...order];
    for (let k = 0; k < merged.length; k++) next[lo + k] = merged[k]!;
    // keep unmerged tails in place for remaining slots
    let li = i;
    let rj = j;
    for (let k = merged.length; k < hi - lo; k++) {
      if (li < left.length) {
        next[lo + k] = left[li++]!;
      } else {
        next[lo + k] = right[rj++]!;
      }
    }
    for (let k = 0; k < next.length; k++) order[k] = next[k]!;
    frames.push({
      label: `merged ${merged.length}/${hi - lo} into [${lo},${hi})`,
      order: [...order],
      items,
      layout: 'merge',
      highlight: { lo, hi, a: lo + merged.length - 1 },
      bands: [{ lo, hi, depth, role: 'merged' }],
    });
  }
}

export function buildMergeFrames(values: number[]): SortFrame[] {
  const items = toItems(values);
  const order = items.map((it) => it.id);
  const frames: SortFrame[] = [
    { label: 'Mergesort · start', order: [...order], items, layout: 'row' },
  ];
  mergeSortRec(items, order, 0, order.length, 0, frames);
  frames.push({
    label: 'done · sorted',
    order: [...order],
    items,
    layout: 'row',
    highlight: { lo: 0, hi: order.length },
  });
  return frames;
}

function quickRec(
  items: SortItem[],
  order: string[],
  lo: number,
  hi: number,
  frames: SortFrame[],
): void {
  if (hi - lo <= 1) return;
  const pivotIdx = hi - 1;
  const pivotVal = items.find((it) => it.id === order[pivotIdx])!.value;
  frames.push({
    label: `partition [${lo},${hi}) · pivot=${pivotVal}`,
    order: [...order],
    items,
    layout: 'row',
    highlight: { lo, hi, pivot: pivotIdx },
  });

  let store = lo;
  for (let j = lo; j < pivotIdx; j++) {
    const v = items.find((it) => it.id === order[j])!.value;
    frames.push({
      label: `j=${j} · a[j]=${v} ${v <= pivotVal ? '≤' : '>'} pivot`,
      order: [...order],
      items,
      layout: 'row',
      highlight: { lo, hi, pivot: pivotIdx, a: store, b: j },
    });
    if (v <= pivotVal) {
      if (store !== j) {
        frames.push({
          label: `swap ${store} ↔ ${j}`,
          order: [...order],
          items,
          layout: 'row',
          highlight: { a: store, b: j, pivot: pivotIdx },
        });
        const t = order[store]!;
        order[store] = order[j]!;
        order[j] = t;
        frames.push({
          label: `swapped ${store} ↔ ${j}`,
          order: [...order],
          items,
          layout: 'row',
          highlight: { a: store, b: j, pivot: pivotIdx },
        });
      }
      store += 1;
    }
  }
  if (store !== pivotIdx) {
    frames.push({
      label: `place pivot ${store} ↔ ${pivotIdx}`,
      order: [...order],
      items,
      layout: 'row',
      highlight: { a: store, b: pivotIdx, pivot: pivotIdx },
    });
    const t = order[store]!;
    order[store] = order[pivotIdx]!;
    order[pivotIdx] = t;
    frames.push({
      label: `pivot placed at ${store}`,
      order: [...order],
      items,
      layout: 'row',
      highlight: { a: store, pivot: store },
    });
  }
  frames.push({
    label: `pivot settled at ${store}`,
    order: [...order],
    items,
    layout: 'row',
    highlight: { pivot: store, lo, hi },
  });

  quickRec(items, order, lo, store, frames);
  quickRec(items, order, store + 1, hi, frames);
}

export function buildQuickFrames(values: number[]): SortFrame[] {
  const items = toItems(values);
  const order = items.map((it) => it.id);
  const frames: SortFrame[] = [
    { label: 'Quicksort · start', order: [...order], items, layout: 'row' },
  ];
  quickRec(items, order, 0, order.length, frames);
  frames.push({
    label: 'done · sorted',
    order: [...order],
    items,
    layout: 'row',
    highlight: { lo: 0, hi: order.length },
  });
  return frames;
}

export function buildSortFrames(demo: ArrayDemo, lessonId?: string): SortFrame[] {
  const algo = resolveSortAlgo(lessonId);
  if (algo === 'merge') return buildMergeFrames(demo.values);
  if (algo === 'quick') return buildQuickFrames(demo.values);
  return buildSelectionFrames(demo.values);
}

export function sortFrameCount(demo: ArrayDemo, lessonId?: string): number {
  return buildSortFrames(demo, lessonId).length;
}

/** Sorted check helper for tests. */
export function finalOrderValues(frames: SortFrame[]): number[] {
  const last = frames[frames.length - 1]!;
  return valuesOf(last.items, last.order);
}
