import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '@/components/game/PressableScale';
import { SLOT_LABELS, type DailySet, type DailySlotRole } from '@/lib/habit';
import type { ProblemWithApproaches } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  daily: DailySet;
  problemMap: Map<string, ProblemWithApproaches>;
  onSelect: (problem: ProblemWithApproaches) => void;
};

const ORDER: DailySlotRole[] = ['warmup', 'target', 'boss'];

export function DailyPath({ daily, problemMap, onSelect }: Props) {
  const current = daily.slots.find((s) => !s.completed)?.role ?? null;
  const doneCount = daily.slots.filter((s) => s.completed).length;
  const progress = doneCount / Math.max(1, daily.slots.length);

  return (
    <View style={styles.wrap}>
      <View style={styles.trackBg}>
        <View style={[styles.trackFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <View style={styles.nodes}>
        {ORDER.map((role, index) => {
          const slot = daily.slots.find((s) => s.role === role);
          const problem = slot ? problemMap.get(slot.problemId) : undefined;
          const isBoss = role === 'boss';
          const isCurrent = current === role;
          const done = !!slot?.completed;
          const prevRole = index > 0 ? ORDER[index - 1] : null;
          const prevDone = prevRole
            ? !!daily.slots.find((s) => s.role === prevRole)?.completed
            : true;
          const locked = !done && !isCurrent && !prevDone;
          const canOpen = !!problem && (done || isCurrent || prevDone);

          return (
            <PressableScale
              key={role}
              disabled={!canOpen}
              haptic={isBoss ? 'medium' : 'light'}
              onPress={() => problem && onSelect(problem)}
              style={[
                styles.node,
                isBoss && styles.nodeBoss,
                done && styles.nodeDone,
                isCurrent && styles.nodeCurrent,
                locked && styles.nodeLocked,
              ]}
            >
              <Text
                style={[
                  styles.nodeIndex,
                  isBoss && styles.nodeIndexBoss,
                  done && styles.nodeIndexDone,
                ]}
              >
                {done ? '✓' : index + 1}
              </Text>
              <Text
                style={[styles.nodeLabel, isBoss && styles.nodeLabelBoss, isCurrent && styles.nodeLabelCurrent]}
                numberOfLines={1}
              >
                {SLOT_LABELS[role]}
              </Text>
              {done && slot?.score != null ? (
                <Text style={styles.nodeScore}>{slot.score}%</Text>
              ) : problem ? (
                <Text style={styles.nodeRating}>{problem.difficulty_rating}</Text>
              ) : (
                <Text style={styles.nodeRating}>—</Text>
              )}
              {isCurrent ? <Text style={styles.now}>NOW</Text> : null}
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  trackBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.runTrack,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  trackFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  nodes: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  node: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 2,
    minHeight: 96,
  },
  nodeBoss: {
    borderColor: colors.warning,
    backgroundColor: '#1C1810',
  },
  nodeDone: {
    borderColor: colors.accentDim,
    opacity: 0.92,
  },
  nodeCurrent: {
    borderColor: colors.accent,
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  nodeLocked: {
    opacity: 0.45,
  },
  nodeIndex: {
    color: colors.textDim,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  nodeIndexBoss: {
    color: colors.warning,
  },
  nodeIndexDone: {
    color: colors.accent,
  },
  nodeLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  nodeLabelBoss: {
    color: colors.warning,
  },
  nodeLabelCurrent: {
    color: colors.accent,
  },
  nodeScore: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  nodeRating: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  now: {
    marginTop: 2,
    color: colors.accent,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
