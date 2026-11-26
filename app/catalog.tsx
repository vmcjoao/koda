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
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAttempt } from '@/contexts/AttemptContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { relativeDifficulty } from '@/lib/habit';
import { addProblemToPlaylistFlow } from '@/lib/playlistPicker';
import {
  addProblemToPlaylist,
  getPlaylist,
  removeProblemFromPlaylist,
  type Playlist,
} from '@/lib/playlists';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

type SourceFilter = 'All' | string;
type DiffFilter = 'All' | '≤1200' | '1200–1600' | '1600+';
type StatusFilter = 'All' | 'Unattempted' | 'Needs work' | 'Favorites';

export default function CatalogScreen() {
  const { topic: topicParam, addTo } = useLocalSearchParams<{
    topic?: string;
    addTo?: string;
  }>();
  const { user, profile } = useAuth();
  const { beginProblem } = useAttempt();
  const band = profile?.rating_band ?? 1200;
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [targetPlaylist, setTargetPlaylist] = useState<Playlist | null>(null);
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
        const [p, a, favs, pl] = await Promise.all([
          fetchProblems(),
          fetchAttempts(user?.id ?? null),
          getFavorites(user?.id ?? null),
          addTo ? getPlaylist(addTo) : Promise.resolve(null),
        ]);
        if (!active) return;
        setProblems(p);
        setAttempts(a);
        setFavorites(favs);
        setTargetPlaylist(pl);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user?.id, topicParam, addTo]),
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
      if (status === 'Favorites' && !favorites.includes(p.id)) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.source} ${p.target_complexity} ${p.approaches
        .flatMap((a) => a.paradigms)
        .join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [problems, query, source, diff, topic, status, bestByProblem, favorites]);

  function start(p: ProblemWithApproaches) {
    beginProblem(p);
    router.push(`/problem/${p.id}`);
  }

  async function onToggleFavorite(id: string) {
    const next = await toggleFavorite(id, user?.id ?? null);
    setFavorites(next);
  }

  async function onTogglePlaylistMembership(problemId: string) {
    if (!targetPlaylist) return;
    const inList = targetPlaylist.problemIds.includes(problemId);
    const next = inList
      ? await removeProblemFromPlaylist(targetPlaylist.id, problemId)
      : await addProblemToPlaylist(targetPlaylist.id, problemId);
    if (next) setTargetPlaylist(next);
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Catalog</Text>
      <Text style={styles.sub}>
        {filtered.length} of {problems.length} problems
        {topic ? ` · ${topic}` : ''}
      </Text>

      <PrimaryButton
        label="Playlists"
        variant="secondary"
        onPress={() => router.push('/playlists')}
      />

      {targetPlaylist ? (
        <Pressable
          style={styles.topicBanner}
          onPress={() => router.push(`/playlists/${targetPlaylist.id}`)}
        >
          <Text style={styles.topicBannerText}>
            Adding to “{targetPlaylist.name}” · tap a card to toggle · open playlist ▸
          </Text>
        </Pressable>
      ) : null}

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
        {(['All', 'Unattempted', 'Needs work', 'Favorites'] as StatusFilter[]).map((s) => (
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
        const fav = favorites.includes(p.id);
        const inTarget = !!targetPlaylist?.problemIds.includes(p.id);
        return (
          <Pressable
            key={p.id}
            style={[styles.card, inTarget && styles.cardInPlaylist]}
            onPress={() => {
              if (targetPlaylist) {
                onTogglePlaylistMembership(p.id);
                return;
              }
              start(p);
            }}
          >
            <View style={styles.cardTop}>
              <Text style={styles.source}>{p.source}</Text>
              <View style={styles.cardTopRight}>
                {!targetPlaylist ? (
                  <Pressable
                    hitSlop={12}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      addProblemToPlaylistFlow(p.id, p.title);
                    }}
                  >
                    <Text style={styles.addPl}>＋</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  hitSlop={12}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onToggleFavorite(p.id);
                  }}
                >
                  <Text style={[styles.star, fav && styles.starOn]}>{fav ? '★' : '☆'}</Text>
                </Pressable>
                <Text style={styles.rating}>{p.difficulty_rating}</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{p.title}</Text>
            <Text style={styles.meta}>
              {p.target_complexity} · {relativeDifficulty(p.difficulty_rating, band)}
              {best != null ? ` · best ${best}%` : ''}
              {inTarget ? ' · in playlist' : ''}
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
  cardInPlaylist: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  addPl: {
    color: colors.radar,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  source: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  star: {
    color: colors.textDim,
    fontSize: 18,
  },
  starOn: {
    color: colors.warning,
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
