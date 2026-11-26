import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { CodeBlock } from '@/components/learn/CodeBlock';
import { VizPlayer } from '@/components/learn/VizPlayer';
import { MarkdownMath } from '@/components/MarkdownMath';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAttempt } from '@/contexts/AttemptContext';
import { fetchProblems } from '@/lib/api';
import { getLesson, pickPracticeProblems } from '@/lib/learn';
import type { ProblemWithApproaches } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function LearnLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const lesson = getLesson(String(id ?? ''));
  const { beginProblem } = useAttempt();
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lesson) navigation.setOptions({ title: lesson.title });
  }, [lesson, navigation]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const p = await fetchProblems();
        if (!active) return;
        setProblems(p);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const practice = useMemo(
    () => (lesson ? pickPracticeProblems(lesson, problems) : []),
    [lesson, problems],
  );

  if (!lesson) {
    return (
      <Screen>
        <Text style={styles.missing}>Lesson not found.</Text>
        <PrimaryButton label="Back to Learn" onPress={() => router.back()} />
      </Screen>
    );
  }

  function start(p: ProblemWithApproaches) {
    beginProblem(p);
    router.push(`/problem/${p.id}`);
  }

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <Text style={styles.kicker}>{lesson.tagLabel}</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.summary}>{lesson.summary}</Text>
      </FadeInUp>

      <FadeInUp delayMs={80} waitForLaunch={false}>
        <Text style={styles.section}>Usage</Text>
        <View style={styles.card}>
          <MarkdownMath
            markdown={lesson.usage_md}
            minHeight={Math.min(420, Math.max(180, 100 + lesson.usage_md.length * 0.45))}
            embedded
          />
        </View>
      </FadeInUp>

      <FadeInUp delayMs={120} waitForLaunch={false}>
        <Text style={styles.section}>Complexity</Text>
        <View style={styles.complexityRow}>
          <View style={styles.complexityCell}>
            <Text style={styles.complexityLabel}>Time</Text>
            <Text style={styles.complexityValue}>{lesson.complexity.time}</Text>
          </View>
          <View style={styles.complexityCell}>
            <Text style={styles.complexityLabel}>Memory</Text>
            <Text style={styles.complexityValue}>{lesson.complexity.extraMemory}</Text>
          </View>
        </View>
        {lesson.complexity.notes_md ? (
          <Text style={styles.note}>{lesson.complexity.notes_md}</Text>
        ) : null}
      </FadeInUp>

      {lesson.visualization ? (
        <FadeInUp delayMs={160} waitForLaunch={false}>
          <Text style={styles.section}>Visualization</Text>
          <VizPlayer kind={lesson.visualization.kind} demo={lesson.visualization.demo} />
        </FadeInUp>
      ) : null}

      <FadeInUp delayMs={200} waitForLaunch={false}>
        <Text style={styles.section}>
          Implementation ({lesson.implementation.language === 'cpp' ? 'C++' : lesson.implementation.language})
        </Text>
        <CodeBlock
          code={lesson.implementation.code}
          language={lesson.implementation.language}
        />
        {lesson.implementation.notes_md ? (
          <Text style={styles.note}>{lesson.implementation.notes_md}</Text>
        ) : null}
      </FadeInUp>

      <FadeInUp delayMs={240} waitForLaunch={false}>
        <Text style={styles.section}>Practice</Text>
        <Text style={styles.practiceHint}>
          Up to 3 easier catalog problems for today — rotates daily.
        </Text>
        {loading ? <ActivityIndicator color={colors.accent} /> : null}
        {!loading && practice.length === 0 ? (
          <View style={styles.emptyPractice}>
            <Text style={styles.emptyTitle}>Catalog still thin for this tag</Text>
            <Text style={styles.emptySub}>
              Ingest more problems tagged “{lesson.tagLabel}” to fill practice picks.
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
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    overflow: 'hidden',
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
  note: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
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
});
