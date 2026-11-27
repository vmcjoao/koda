import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { FilterBar } from '@/components/ui/FilterBar';
import { SortMenu } from '@/components/ui/SortMenu';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
import {
  filterAttemptsMulti,
  HISTORY_FILTER_LABELS,
  type HistoryFilter,
} from '@/lib/habit';
import { openProblem } from '@/lib/openProblem';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

const STRENGTH_FILTERS: HistoryFilter[] = ['strong', 'weak'];
const STATUS_FILTERS: HistoryFilter[] = ['drafted', 'needs_review', 'implemented_ac', 'radar'];

type HistorySort = 'newest' | 'oldest' | 'score';

const HISTORY_SORTS: { id: HistorySort; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'score', label: 'Score' },
];

function TagRow({ label, tags }: { label: string; tags: string[] }) {
  if (!tags.length) return null;
  return (
    <View style={styles.tagBlock}>
      <Text style={styles.tagLabel}>{label}</Text>
      <View style={styles.tagWrap}>
        {tags.map((t) => (
          <View key={`${label}-${t}`} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [problems, setProblems] = useState<Record<string, ProblemWithApproaches>>({});
  const [loading, setLoading] = useState(true);
  const [strengthFilters, setStrengthFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<HistorySort>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [a, p] = await Promise.all([fetchAttempts(user?.id ?? null), fetchProblems()]);
        if (!active) return;
        const map: Record<string, ProblemWithApproaches> = {};
        for (const item of p) map[item.id] = item;
        setAttempts(a);
        setProblems(map);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user?.id]),
  );

  const sourceOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of attempts) {
      const src = problems[a.problem_id]?.source;
      if (!src) continue;
      counts.set(src, (counts.get(src) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, count]) => ({ id, label: id, count }));
  }, [attempts, problems]);

  const strengthOptions = useMemo(
    () =>
      STRENGTH_FILTERS.map((id) => ({
        id,
        label: HISTORY_FILTER_LABELS[id],
        count: filterAttemptsMulti(attempts, [id]).length,
      })),
    [attempts],
  );

  const statusOptions = useMemo(
    () =>
      STATUS_FILTERS.map((id) => ({
        id,
        label: HISTORY_FILTER_LABELS[id],
        count: filterAttemptsMulti(attempts, [id]).length,
      })),
    [attempts],
  );

  const sorted = useMemo(() => {
    const filters = [
      ...strengthFilters,
      ...statusFilters,
    ] as HistoryFilter[];
    let list = filterAttemptsMulti(attempts, filters);
    if (sourceFilters.length) {
      list = list.filter((a) => {
        const src = problems[a.problem_id]?.source;
        return !!src && sourceFilters.includes(src);
      });
    }
    return [...list].sort((a, b) => {
      if (sort === 'score') return b.score_accuracy - a.score_accuracy;
      if (sort === 'oldest') return a.timestamp < b.timestamp ? -1 : 1;
      return a.timestamp < b.timestamp ? 1 : -1;
    });
  }, [attempts, strengthFilters, statusFilters, sourceFilters, problems, sort]);

  function reopen(a: UserAttempt) {
    const p = problems[a.problem_id];
    if (!p) return;
    openProblem(p, { priorAttempt: a, intent: 'retry' });
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Attempt history</Text>
      <Text style={styles.sub}>Past diagnoses — tap to retry a problem.</Text>

      <SortMenu
        options={HISTORY_SORTS}
        value={sort}
        onChange={(id) => setSort(id as HistorySort)}
      />
      <FilterBar
        label="Strength"
        options={strengthOptions}
        selected={strengthFilters}
        onChange={setStrengthFilters}
        multi
      />
      <FilterBar
        label="Status"
        options={statusOptions}
        selected={statusFilters}
        onChange={setStatusFilters}
        multi
      />
      {sourceOptions.length > 0 ? (
        <FilterBar
          label="Source"
          options={sourceOptions}
          selected={sourceFilters}
          onChange={setSourceFilters}
          multi
        />
      ) : null}

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {!loading && sorted.length === 0 ? (
        <Text style={styles.empty}>
          {attempts.length === 0
            ? 'No attempts yet. Finish a Daily Set problem to start logging.'
            : 'No attempts match these filters.'}
        </Text>
      ) : null}

      {sorted.map((a) => {
        const p = problems[a.problem_id];
        const when = new Date(a.timestamp);
        const timeLabel = Number.isNaN(when.getTime())
          ? a.timestamp
          : when.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
        const expanded = expandedId === a.id;
        const draft = a.pseudocode_draft?.trim() ?? '';
        const hasAnswers =
          a.selected_paradigms.length > 0 ||
          a.selected_algorithms.length > 0 ||
          a.selected_ds.length > 0 ||
          a.selected_twists.length > 0 ||
          !!a.guessed_complexity ||
          !!draft;
        return (
          <View key={a.id} style={styles.card}>
            <Pressable
              onPress={() => setExpandedId(expanded ? null : a.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
            >
              <View style={styles.cardTop}>
                <Text style={styles.source}>{p?.source ?? 'Problem'}</Text>
                <Text
                  style={[
                    styles.score,
                    a.score_accuracy >= 70 ? styles.scoreGood : styles.scoreWeak,
                  ]}
                >
                  {a.score_accuracy}%
                </Text>
              </View>
              <Text style={styles.cardTitle}>{p?.title ?? a.problem_id}</Text>
              <Text style={styles.meta}>
                {timeLabel} · {Math.round(a.time_spent_sec / 60)}m insight ·{' '}
                {a.status.replace('_', ' ')}
                {hasAnswers ? (expanded ? ' · hide' : ' · answers') : ''}
              </Text>
              {a.mistake_types?.length ? (
                <Text style={styles.miss} numberOfLines={1}>
                  {a.mistake_types.join(' · ')}
                </Text>
              ) : (
                <Text style={styles.ok}>Clean read</Text>
              )}
            </Pressable>

            {expanded ? (
              <View style={styles.detail}>
                <TagRow label="Paradigms" tags={a.selected_paradigms} />
                <TagRow label="Algorithms" tags={a.selected_algorithms} />
                <TagRow label="Data structures" tags={a.selected_ds} />
                <TagRow label="Twists" tags={a.selected_twists} />
                {a.guessed_complexity ? (
                  <Text style={styles.detailLine}>
                    Complexity guess: {a.guessed_complexity}
                    {a.complexity_bonus ? ' · radar bonus' : ''}
                  </Text>
                ) : a.complexity_bonus ? (
                  <Text style={styles.ok}>Radar bonus</Text>
                ) : null}
                {draft ? (
                  <View style={styles.draftBox}>
                    <Text style={styles.tagLabel}>Draft</Text>
                    <Text style={styles.draft} numberOfLines={6}>
                      {draft}
                    </Text>
                  </View>
                ) : null}
                {!hasAnswers ? (
                  <Text style={styles.emptyDetail}>No saved hypothesis for this attempt.</Text>
                ) : null}
                <Pressable onPress={() => reopen(a)} style={styles.reopen}>
                  <Text style={styles.reopenText}>Reopen problem</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  empty: {
    color: colors.textDim,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  source: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  score: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    fontWeight: '700',
  },
  scoreGood: {
    color: colors.accent,
  },
  scoreWeak: {
    color: colors.warning,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  miss: {
    color: colors.warning,
    fontSize: 12,
  },
  ok: {
    color: colors.accentDim,
    fontSize: 12,
  },
  detail: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  tagBlock: {
    gap: spacing.xs,
  },
  tagLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagChip: {
    backgroundColor: colors.chip,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  tagChipText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  detailLine: {
    color: colors.textMuted,
    fontSize: 13,
  },
  draftBox: {
    gap: spacing.xs,
  },
  draft: {
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  emptyDetail: {
    color: colors.textDim,
    fontSize: 12,
  },
  reopen: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  reopenText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
});
