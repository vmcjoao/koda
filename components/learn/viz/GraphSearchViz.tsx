import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import type { GraphDemo } from '@/types/learn';
import type { GraphStep } from '@/lib/learnViz';
import { colors } from '@/constants/theme';

export type { GraphStep };

const W = 360;
const H = 220;

function nodeColor(state: string | undefined) {
  switch (state) {
    case 'current':
      return colors.xp;
    case 'frontier':
      return colors.radar;
    case 'done':
      return colors.accent;
    default:
      return colors.surfaceElevated;
  }
}

export function GraphSearchViz({ demo, step }: { demo: GraphDemo; step?: GraphStep }) {
  const nodeState = step?.nodeState ?? {};
  const active = new Set(step?.activeEdges ?? []);
  const mst = new Set(step?.mstEdges ?? []);

  return (
    <View style={styles.wrap}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {demo.edges.map((e) => {
          const a = demo.nodes.find((n) => n.id === e.from)!;
          const b = demo.nodes.find((n) => n.id === e.to)!;
          const key = `${e.from}-${e.to}`;
          const rev = `${e.to}-${e.from}`;
          const isActive = active.has(key) || active.has(rev);
          const inMst = mst.has(key) || mst.has(rev);
          return (
            <Line
              key={key}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={isActive ? colors.xp : inMst ? colors.accent : colors.border}
              strokeWidth={isActive || inMst ? 3 : 2}
            />
          );
        })}
        {demo.nodes.map((n) => {
          const st = nodeState[n.id];
          const fill = nodeColor(st);
          const dist = step?.dist?.[n.id];
          const labelFill =
            !st || st === 'idle' ? colors.text : colors.background;
          return (
            <React.Fragment key={n.id}>
              <Circle
                cx={n.x}
                cy={n.y}
                r={18}
                fill={fill}
                stroke={colors.text}
                strokeWidth={1.5}
              />
              <SvgText
                x={n.x}
                y={n.y + 5}
                fill={labelFill}
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                {n.label ?? n.id}
              </SvgText>
              {dist != null && Number.isFinite(dist) ? (
                <SvgText
                  x={n.x}
                  y={n.y - 26}
                  fill={colors.textMuted}
                  fontSize="11"
                  textAnchor="middle"
                >
                  {dist === Infinity ? '∞' : dist}
                </SvgText>
              ) : null}
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={styles.legend}>
        <Text style={styles.leg}>idle</Text>
        <Text style={[styles.leg, { color: colors.radar }]}>frontier</Text>
        <Text style={[styles.leg, { color: colors.xp }]}>current</Text>
        <Text style={[styles.leg, { color: colors.accent }]}>done</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  legend: { flexDirection: 'row', gap: 12 },
  leg: { color: colors.textDim, fontSize: 11, fontWeight: '600' },
});
