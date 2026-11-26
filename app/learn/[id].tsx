import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { CodeBlock } from '@/components/learn/CodeBlock';
import { VizPlayer } from '@/components/learn/VizPlayer';
import { ProseCard } from '@/components/ProseCard';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAttempt } from '@/contexts/AttemptContext';
import { fetchProblems } from '@/lib/api';
import {
  getLesson,
  nextPathLessonAfter,
  pickPracticeProblems,
  relatedLessons,
  STUDY_PATH_IDS,
} from '@/lib/learn';
import { isLessonStudied, setLessonStudied } from '@/lib/learnProgress';
import type { ProblemWithApproaches } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function LearnLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const lesson = getLesson(String(id ?? ''));
  const { beginProblem } = useAttempt();
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [loading, setLoading] = useState(true);
  const [studied, setStudied] = useState(false);
  const [justCleared, setJustCleared] = useState(false);

  useEffect(() => {
    if (lesson) navigation.setOptions({ title: lesson.title });
  }, [lesson, navigation]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setJustCleared(false);
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
    beginProblem(p);
    router.push(`/problem/${p.id}`);
  }

  async function completeLesson() {
    if (!studied) {
      setStudied(true);
      setJustCleared(true);
      await setLessonStudied(current.id, true);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        /* haptic optional */
      }
    }
  }

  async function undoStudied() {
    setStudied(false);
    setJustCleared(false);
    await setLessonStudied(current.id, false);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* haptic optional */
    }
  }

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <Text style={styles.kicker}>
          {current.tagKind === 'paradigm'
            ? `Paradigm · ${current.tagLabel}`
            : current.tagKind === 'data_structure'
              ? `Data structure · ${current.tagLabel}`
              : current.tagLabel}
        </Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.summary}>{current.summary}</Text>
        {pathIndex >= 0 ? (
          <Text style={styles.pathBadge}>
            Path · step {pathIndex + 1}/{STUDY_PATH_IDS.length}
          </Text>
        ) : null}
        {justCleared ? (
          <View style={styles.clearedBanner}>
            <Text style={styles.clearedKicker}>LESSON CLEARED</Text>
            <Text style={styles.clearedText}>
              {nextOnPath
                ? `Suggested next: ${nextOnPath.title}`
                : 'Nice work — this path node is done.'}
            </Text>
          </View>
        ) : null}
      </FadeInUp>

      <FadeInUp delayMs={80} waitForLaunch={false}>
        <Text style={styles.section}>Usage</Text>
        <ProseCard markdown={current.usage_md} />
      </FadeInUp>

      <FadeInUp delayMs={120} waitForLaunch={false}>
        <Text style={styles.section}>Complexity</Text>
        <View style={styles.complexityRow}>
          <View style={styles.complexityCell}>
            <Text style={styles.complexityLabel}>Time</Text>
            <Text style={styles.complexityValue}>{current.complexity.time}</Text>
          </View>
          <View style={styles.complexityCell}>
            <Text style={styles.complexityLabel}>Memory</Text>
            <Text style={styles.complexityValue}>{current.complexity.extraMemory}</Text>
          </View>
        </View>
        {current.complexity.notes_md ? (
          <ProseCard markdown={current.complexity.notes_md} />
        ) : null}
      </FadeInUp>

      {current.visualization ? (
        <FadeInUp delayMs={160} waitForLaunch={false}>
          <Text style={styles.section}>Visualization</Text>
          <VizPlayer kind={current.visualization.kind} demo={current.visualization.demo} />
        </FadeInUp>
      ) : null}

      <FadeInUp delayMs={200} waitForLaunch={false}>
        <Text style={styles.section}>
          Implementation (
          {current.implementation.language === 'cpp' ? 'C++' : current.implementation.language})
        </Text>
        <CodeBlock
          code={current.implementation.code}
          language={current.implementation.language}
        />
        {current.implementation.notes_md ? (
          <ProseCard markdown={current.implementation.notes_md} />
        ) : null}
      </FadeInUp>

      {related.length ? (
        <FadeInUp delayMs={220} waitForLaunch={false}>
          <Text style={styles.section}>Related lessons</Text>
          <View style={styles.relatedGap}>
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
        </FadeInUp>
      ) : null}

      <FadeInUp delayMs={240} waitForLaunch={false}>
        <Text style={styles.section}>Practice</Text>
        <Text style={styles.practiceHint}>
          Up to 3 easier catalog problems for today — rotates daily.
        </Text>
        {loading ? <ActivityIndicator color={colors.accent} /> : null}
        {!loading && practice.length === 0 ? (
          <View style={styles.emptyPractice}>
            <Text style={styles.emptyTitle}>No practice picks right now</Text>
            <Text style={styles.emptySub}>
              No catalog problems currently match “{current.tagLabel}”. Pull to refresh the
              catalog or try again tomorrow.
            </Text>
          </View>
        ) : null}
        {practice.map((p, i) => (
          <PressableScale key={p.id} style={styles.practiceCard} onPress={() => start(p)}>
            <View style={styles.practiceTop}>
              <Text style={styles.practiceBadge}>#{i + 1}</Text>
              <Text style={styles.rating}>{p.difficulty_rating}</Text>
            </View>
            <Text style={styles.practiceSource}>{p.source}</Text>
            <Text style={styles.practiceTitle}>{p.title}</Text>
            <Text style={styles.practiceCta}>Open encounter →</Text>
          </PressableScale>
        ))}
      </FadeInUp>

      <FadeInUp delayMs={280} waitForLaunch={false}>
        <View style={styles.finishBlock}>
          {!studied ? (
            <PrimaryButton label="Complete lesson" onPress={completeLesson} />
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
              ) : pathIndex >= 0 ? (
                <PrimaryButton
                  label="Back to path"
                  variant="secondary"
                  onPress={() => router.replace('/(tabs)/learn')}
                />
              ) : null}
            </>
          )}
        </View>
      </FadeInUp>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { color: colors.textMuted, fontSize: 16 },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  summary: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  pathBadge: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  clearedBanner: {
    backgroundColor: colors.chipSelected,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    gap: 2,
    marginBottom: spacing.sm,
  },
  clearedKicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  clearedText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  complexityRow: { flexDirection: 'row', gap: spacing.sm },
  complexityCell: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  complexityLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  complexityValue: {
    color: colors.xp,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  relatedGap: { gap: spacing.sm },
  relatedCard: {
    backgroundColor: colors.surface,
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
  practiceHint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: -4,
  },
  emptyPractice: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  emptyTitle: { color: colors.textMuted, fontWeight: '700' },
  emptySub: { color: colors.textDim, fontSize: 13 },
  practiceCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 2,
  },
  practiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  practiceBadge: {
    color: colors.radar,
    fontSize: 11,
    fontWeight: '900',
  },
  rating: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  practiceSource: {
    color: colors.accent,
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
  finishBlock: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.chipSelected,
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
});
