import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, Marker, Path, Text as SvgText } from 'react-native-svg';
import type { GraphDemo } from '@/types/learn';
import type { GraphStep } from '@/lib/learnViz';
import { colors } from '@/constants/theme';

export type { GraphStep };

const W = 360;
const H = 220;

const COMP_COLORS = ['#3DDC97', '#5B8CFF', '#F5A623', '#FF6B6B', '#C084FC', '#2DD4BF'];

function nodeColor(
  state: string | undefined,
  compId: number | undefined,
  hasComponents: boolean,
) {
  if (hasComponents && compId != null && (state === 'done' || state === 'current')) {
    return COMP_COLORS[compId % COMP_COLORS.length]!;
  }
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

type Props = {
  demo: GraphDemo;
  step?: GraphStep;
  onNodePress?: (nodeId: string) => void;
  feedback?: Record<string, 'correct' | 'wrong'>;
};

export function GraphSearchViz({ demo, step, onNodePress, feedback }: Props) {
  const nodeState = step?.nodeState ?? {};
  const active = new Set(step?.activeEdges ?? []);
  const mst = new Set(step?.mstEdges ?? []);
  const component = step?.component;
  const hasComponents = !!component && Object.keys(component).length > 0;
  const directed = !!demo.directed;

  return (
    <View style={styles.wrap}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {directed ? (
          <Defs>
            <Marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <Path d="M0,0 L6,3 L0,6 Z" fill={colors.textMuted} />
            </Marker>
            <Marker
              id="arrowActive"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <Path d="M0,0 L6,3 L0,6 Z" fill={colors.xp} />
            </Marker>
          </Defs>
        ) : null}
        {demo.edges.map((e) => {
          const a = demo.nodes.find((n) => n.id === e.from)!;
          const b = demo.nodes.find((n) => n.id === e.to)!;
          const key = `${e.from}-${e.to}`;
          const rev = `${e.to}-${e.from}`;
          const isActive = active.has(key) || active.has(rev);
          const inMst = mst.has(key) || mst.has(rev);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const inset = directed ? 20 : 0;
          const x1 = a.x + (dx / len) * inset;
          const y1 = a.y + (dy / len) * inset;
          const x2 = b.x - (dx / len) * inset;
          const y2 = b.y - (dy / len) * inset;
          return (
            <React.Fragment key={key}>
              <Line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? colors.xp : inMst ? colors.accent : colors.border}
                strokeWidth={isActive || inMst ? 3 : 2}
                markerEnd={directed ? (isActive ? 'url(#arrowActive)' : 'url(#arrow)') : undefined}
              />
              {e.w != null ? (
                <SvgText
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 8}
                  fill={colors.textMuted}
                  fontSize="11"
                  textAnchor="middle"
                >
                  {e.w}
                </SvgText>
              ) : null}
            </React.Fragment>
          );
        })}
        {demo.nodes.map((n) => {
          const st = nodeState[n.id];
          const fill = nodeColor(st, component?.[n.id], hasComponents);
          const dist = step?.dist?.[n.id];
          const fb = feedback?.[n.id];
          const labelFill = !st || st === 'idle' ? colors.text : colors.background;
          const isCurrent = st === 'current';
          return (
            <React.Fragment key={n.id}>
              {isCurrent ? (
                <Circle
                  cx={n.x}
                  cy={n.y}
                  r={26}
                  fill="transparent"
                  stroke={colors.xp}
                  strokeWidth={2}
                  opacity={0.45}
                />
              ) : null}
              <Circle
                cx={n.x}
                cy={n.y}
                r={isCurrent ? 20 : 18}
                fill={fill}
                stroke={
                  fb === 'correct'
                    ? colors.accent
                    : fb === 'wrong'
                      ? colors.danger
                      : colors.text
                }
                strokeWidth={fb ? 3 : isCurrent ? 2.5 : 1.5}
                onPress={onNodePress ? () => onNodePress(n.id) : undefined}
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
        {hasComponents ? (
          <Text style={styles.leg}>colors = SCCs · bright edges = bridges / MST</Text>
        ) : (
          <>
            <Text style={styles.leg}>idle</Text>
            <Text style={[styles.leg, { color: colors.radar }]}>frontier</Text>
            <Text style={[styles.leg, { color: colors.xp }]}>current</Text>
            <Text style={[styles.leg, { color: colors.accent }]}>done</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  leg: { color: colors.textDim, fontSize: 11, fontWeight: '600' },
});
