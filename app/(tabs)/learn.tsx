import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { LearnPath } from '@/components/learn/LearnPath';
import { Screen } from '@/components/ui/Screen';
import {
  filterLessons,
  listLessons,
  nextStudyPathLesson,
  studyPathLessons,
} from '@/lib/learn';
import { lessonHasExercises } from '@/lib/learnExerciseGen';
import { getStudiedLessonIds } from '@/lib/learnProgress';
import { LEARN_FAMILY_LABELS, type LearnFamily, type LearnLesson } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

const FAMILY_ORDER: LearnFamily[] = [
  'techniques',
  'graphs',
  'search',
  'structures',
  'dp',
  'math',
  'strings',
  'geometry',
];

type Mode = 'path' | 'library';
type FamilyFilter = 'all' | LearnFamily;

export default function LearnScreen() {
  const allLessons = useMemo(() => listLessons(), []);
  const pathLessons = useMemo(() => studyPathLessons(), []);
  const [mode, setMode] = useState<Mode>('path');
  const [query, setQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState<FamilyFilter>('all');
  const [studied, setStudied] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const ids = await getStudiedLessonIds();
        if (active) setStudied(ids);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const continueLesson = useMemo(() => nextStudyPathLesson(studied), [studied]);
  const pathDone = useMemo(
    () => pathLessons.reduce((n, l) => n + (studied.has(l.id) ? 1 : 0), 0),
    [pathLessons, studied],
  );
  const pathComplete = pathDone >= pathLessons.length && pathLessons.length > 0;

  const lessons = useMemo(() => {
    let list = filterLessons(query);
    if (familyFilter !== 'all') {
      list = list.filter((l) => l.family === familyFilter);
    }
    return list;
  }, [query, familyFilter]);

  const byFamily = useMemo(() => {
    const map = new Map<LearnFamily, LearnLesson[]>();
    for (const f of FAMILY_ORDER) map.set(f, []);
    for (const l of lessons) {
      const list = map.get(l.family) ?? [];
      list.push(l);
      map.set(l.family, list);
    }
    return map;
  }, [lessons]);

  const chips: { key: FamilyFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    ...FAMILY_ORDER.map((f) => ({ key: f as FamilyFilter, label: LEARN_FAMILY_LABELS[f] })),
  ];

  return (
    <Screen scroll>
      <FadeInUp delayMs={40} waitForLaunch={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>ALGORITHM DOJO</Text>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.sub}>
            {pathComplete
              ? `Path cleared · ${allLessons.length} lessons in the library`
              : `Suggested path ${pathDone}/${pathLessons.length} · jump in anywhere`}
          </Text>
        </View>
      </FadeInUp>

      <View style={styles.modeRow}>
        <Pressable
          onPress={() => setMode('path')}
          style={[styles.modeTab, mode === 'path' && styles.modeTabOn]}
        >
          <Text style={[styles.modeText, mode === 'path' && styles.modeTextOn]}>Path</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('library')}
          style={[styles.modeTab, mode === 'library' && styles.modeTabOn]}
        >
          <Text style={[styles.modeText, mode === 'library' && styles.modeTextOn]}>
            Library
          </Text>
        </Pressable>
      </View>

      {mode === 'path' ? (
        <>
          {continueLesson && !pathComplete ? (
            <FadeInUp delayMs={60} waitForLaunch={false}>
              <PressableScale
                haptic="medium"
                style={styles.continueCard}
                onPress={() => router.push(`/learn/${continueLesson.id}`)}
              >
                <Text style={styles.continueKicker}>CONTINUE</Text>
                <Text style={styles.continueTitle}>{continueLesson.title}</Text>
                <Text style={styles.continueSub} numberOfLines={2}>
                  {continueLesson.summary}
                </Text>
                <Text style={styles.continueCta}>Start lesson →</Text>
              </PressableScale>
            </FadeInUp>
          ) : null}

          {pathComplete ? (
            <FadeInUp delayMs={60} waitForLaunch={false}>
              <View style={styles.clearedBanner}>
                <Text style={styles.clearedKicker}>PATH COMPLETE</Text>
                <Text style={styles.clearedTitle}>You cleared the dojo path</Text>
                <Text style={styles.clearedSub}>
                  Browse the library for every lesson — or revisit any node below.
                </Text>
              </View>
            </FadeInUp>
          ) : null}

          <LearnPath
            studied={studied}
            currentId={pathComplete ? undefined : continueLesson?.id}
            onSelect={(lesson) => router.push(`/learn/${lesson.id}`)}
          />
        </>
      ) : (
        <>
          <TextInput
            style={styles.search}
            placeholder="Search lessons, tags, families…"
            placeholderTextColor={colors.textDim}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
            style={styles.chipScroll}
          >
            {chips.map((c) => {
              const on = familyFilter === c.key;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setFamilyFilter(c.key)}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {lessons.length === 0 ? (
            <Text style={styles.empty}>No lessons match your filters.</Text>
          ) : null}

          {FAMILY_ORDER.map((family, fi) => {
            const group = byFamily.get(family) ?? [];
            if (!group.length) return null;
            return (
              <FadeInUp key={family} delayMs={80 + fi * 30} waitForLaunch={false}>
                <Text style={styles.section}>
                  {LEARN_FAMILY_LABELS[family]}
                  <Text style={styles.sectionCount}> · {group.length}</Text>
                </Text>
                <View style={styles.gap}>
                  {group.map((l) => {
                    const done = studied.has(l.id);
                    return (
                      <PressableScale
                        key={l.id}
                        style={[styles.card, done && styles.cardDone]}
                        onPress={() => router.push(`/learn/${l.id}`)}
                      >
                        <View style={styles.cardTop}>
                          <Text style={styles.tag}>
                            {l.tagKind === 'paradigm'
                              ? 'Paradigm'
                              : l.tagKind === 'data_structure'
                                ? 'Structure'
                                : l.tagLabel}
                          </Text>
                          <View style={styles.badges}>
                            {done ? <Text style={styles.doneBadge}>DONE</Text> : null}
                            {lessonHasExercises(l.id) ? (
                              <Text style={styles.checkBadge}>CHECK</Text>
                            ) : null}
                            {l.visualization ? <Text style={styles.vizBadge}>VIZ</Text> : null}
                            {l.tagKind && l.tagKind !== 'algorithm' ? (
                              <Text style={styles.kindBadge} numberOfLines={1}>
                                {l.tagLabel}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        <Text style={styles.cardTitle}>{l.title}</Text>
                        <Text style={styles.summary} numberOfLines={2}>
                          {l.summary}
                        </Text>
                        <Text style={styles.complexity}>
                          {l.complexity.time} · {l.complexity.extraMemory}
                        </Text>
                      </PressableScale>
                    );
                  })}
                </View>
              </FadeInUp>
            );
          })}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 4 },
  kicker: {
    color: colors.radar,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  modeRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  modeTabOn: {
    backgroundColor: colors.chipSelected,
  },
  modeText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '800',
  },
  modeTextOn: {
    color: colors.accent,
  },
  continueCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.chipSelected,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    gap: 4,
  },
  continueKicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  continueTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  continueSub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  continueCta: {
    color: colors.radar,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  clearedBanner: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    gap: 4,
  },
  clearedKicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  clearedTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  clearedSub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  search: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  chipScroll: { marginBottom: spacing.sm, flexGrow: 0 },
  chipRow: { gap: 8, paddingRight: spacing.md },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  chipTextOn: { color: colors.accent },
  empty: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionCount: {
    color: colors.textDim,
    fontWeight: '600',
    fontSize: 14,
  },
  gap: { gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  cardDone: {
    borderColor: colors.accentDim,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tag: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flexShrink: 1,
  },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  kindBadge: {
    color: colors.radar,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    maxWidth: 120,
  },
  vizBadge: {
    color: colors.xp,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  checkBadge: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  doneBadge: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  summary: {
    color: colors.textMuted,
    fontSize: 13,
  },
  complexity: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: 'SpaceMono',
    marginTop: 4,
  },
});
