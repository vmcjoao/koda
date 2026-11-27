import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { FilterBar } from '@/components/ui/FilterBar';
import { SortMenu } from '@/components/ui/SortMenu';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { relativeDifficulty } from '@/lib/habit';
import { openProblem } from '@/lib/openProblem';
import { addProblemToPlaylistFlow } from '@/lib/playlistPicker';
import {
  addProblemToPlaylist,
  getPlaylist,
  removeProblemFromPlaylist,
  type Playlist,
} from '@/lib/playlists';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

type DiffFilter = '≤1200' | '1200–1600' | '1600+';
type ProgressFilter = 'Unattempted' | 'Needs work' | 'Favorites';
type CatalogSort = 'diff_asc' | 'diff_desc' | 'title' | 'source';

const PAGE_SIZE = 20;
const TOPIC_PREVIEW = 10;

const DIFF_OPTIONS: DiffFilter[] = ['≤1200', '1200–1600', '1600+'];
const PROGRESS_OPTIONS: ProgressFilter[] = ['Unattempted', 'Needs work', 'Favorites'];
const CATALOG_SORTS: { id: CatalogSort; label: string }[] = [
  { id: 'diff_asc', label: 'Difficulty ↑' },
  { id: 'diff_desc', label: 'Difficulty ↓' },
  { id: 'title', label: 'Title' },
  { id: 'source', label: 'Source' },
];

export default function CatalogScreen() {
  const { topic: topicParam, addTo } = useLocalSearchParams<{
    topic?: string;
    addTo?: string;
  }>();
  const { user, profile } = useAuth();
  const band = profile?.rating_band ?? 1200;
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [targetPlaylist, setTargetPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sourcesSelected, setSourcesSelected] = useState<string[]>([]);
  const [diffSelected, setDiffSelected] = useState<string[]>([]);
  const [progressSelected, setProgressSelected] = useState<string[]>([]);
  const [topic, setTopic] = useState<string | null>(topicParam ?? null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [sort, setSort] = useState<CatalogSort>('diff_asc');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const sourceOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of problems) counts.set(p.source, (counts.get(p.source) ?? 0) + 1);
    return [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, count]) => ({ id, label: id, count }));
  }, [problems]);

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of problems) {
      for (const a of p.approaches) {
        for (const t of a.paradigms) counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, count]) => ({ id, label: id, count }));
  }, [problems]);

  const topicOptions = useMemo(() => {
    if (showAllTopics || topics.length <= TOPIC_PREVIEW) return topics;
    return topics.slice(0, TOPIC_PREVIEW);
  }, [topics, showAllTopics]);

  const bestByProblem = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of attempts) {
      const prev = m.get(a.problem_id) ?? -1;
      if (a.score_accuracy > prev) m.set(a.problem_id, a.score_accuracy);
    }
    return m;
  }, [attempts]);

  const progressOptions = useMemo(() => {
    let unattempted = 0;
    let needsWork = 0;
    let favCount = 0;
    for (const p of problems) {
      const best = bestByProblem.get(p.id);
      if (best == null) unattempted += 1;
      if (best != null && best < 70) needsWork += 1;
      if (favorites.includes(p.id)) favCount += 1;
    }
    return PROGRESS_OPTIONS.map((id) => ({
      id,
      label: id,
      count: id === 'Unattempted' ? unattempted : id === 'Needs work' ? needsWork : favCount,
    }));
  }, [problems, bestByProblem, favorites]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = problems.filter((p) => {
      if (sourcesSelected.length && !sourcesSelected.includes(p.source)) return false;
      if (diffSelected.length) {
        const ok = diffSelected.some((d) => {
          if (d === '≤1200') return p.difficulty_rating <= 1200;
          if (d === '1200–1600') return p.difficulty_rating >= 1200 && p.difficulty_rating <= 1600;
          if (d === '1600+') return p.difficulty_rating >= 1600;
          return false;
        });
        if (!ok) return false;
      }
      if (topic && !p.approaches.some((a) => a.paradigms.includes(topic))) return false;
      const best = bestByProblem.get(p.id);
      if (progressSelected.length) {
        const ok = progressSelected.some((s) => {
          if (s === 'Unattempted') return best == null;
          if (s === 'Needs work') return best != null && best < 70;
          if (s === 'Favorites') return favorites.includes(p.id);
          return false;
        });
        if (!ok) return false;
      }
      if (!q) return true;
      const hay = `${p.title} ${p.source} ${p.target_complexity} ${p.approaches
        .flatMap((a) => a.paradigms)
        .join(' ')}`.toLowerCase();
      return hay.includes(q);
    });

    return [...list].sort((a, b) => {
      if (sort === 'diff_desc') return b.difficulty_rating - a.difficulty_rating;
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'source') {
        const bySource = a.source.localeCompare(b.source);
        return bySource !== 0 ? bySource : a.title.localeCompare(b.title);
      }
      return a.difficulty_rating - b.difficulty_rating;
    });
  }, [
    problems,
    query,
    sourcesSelected,
    diffSelected,
    topic,
    progressSelected,
    bestByProblem,
    favorites,
    sort,
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, sourcesSelected, diffSelected, topic, progressSelected, sort]);

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );
  const hasMore = visibleCount < filtered.length;

  function loadMore() {
    if (!hasMore) return;
    setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length));
  }

  function start(p: ProblemWithApproaches) {
    openProblem(p);
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
    <Screen scroll onEndReached={loadMore}>
      <Text style={styles.title}>Catalog</Text>
      <Text style={styles.sub}>
        Showing {visible.length} of {filtered.length}
        {filtered.length !== problems.length ? ` · ${problems.length} total` : ''}
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

      <SortMenu
        options={CATALOG_SORTS}
        value={sort}
        onChange={(id) => setSort(id as CatalogSort)}
      />
      <FilterBar
        label="Source"
        options={sourceOptions}
        selected={sourcesSelected}
        onChange={setSourcesSelected}
        multi
      />
      <FilterBar
        label="Difficulty"
        options={DIFF_OPTIONS.map((id) => ({ id, label: id }))}
        selected={diffSelected}
        onChange={setDiffSelected}
        multi
      />
      <FilterBar
        label="Progress"
        options={progressOptions}
        selected={progressSelected}
        onChange={setProgressSelected}
        multi
      />

      {!topic ? (
        <>
          <FilterBar
            label="Topic"
            options={topicOptions}
            selected={[]}
            onChange={(next) => {
              const picked = next[0];
              if (picked) setTopic(picked);
            }}
          />
          {!showAllTopics && topics.length > TOPIC_PREVIEW ? (
            <Pressable onPress={() => setShowAllTopics(true)}>
              <Text style={styles.moreTopics}>
                More topics · {topics.length - TOPIC_PREVIEW} hidden
              </Text>
            </Pressable>
          ) : null}
          {showAllTopics && topics.length > TOPIC_PREVIEW ? (
            <Pressable onPress={() => setShowAllTopics(false)}>
              <Text style={styles.moreTopics}>Show fewer topics</Text>
            </Pressable>
          ) : null}
        </>
      ) : null}

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {visible.map((p) => {
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

      {!loading && hasMore ? (
        <Text style={styles.moreHint}>Scroll for more · {filtered.length - visible.length} left</Text>
      ) : null}
      {!loading && !hasMore && filtered.length > 0 ? (
        <Text style={styles.moreHint}>End of results</Text>
      ) : null}
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
  moreTopics: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
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
  moreHint: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
