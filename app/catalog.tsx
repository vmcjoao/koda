import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { useAttempt } from '@/contexts/AttemptContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

type SourceFilter = 'All' | string;
type DiffFilter = 'All' | '≤1200' | '1200–1600' | '1600+';
type StatusFilter = 'All' | 'Unattempted' | 'Needs work';

export default function CatalogScreen() {
  const { topic: topicParam } = useLocalSearchParams<{ topic?: string }>();
  const { user } = useAuth();
  const { beginProblem } = useAttempt();
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<SourceFilter>('All');
  const [diff, setDiff] = useState<DiffFilter>('All');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [topic, setTopic] = useState<string | null>(topicParam ?? null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setTopic(topicParam ?? null);
      (async () => {
        setLoading(true);
        const [p, a] = await Promise.all([fetchProblems(), fetchAttempts(user?.id ?? null)]);
        if (!active) return;
        setProblems(p);
        setAttempts(a);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user?.id, topicParam]),
  );

  const sources = useMemo(() => {
    const set = new Set(problems.map((p) => p.source));
    return ['All', ...[...set].sort()] as SourceFilter[];
  }, [problems]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    for (const p of problems) {
      for (const a of p.approaches) {
        for (const t of a.paradigms) set.add(t);
      }
    }
    return [...set].sort();
  }, [problems]);

  const bestByProblem = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of attempts) {
      const prev = m.get(a.problem_id) ?? -1;
      if (a.score_accuracy > prev) m.set(a.problem_id, a.score_accuracy);
    }
    return m;
  }, [attempts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((p) => {
      if (source !== 'All' && p.source !== source) return false;
      if (diff === '≤1200' && p.difficulty_rating > 1200) return false;
      if (diff === '1200–1600' && (p.difficulty_rating < 1200 || p.difficulty_rating > 1600)) {
        return false;
      }
      if (diff === '1600+' && p.difficulty_rating < 1600) return false;
      if (topic && !p.approaches.some((a) => a.paradigms.includes(topic))) return false;
      const best = bestByProblem.get(p.id);
      if (status === 'Unattempted' && best != null) return false;
      if (status === 'Needs work' && !(best != null && best < 70)) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.source} ${p.target_complexity} ${p.approaches
        .flatMap((a) => a.paradigms)
        .join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [problems, query, source, diff, topic, status, bestByProblem]);

  function start(p: ProblemWithApproaches) {
    beginProblem(p);
    router.push(`/problem/${p.id}`);
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Catalog</Text>
      <Text style={styles.sub}>
        {filtered.length} of {problems.length} problems
        {topic ? ` · ${topic}` : ''}
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Search title, topic, complexity…"
        placeholderTextColor={colors.textDim}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {topic ? (
        <Pressable
          style={styles.topicBanner}
          onPress={() => {
            setTopic(null);
            router.setParams({ topic: undefined });
          }}
        >
          <Text style={styles.topicBannerText}>Practicing: {topic} · tap to clear</Text>
        </Pressable>
      ) : null}

      <Text style={styles.filterLabel}>Source</Text>
      <View style={styles.chips}>
        {sources.map((s) => (
          <Pressable
            key={s}
            onPress={() => setSource(s)}
            style={[styles.chip, source === s && styles.chipOn]}
          >
            <Text style={[styles.chipText, source === s && styles.chipTextOn]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.filterLabel}>Difficulty</Text>
      <View style={styles.chips}>
        {(['All', '≤1200', '1200–1600', '1600+'] as DiffFilter[]).map((d) => (
          <Pressable
            key={d}
            onPress={() => setDiff(d)}
            style={[styles.chip, diff === d && styles.chipOn]}
          >
            <Text style={[styles.chipText, diff === d && styles.chipTextOn]}>{d}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.filterLabel}>Progress</Text>
      <View style={styles.chips}>
        {(['All', 'Unattempted', 'Needs work'] as StatusFilter[]).map((s) => (
          <Pressable
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.chip, status === s && styles.chipOn]}
          >
            <Text style={[styles.chipText, status === s && styles.chipTextOn]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      {!topic ? (
        <>
          <Text style={styles.filterLabel}>Topic</Text>
          <View style={styles.chips}>
            {topics.slice(0, 10).map((t) => (
              <Pressable
                key={t}
                onPress={() => setTopic(t)}
                style={[styles.chip, topic === t && styles.chipOn]}
              >
                <Text style={[styles.chipText, topic === t && styles.chipTextOn]}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {filtered.map((p) => {
        const best = bestByProblem.get(p.id);
        return (
          <Pressable key={p.id} style={styles.card} onPress={() => start(p)}>
            <View style={styles.cardTop}>
              <Text style={styles.source}>{p.source}</Text>
              <Text style={styles.rating}>{p.difficulty_rating}</Text>
            </View>
            <Text style={styles.cardTitle}>{p.title}</Text>
            <Text style={styles.meta}>
              {p.target_complexity}
              {best != null ? ` · best ${best}%` : ''}
            </Text>
            <Text style={styles.topics} numberOfLines={1}>
              {[...new Set(p.approaches.flatMap((a) => a.paradigms))].join(' · ')}
            </Text>
          </Pressable>
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
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
  topicBanner: {
    backgroundColor: '#2A1818',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
  },
  topicBannerText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
  filterLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipOn: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextOn: {
    color: colors.accent,
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
  rating: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  topics: {
    color: colors.textDim,
    fontSize: 12,
  },
});
