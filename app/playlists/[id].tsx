import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fetchProblems } from '@/lib/api';
import {
  getPlaylist,
  removeProblemFromPlaylist,
  renamePlaylist,
  type Playlist,
} from '@/lib/playlists';
import { relativeDifficulty } from '@/lib/habit';
import { openProblem } from '@/lib/openProblem';
import { useAuth } from '@/contexts/AuthContext';
import type { ProblemWithApproaches } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useAuth();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [problems, setProblems] = useState<Record<string, ProblemWithApproaches>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [pl, all] = await Promise.all([getPlaylist(id), fetchProblems()]);
    const map: Record<string, ProblemWithApproaches> = {};
    for (const p of all) map[p.id] = p;
    setPlaylist(pl);
    setProblems(map);
    if (pl) {
      setName(pl.name);
      setDescription(pl.description);
    }
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const ordered = useMemo(() => {
    if (!playlist) return [];
    return playlist.problemIds
      .map((pid) => problems[pid])
      .filter((p): p is ProblemWithApproaches => !!p);
  }, [playlist, problems]);

  const missing = playlist
    ? playlist.problemIds.length - ordered.length
    : 0;

  function start(p: ProblemWithApproaches) {
    openProblem(p);
  }

  async function onSaveMeta() {
    if (!playlist) return;
    const next = await renamePlaylist(playlist.id, name, description);
    if (next) setPlaylist(next);
    setEditing(false);
  }

  function confirmRemove(problemId: string, title: string) {
    if (!playlist) return;
    Alert.alert('Remove from playlist?', title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const next = await removeProblemFromPlaylist(playlist.id, problemId);
          setPlaylist(next);
        },
      },
    ]);
  }

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  if (!playlist) {
    return (
      <Screen>
        <Text style={styles.empty}>Playlist not found.</Text>
        <PrimaryButton label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      {editing ? (
        <>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Description"
            placeholderTextColor={colors.textDim}
          />
          <PrimaryButton label="Save" onPress={onSaveMeta} />
          <PrimaryButton label="Cancel" variant="ghost" onPress={() => setEditing(false)} />
        </>
      ) : (
        <>
          <Text style={styles.title}>{playlist.name}</Text>
          {playlist.description ? <Text style={styles.sub}>{playlist.description}</Text> : null}
          <Text style={styles.meta}>
            {ordered.length} problem{ordered.length === 1 ? '' : 's'}
            {missing > 0 ? ` · ${missing} missing from catalog` : ''}
          </Text>
          <PrimaryButton label="Edit name" variant="ghost" onPress={() => setEditing(true)} />
        </>
      )}

      {ordered[0] ? (
        <PrimaryButton label="Start next" onPress={() => start(ordered[0])} />
      ) : (
        <Text style={styles.empty}>
          Empty playlist. Open Catalog and use “Add to playlist”, or create from a source.
        </Text>
      )}

      <PrimaryButton
        label="Browse catalog to add"
        variant="secondary"
        onPress={() => router.push({ pathname: '/catalog', params: { addTo: playlist.id } })}
      />

      {ordered.map((p, i) => (
        <Pressable
          key={p.id}
          style={styles.card}
          onPress={() => start(p)}
          onLongPress={() => confirmRemove(p.id, p.title)}
        >
          <View style={styles.cardTop}>
            <Text style={styles.index}>{i + 1}</Text>
            <Text style={styles.source}>{p.source}</Text>
            <Text style={styles.rating}>{p.difficulty_rating}</Text>
          </View>
          <Text style={styles.cardTitle}>{p.title}</Text>
          <Text style={styles.cardMeta}>
            {p.target_complexity} ·{' '}
            {relativeDifficulty(p.difficulty_rating, profile?.rating_band ?? 1200)}
          </Text>
        </Pressable>
      ))}
      {ordered.length > 0 ? (
        <Text style={styles.hint}>Long-press a problem to remove it from this playlist.</Text>
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
  meta: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    color: colors.textDim,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  inputMulti: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  index: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    width: 20,
  },
  source: {
    flex: 1,
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rating: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
    color: colors.textDim,
    fontSize: 12,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
  },
});
