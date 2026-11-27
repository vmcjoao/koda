import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { XpChip } from '@/components/game/XpChip';
import { CodeBlock } from '@/components/learn/CodeBlock';
import { LessonExercise } from '@/components/learn/LessonExercise';
import { VizPlayer } from '@/components/learn/VizPlayer';
import { ProseCard } from '@/components/ProseCard';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fetchProblems } from '@/lib/api';
import {
  getLesson,
  nextPathLessonAfter,
  pickPracticeProblems,
  relatedLessons,
  STUDY_PATH_IDS,
} from '@/lib/learn';
import { buildExercises, lessonHasExercises } from '@/lib/learnExerciseGen';
import { openProblem } from '@/lib/openProblem';
import { isLessonStudied, setLessonStudied } from '@/lib/learnProgress';
import type { ProblemWithApproaches } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

type StageId =
  | 'briefing'
  | 'stats'
  | 'replay'
  | 'loadout'
  | 'check'
  | 'encounters'
  | 'clear';

type Stage = {
  id: StageId;
  label: string;
  kicker: string;
};

function buildStages(hasViz: boolean, hasExercises: boolean): Stage[] {
  const stages: Stage[] = [
    { id: 'briefing', label: 'Brief', kicker: 'MISSION BRIEFING' },
    { id: 'stats', label: 'Stats', kicker: 'COST RADAR' },
  ];
  if (hasViz) stages.push({ id: 'replay', label: 'Replay', kicker: 'LIVE REPLAY' });
  stages.push({ id: 'loadout', label: 'Code', kicker: 'LOADOUT' });
  if (hasExercises) stages.push({ id: 'check', label: 'Check', kicker: 'SKILL CHECK' });
  stages.push(
    { id: 'encounters', label: 'Drill', kicker: 'ENCOUNTERS' },
    { id: 'clear', label: 'Clear', kicker: 'CLEAR THE NODE' },
  );
  return stages;
}

export default function LearnLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const lesson = getLesson(String(id ?? ''));
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [loading, setLoading] = useState(true);
  const [studied, setStudied] = useState(false);
  const [justCleared, setJustCleared] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [drillSeed, setDrillSeed] = useState(() => Date.now());

  const hasExercises = !!lesson && lessonHasExercises(lesson.id);
  const drills = useMemo(
    () => (lesson && hasExercises ? buildExercises(lesson.id, drillSeed) : []),
    [lesson, hasExercises, drillSeed],
  );

  const stages = useMemo(
    () => buildStages(!!lesson?.visualization, hasExercises),
    [lesson?.visualization, hasExercises],
  );
  const stage = stages[Math.min(stageIndex, stages.length - 1)]!;
  const progress = (stageIndex + 1) / Math.max(1, stages.length);

  const clearPulse = useSharedValue(1);
  const clearStyle = useAnimatedStyle(() => ({
    transform: [{ scale: clearPulse.value }],
  }));

  useEffect(() => {
    if (lesson) navigation.setOptions({ title: lesson.title });
  }, [lesson, navigation]);

  useEffect(() => {
    setStageIndex(0);
    setJustCleared(false);
    setDrillSeed(Date.now());
  }, [lesson?.id]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [p, done] = await Promise.all([
          fetchProblems(),
          lesson ? isLessonStudied(lesson.id) : Promise.resolve(false),
        ]);
        if (!active) return;
        setProblems(p);
        setStudied(done);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [lesson]),
  );

  const practice = useMemo(
    () => (lesson ? pickPracticeProblems(lesson, problems) : []),
    [lesson, problems],
  );
  const related = useMemo(() => (lesson ? relatedLessons(lesson) : []), [lesson]);
  const pathIndex = lesson ? STUDY_PATH_IDS.indexOf(lesson.id) : -1;
  const nextOnPath = lesson ? nextPathLessonAfter(lesson.id) : undefined;

  if (!lesson) {
    return (
      <Screen>
        <Text style={styles.missing}>Lesson not found.</Text>
        <PrimaryButton label="Back to Learn" onPress={() => router.back()} />
      </Screen>
    );
  }

  const current = lesson;

  function start(p: ProblemWithApproaches) {
    openProblem(p);
  }

  async function bumpHaptic(kind: 'light' | 'medium' | 'success' = 'light') {
    try {
      if (kind === 'success') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (kind === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      /* optional */
    }
  }

  function goStage(next: number) {
    const clamped = Math.max(0, Math.min(stages.length - 1, next));
    setStageIndex(clamped);
    void bumpHaptic(clamped > stageIndex ? 'medium' : 'light');
  }

  function advance() {
    if (stageIndex < stages.length - 1) goStage(stageIndex + 1);
  }

  async function completeLesson() {
    if (!studied) {
      setStudied(true);
      setJustCleared(true);
      await setLessonStudied(current.id, true);
      clearPulse.value = withSequence(
        withTiming(1.08, { duration: 160 }),
        withSpring(1, { damping: 10, stiffness: 180 }),
      );
      await bumpHaptic('success');
    }
  }

  async function undoStudied() {
    setStudied(false);
    setJustCleared(false);
    await setLessonStudied(current.id, false);
    await bumpHaptic('light');
  }

  const kindLabel =
    current.tagKind === 'paradigm'
      ? 'Paradigm'
      : current.tagKind === 'data_structure'
        ? 'Structure'
        : 'Algorithm';

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.kicker}>
              {kindLabel} · {current.tagLabel}
            </Text>
            {pathIndex >= 0 ? (
              <Text style={styles.pathChip}>
                STEP {pathIndex + 1}/{STUDY_PATH_IDS.length}
              </Text>
            ) : (
              <Text style={styles.pathChip}>LIBRARY</Text>
            )}
          </View>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.summary}>{current.summary}</Text>

          <View style={styles.runTrack}>
            <View style={[styles.runFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stageRow}
          >
            {stages.map((s, i) => {
              const done = i < stageIndex || (studied && s.id === 'clear');
              const active = i === stageIndex;
              return (
                <PressableScale
                  key={s.id}
                  haptic="light"
                  scaleTo={0.94}
                  onPress={() => goStage(i)}
                  style={[
                    styles.stageNode,
                    done && styles.stageNodeDone,
                    active && styles.stageNodeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stageIndex,
                      done && styles.stageIndexDone,
                      active && styles.stageIndexActive,
                    ]}
                  >
                    {done && !active ? '✓' : i + 1}
                  </Text>
                  <Text
                    style={[styles.stageLabel, active && styles.stageLabelActive]}
                    numberOfLines={1}
                  >
                    {s.label}
                  </Text>
                </PressableScale>
              );
            })}
          </ScrollView>
        </View>
      </FadeInUp>

      <FadeInUp key={stage.id} delayMs={40} waitForLaunch={false}>
        <View style={styles.stagePanel}>
          <Text style={styles.stageKicker}>{stage.kicker}</Text>

          {stage.id === 'briefing' ? (
            <View style={styles.stageBody}>
              <Text style={styles.stagePrompt}>When does this tool show up?</Text>
              <ProseCard markdown={current.usage_md} />
            </View>
          ) : null}

          {stage.id === 'stats' ? (
            <View style={styles.stageBody}>
              <Text style={styles.stagePrompt}>Know the cost before you cast it.</Text>
              <View style={styles.complexityRow}>
                <View style={[styles.statCard, styles.statTime]}>
                  <Text style={styles.statLabel}>TIME</Text>
                  <Text style={styles.statValue}>{current.complexity.time}</Text>
                </View>
                <View style={[styles.statCard, styles.statMem]}>
                  <Text style={styles.statLabel}>MEMORY</Text>
                  <Text style={[styles.statValue, styles.statValueMem]}>
                    {current.complexity.extraMemory}
                  </Text>
                </View>
              </View>
              {current.complexity.notes_md ? (
                <ProseCard markdown={current.complexity.notes_md} />
              ) : null}
            </View>
          ) : null}

          {stage.id === 'replay' && current.visualization ? (
            <View style={styles.stageBody}>
              <Text style={styles.stagePrompt}>Watch the pattern move.</Text>
              <VizPlayer
                kind={current.visualization.kind}
                demo={current.visualization.demo}
              />
            </View>
          ) : null}

          {stage.id === 'loadout' ? (
            <View style={styles.stageBody}>
              <Text style={styles.stagePrompt}>
                Steal the template —{' '}
                {current.implementation.language === 'cpp'
                  ? 'C++'
                  : current.implementation.language}
              </Text>
              <CodeBlock
                code={current.implementation.code}
                language={current.implementation.language}
              />
              {current.implementation.notes_md ? (
                <ProseCard markdown={current.implementation.notes_md} />
              ) : null}
            </View>
          ) : null}

          {stage.id === 'check' && drills.length ? (
            <View style={styles.stageBody}>
              <Text style={styles.stagePrompt}>Prove you can drive it.</Text>
              <Text style={styles.practiceHint}>
                {drills.reduce(
                  (n, e) => n + (e.kind === 'mcq' ? 1 : e.steps.length),
                  0,
                )}{' '}
                beats this run · graphs and arrays reshuffle when you reroll.
              </Text>
              <LessonExercise
                exercises={drills}
                onRetryFresh={() => setDrillSeed(Date.now())}
              />
            </View>
          ) : null}

          {stage.id === 'encounters' ? (
            <View style={styles.stageBody}>
              <Text style={styles.stagePrompt}>Warm up on live catalog fights.</Text>
              <Text style={styles.practiceHint}>
                Up to 3 easier picks for “{current.tagLabel}” — rotates daily.
              </Text>
              {loading ? <ActivityIndicator color={colors.accent} /> : null}
              {!loading && practice.length === 0 ? (
                <View style={styles.emptyPractice}>
                  <Text style={styles.emptyTitle}>No encounters queued</Text>
                  <Text style={styles.emptySub}>
                    Nothing in the catalog matches this tag right now — skip ahead and clear
                    the node, or check the library tomorrow.
                  </Text>
                </View>
              ) : null}
              {practice.map((p, i) => {
                const role = i === 0 ? 'WARM-UP' : i === 1 ? 'TARGET' : 'BOSS';
                const roleStyle =
                  i === 0 ? styles.roleWarm : i === 1 ? styles.roleTarget : styles.roleBoss;
                return (
                  <PressableScale
                    key={p.id}
                    haptic={i === 2 ? 'medium' : 'light'}
                    style={[styles.practiceCard, i === 2 && styles.practiceBoss]}
                    onPress={() => start(p)}
                  >
                    <View style={styles.practiceTop}>
                      <Text style={[styles.practiceBadge, roleStyle]}>{role}</Text>
                      <Text style={styles.rating}>{p.difficulty_rating}</Text>
                    </View>
                    <Text style={styles.practiceSource}>{p.source}</Text>
                    <Text style={styles.practiceTitle}>{p.title}</Text>
                    <Text style={styles.practiceCta}>Enter encounter →</Text>
                  </PressableScale>
                );
              })}
            </View>
          ) : null}

          {stage.id === 'clear' ? (
            <View style={styles.stageBody}>
              <Animated.View style={[styles.clearHero, clearStyle]}>
                {justCleared || studied ? (
                  <>
                    <Text style={styles.clearTitle}>Node cleared</Text>
                    <View style={styles.chipRow}>
                      <XpChip label="DOJO +1" tone="accent" />
                      {pathIndex >= 0 ? (
                        <XpChip label={`STEP ${pathIndex + 1}`} tone="xp" delayMs={80} />
                      ) : null}
                    </View>
                    <Text style={styles.clearSub}>
                      {nextOnPath
                        ? `Suggested next: ${nextOnPath.title}`
                        : 'This path node is done — roam the library or path.'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.clearTitle}>Ready to clear?</Text>
                    <Text style={styles.clearSub}>
                      Mark the lesson studied to tick this node on your path.
                    </Text>
                  </>
                )}
              </Animated.View>

              {!studied ? (
                <PrimaryButton label="Clear lesson" onPress={completeLesson} />
              ) : (
                <>
                  <View style={styles.doneRow}>
                    <Text style={styles.doneLabel}>Cleared ✓</Text>
                    <PressableScale onPress={undoStudied} haptic="light">
                      <Text style={styles.undo}>Undo</Text>
                    </PressableScale>
                  </View>
                  {nextOnPath ? (
                    <PrimaryButton
                      label={`Next: ${nextOnPath.title}`}
                      onPress={() => router.replace(`/learn/${nextOnPath.id}`)}
                    />
                  ) : (
                    <PrimaryButton
                      label="Back to path"
                      variant="secondary"
                      onPress={() => router.replace('/(tabs)/learn')}
                    />
                  )}
                </>
              )}

              {related.length ? (
                <View style={styles.relatedBlock}>
                  <Text style={styles.relatedLabel}>Side quests</Text>
                  {related.map((r) => (
                    <PressableScale
                      key={r.id}
                      style={styles.relatedCard}
                      onPress={() => router.push(`/learn/${r.id}`)}
                    >
                      <Text style={styles.relatedTitle}>{r.title}</Text>
                      <Text style={styles.relatedSummary} numberOfLines={2}>
                        {r.summary}
                      </Text>
                    </PressableScale>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </FadeInUp>

      {stage.id !== 'clear' ? (
        <FadeInUp delayMs={80} waitForLaunch={false}>
          <View style={styles.footer}>
            {stageIndex > 0 ? (
              <PrimaryButton
                label="Back"
                variant="secondary"
                onPress={() => goStage(stageIndex - 1)}
                style={styles.footerBack}
              />
            ) : (
              <View style={styles.footerBack} />
            )}
            <PrimaryButton
              label={stageIndex === stages.length - 2 ? 'Finish run' : 'Continue'}
              onPress={advance}
              style={styles.footerNext}
            />
          </View>
        </FadeInUp>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { color: colors.textMuted, fontSize: 16 },
  hero: { gap: spacing.sm, marginBottom: spacing.sm },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  pathChip: {
    color: colors.radar,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: 'SpaceMono',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  summary: {
    color: colors.textMuted,
    fontSize: 15,
  },
  runTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.runTrack,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  runFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  stageRow: {
    gap: 8,
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  stageNode: {
    minWidth: 72,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 2,
  },
  stageNodeDone: {
    borderColor: colors.accentDim,
    backgroundColor: colors.chipSelected,
  },
  stageNodeActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  stageIndex: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
  },
  stageIndexDone: { color: colors.accent },
  stageIndexActive: { color: colors.background },
  stageLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  stageLabelActive: { color: colors.background },
  stagePanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 220,
  },
  stageKicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  stagePrompt: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  stageBody: { gap: spacing.sm },
  complexityRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: 6,
  },
  statTime: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.xp,
  },
  statMem: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.radar,
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statValue: {
    color: colors.xp,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  statValueMem: { color: colors.radar },
  practiceHint: {
    color: colors.textDim,
    fontSize: 12,
  },
  emptyPractice: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  emptyTitle: { color: colors.textMuted, fontWeight: '700' },
  emptySub: { color: colors.textDim, fontSize: 13 },
  practiceCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 2,
  },
  practiceBoss: {
    borderColor: colors.warning,
    backgroundColor: 'rgba(245, 166, 35, 0.08)',
  },
  practiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  practiceBadge: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  roleWarm: { color: colors.accent },
  roleTarget: { color: colors.radar },
  roleBoss: { color: colors.warning },
  rating: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  practiceSource: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  practiceTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  practiceCta: {
    color: colors.radar,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  clearHero: {
    backgroundColor: colors.chipSelected,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    gap: spacing.sm,
  },
  clearTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  clearSub: {
    color: colors.textMuted,
    fontSize: 14,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  doneLabel: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  undo: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  relatedBlock: { gap: spacing.sm, marginTop: spacing.sm },
  relatedLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  relatedCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 2,
  },
  relatedTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  relatedSummary: {
    color: colors.textMuted,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  footerBack: { flex: 1 },
  footerNext: { flex: 2 },
});
