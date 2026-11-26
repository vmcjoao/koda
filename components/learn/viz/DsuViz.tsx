import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import type { GraphDemo } from '@/types/learn';
import { colors } from '@/constants/theme';

const MERGES: [string, string][] = [
  ['0', '1'],
  ['2', '3'],
  ['1', '4'],
  ['3', '4'],
];

export function DsuViz({ demo, step }: { demo: GraphDemo; step: number }) {
  const parent = useMemo(() => {
    const p: Record<string, string> = {};
    for (const n of demo.nodes) p[n.id] = n.id;
    const find = (x: string): string => (p[x] === x ? x : find(p[x]));
    const n = Math.min(step, MERGES.length);
    for (let i = 0; i < n; i++) {
      const [a, b] = MERGES[i];
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) p[rb] = ra;
    }
    return p;
  }, [demo.nodes, step]);

  const roots = useMemo(() => {
    const find = (x: string): string => (parent[x] === x ? x : find(parent[x]));
    const map = new Map<string, string[]>();
    for (const n of demo.nodes) {
      const r = find(n.id);
      const list = map.get(r) ?? [];
      list.push(n.id);
      map.set(r, list);
    }
    return map;
  }, [demo.nodes, parent]);

  return (
    <View style={styles.wrap}>
      <Svg width={360} height={200} viewBox="0 0 360 200">
        {demo.nodes.map((n) => {
          if (parent[n.id] === n.id) return null;
          const par = demo.nodes.find((x) => x.id === parent[n.id])!;
          return (
            <Line
              key={`e-${n.id}`}
              x1={n.x}
              y1={n.y}
              x2={par.x}
              y2={par.y}
              stroke={colors.accent}
              strokeWidth={2}
            />
          );
        })}
        {demo.nodes.map((n) => {
          const isRoot = parent[n.id] === n.id;
          return (
            <React.Fragment key={n.id}>
              <Circle
                cx={n.x}
                cy={n.y}
                r={18}
                fill={isRoot ? colors.accent : colors.radar}
                stroke={colors.text}
                strokeWidth={1.5}
              />
              <SvgText
                x={n.x}
                y={n.y + 5}
                fill={colors.background}
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                {n.label ?? n.id}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <Text style={styles.meta}>
        {step === 0
          ? 'each node alone'
          : `after unite ${MERGES.slice(0, step)
              .map(([a, b]) => `${a}-${b}`)
              .join(', ')} · ${roots.size} component(s)`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  meta: { color: colors.textMuted, fontSize: 12, fontFamily: 'SpaceMono' },
});
