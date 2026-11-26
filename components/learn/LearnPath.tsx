import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { LEARN_UNITS, getLesson, unitProgress } from '@/lib/learn';
import { lessonHasExercises } from '@/lib/learnExerciseGen';
import type { LearnLesson } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  studied: Set<string>;
  /** Suggested next unfinished path lesson — shown as SUGGESTED. */
  currentId?: string;
  onSelect: (lesson: LearnLesson) => void;
};

export function LearnPath({ studied, currentId, onSelect }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(LEARN_UNITS.map((u) => [u.id, true])),
  );

  function toggle(unitId: string) {
    setExpanded((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  }

  let pathOffset = 0;

  return (
    <View style={styles.wrap}>
      {LEARN_UNITS.map((unit, ui) => {
        const prog = unitProgress(unit, studied);
        const lessons = unit.lessonIds
          .map((id) => getLesson(id))
          .filter((l): l is LearnLesson => !!l);
        const open = expanded[unit.id] !== false;
        const startIndex = pathOffset;
        pathOffset += lessons.length;

        return (
          <View key={unit.id} style={styles.unit}>
            <FadeInUp delayMs={40 + ui * 40} waitForLaunch={false}>
              <PressableScale
                haptic="light"
                scaleTo={0.98}
                onPress={() => toggle(unit.id)}
                style={[styles.unitHeader, prog.complete && styles.unitHeaderDone, open && styles.unitHeaderOpen]}
              >
                <Text style={styles.chevron}>{open ? '▾' : '▸'}</Text>
                <View style={styles.unitText}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitBlurb} numberOfLines={open ? 3 : 1}>
                    {unit.blurb}
                  </Text>
                </View>
                <View style={[styles.ring, prog.complete && styles.ringDone]}>
                  <Text style={[styles.ringText, prog.complete && styles.ringTextDone]}>
                    {prog.complete ? '✓' : `${prog.done}/${prog.total}`}
                  </Text>
                </View>
              </PressableScale>
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

            {open ? (
              <View style={styles.pathColumn}>
                {lessons.map((lesson, li) => {
                  const idx = startIndex + li;
                  const side = idx % 2 === 0 ? 'left' : 'right';
                  const done = studied.has(lesson.id);
                  const showNow = !done && lesson.id === currentId;

                  return (
                    <FadeInUp key={lesson.id} delayMs={40 + li * 28} waitForLaunch={false}>
                      <View style={styles.stepRow}>
                        {li > 0 ? (
                          <View
                            style={[
                              styles.connector,
                              (done || showNow) && styles.connectorLit,
                            ]}
                          />
                        ) : null}
                        <View
                          style={[
                            styles.nodeSlot,
                            side === 'left' ? styles.slotLeft : styles.slotRight,
                          ]}
                        >
                          <PressableScale
                            haptic={showNow ? 'medium' : 'light'}
                            scaleTo={0.92}
                            onPress={() => onSelect(lesson)}
                            style={[
                              styles.node,
                              done && styles.nodeDone,
                              showNow && styles.nodeCurrent,
                            ]}
                          >
                            <Text
                              style={[
                                styles.nodeGlyph,
                                done && styles.nodeGlyphDone,
                                showNow && styles.nodeGlyphCurrent,
                              ]}
                            >
                              {done ? '✓' : idx + 1}
                            </Text>
                          </PressableScale>
                          <View
                            style={[
                              styles.nodeMeta,
                              side === 'right' && styles.nodeMetaRight,
                            ]}
                          >
                            <Text
                              style={[styles.nodeTitle, showNow && styles.nodeTitleCurrent]}
                              numberOfLines={2}
                            >
                              {lesson.title}
                            </Text>
                            <View
                              style={[
                                styles.featRow,
                                side === 'right' && styles.featRowRight,
                              ]}
                            >
                              {lessonHasExercises(lesson.id) ? (
                                <Text style={styles.featCheck}>CHECK</Text>
                              ) : null}
                              {lesson.visualization ? (
                                <Text style={styles.featViz}>VIZ</Text>
                              ) : null}
                            </View>
                            {showNow ? <Text style={styles.now}>SUGGESTED</Text> : null}
                            {done ? <Text style={styles.cleared}>CLEARED</Text> : null}
                          </View>
                        </View>
                      </View>
                    </FadeInUp>
                  );
                })}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  unit: { gap: spacing.sm },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  unitHeaderOpen: {
    borderColor: colors.chipSelectedBorder,
  },
  unitHeaderDone: {
    borderColor: colors.accentDim,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '800',
    width: 18,
    textAlign: 'center',
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
  featRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featRowRight: {
    justifyContent: 'flex-end',
  },
  featCheck: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  featViz: {
    color: colors.xp,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
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
});
