import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import {
  LEARN_UNITS,
  getLesson,
  isPathLessonUnlocked,
  unitProgress,
} from '@/lib/learn';
import type { LearnLesson } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  studied: Set<string>;
  /** First unfinished unlocked path lesson id — shown as START. */
  currentId?: string;
  onSelect: (lesson: LearnLesson) => void;
  onLockedPress?: (lesson: LearnLesson) => void;
};

export function LearnPath({ studied, currentId, onSelect, onLockedPress }: Props) {
  let globalIndex = 0;

  return (
    <View style={styles.wrap}>
      {LEARN_UNITS.map((unit, ui) => {
        const prog = unitProgress(unit, studied);
        const lessons = unit.lessonIds
          .map((id) => getLesson(id))
          .filter((l): l is LearnLesson => !!l);

        return (
          <View key={unit.id} style={styles.unit}>
            <FadeInUp delayMs={40 + ui * 40} waitForLaunch={false}>
              <View style={[styles.unitHeader, prog.complete && styles.unitHeaderDone]}>
                <View style={styles.unitText}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitBlurb}>{unit.blurb}</Text>
                </View>
                <View style={[styles.ring, prog.complete && styles.ringDone]}>
                  <Text style={[styles.ringText, prog.complete && styles.ringTextDone]}>
                    {prog.complete ? '✓' : `${prog.done}/${prog.total}`}
                  </Text>
                </View>
              </View>
              <View style={styles.unitTrack}>
                <View
                  style={[
                    styles.unitTrackFill,
                    {
                      width: `${Math.round((prog.done / Math.max(1, prog.total)) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </FadeInUp>

            <View style={styles.pathColumn}>
              {lessons.map((lesson, li) => {
                const idx = globalIndex++;
                const side = idx % 2 === 0 ? 'left' : 'right';
                const done = studied.has(lesson.id);
                const unlocked = isPathLessonUnlocked(lesson.id, studied);
                const showNow = !done && unlocked && lesson.id === currentId;
                const locked = !unlocked && !done;

                return (
                  <FadeInUp key={lesson.id} delayMs={60 + idx * 28} waitForLaunch={false}>
                    <View style={styles.stepRow}>
                      {(li > 0 || ui > 0) && (
                        <View
                          style={[
                            styles.connector,
                            side === 'left' ? styles.connectorFromRight : styles.connectorFromLeft,
                            (done || showNow) && styles.connectorLit,
                          ]}
                        />
                      )}
                      <View
                        style={[
                          styles.nodeSlot,
                          side === 'left' ? styles.slotLeft : styles.slotRight,
                        ]}
                      >
                        <PressableScale
                          haptic={showNow ? 'medium' : 'light'}
                          scaleTo={0.92}
                          onPress={() => {
                            if (locked) {
                              onLockedPress?.(lesson);
                              return;
                            }
                            onSelect(lesson);
                          }}
                          style={[
                            styles.node,
                            done && styles.nodeDone,
                            showNow && styles.nodeCurrent,
                            locked && styles.nodeLocked,
                          ]}
                        >
                          <Text
                            style={[
                              styles.nodeGlyph,
                              done && styles.nodeGlyphDone,
                              showNow && styles.nodeGlyphCurrent,
                              locked && styles.nodeGlyphLocked,
                            ]}
                          >
                            {done ? '✓' : locked ? '○' : idx + 1}
                          </Text>
                        </PressableScale>
                        <View
                          style={[
                            styles.nodeMeta,
                            side === 'right' && styles.nodeMetaRight,
                          ]}
                        >
                          <Text
                            style={[
                              styles.nodeTitle,
                              showNow && styles.nodeTitleCurrent,
                              locked && styles.nodeTitleLocked,
                            ]}
                            numberOfLines={2}
                          >
                            {lesson.title}
                          </Text>
                          {showNow ? <Text style={styles.now}>START</Text> : null}
                          {done ? <Text style={styles.cleared}>CLEARED</Text> : null}
                          {locked ? <Text style={styles.lockedLabel}>LOCKED</Text> : null}
                        </View>
                      </View>
                    </View>
                  </FadeInUp>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  unit: { gap: spacing.md },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  unitHeaderDone: {
    borderColor: colors.accentDim,
  },
  unitText: { flex: 1, gap: 2 },
  unitTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  unitBlurb: {
    color: colors.textMuted,
    fontSize: 13,
  },
  ring: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  ringDone: {
    backgroundColor: colors.chipSelected,
  },
  ringText: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontWeight: '800',
    fontSize: 12,
  },
  ringTextDone: {
    fontSize: 18,
  },
  unitTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.runTrack,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
  },
  unitTrackFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  pathColumn: {
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  stepRow: {
    minHeight: 84,
    justifyContent: 'center',
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    top: -spacing.lg,
    height: spacing.lg,
    width: 4,
    backgroundColor: colors.runTrack,
    borderRadius: 2,
    left: '50%',
    marginLeft: -2,
  },
  connectorFromRight: {},
  connectorFromLeft: {},
  connectorLit: {
    backgroundColor: colors.accentDim,
  },
  nodeSlot: {
    width: '72%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  slotLeft: {
    alignSelf: 'flex-start',
    marginLeft: '4%',
  },
  slotRight: {
    alignSelf: 'flex-end',
    marginRight: '4%',
    flexDirection: 'row-reverse',
  },
  node: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 5,
    borderBottomWidth: 8,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  nodeCurrent: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  nodeLocked: {
    opacity: 0.45,
    borderColor: colors.textDim,
  },
  nodeGlyph: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'SpaceMono',
  },
  nodeGlyphDone: {
    color: colors.accent,
  },
  nodeGlyphCurrent: {
    color: colors.background,
  },
  nodeGlyphLocked: {
    color: colors.textDim,
  },
  nodeMeta: {
    flex: 1,
    gap: 2,
  },
  nodeMetaRight: {
    alignItems: 'flex-end',
  },
  nodeTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  nodeTitleCurrent: {
    color: colors.accent,
  },
  nodeTitleLocked: {
    color: colors.textDim,
  },
  now: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  cleared: {
    color: colors.accentDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  lockedLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
