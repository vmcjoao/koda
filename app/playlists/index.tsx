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
  addProblemToPlaylist,
  createPlaylist,
  createPlaylistFromSource,
  deletePlaylist,
  listPlaylists,
  type Playlist,
} from '@/lib/playlists';
import { importUfvPlaylistTemplates, ufvTemplateSummary } from '@/lib/playlistTemplates';
import { colors, radii, spacing } from '@/constants/theme';

export default function PlaylistsScreen() {
  const { addProblem } = useLocalSearchParams<{ addProblem?: string }>();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [sourceProblems, setSourceProblems] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const picking = !!addProblem;

  const reload = useCallback(async () => {
    setLoading(true);
    const [list, problems] = await Promise.all([listPlaylists(), fetchProblems()]);
    const bySource: Record<string, string[]> = {};
    for (const p of problems) {
      bySource[p.source] = bySource[p.source] ?? [];
      bySource[p.source].push(p.id);
    }
    setPlaylists(list);
    setSources(Object.keys(bySource).sort());
    setSourceProblems(bySource);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function onCreate() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give your playlist a name (e.g. UFV Marathons).');
      return;
    }
    setCreating(true);
    try {
      const p = await createPlaylist({ name, description });
      setName('');
      setDescription('');
      await reload();
      router.push(`/playlists/${p.id}`);
    } catch (e) {
      Alert.alert('Could not create', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setCreating(false);
    }
  }

  function onCreateFromSource() {
    if (!sources.length) return;
    Alert.alert(
      'Create from source',
      'Make a playlist with every problem from that OJ / contest source.',
      [
        ...sources.map((s) => ({
          text: `${s} (${sourceProblems[s]?.length ?? 0})`,
          onPress: async () => {
            const p = await createPlaylistFromSource(s, sourceProblems[s] ?? []);
            await reload();
            router.push(`/playlists/${p.id}`);
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  }

  async function onImportUfv() {
    const summary = ufvTemplateSummary();
    Alert.alert(
      'Import UFV VJudge playlists',
      `${summary.contests} contests · ${summary.inCatalog} problems already in Koda · ${summary.pending} still need ingest.\n\nOnly contests with at least one catalog problem will be created; re-run after you ingest more.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            const problems = await fetchProblems();
            const { imported, skippedEmpty } = await importUfvPlaylistTemplates(
              problems.map((p) => p.id),
            );
            await reload();
            Alert.alert(
              'UFV playlists',
              imported.length
                ? `Imported ${imported.length} playlist(s). Skipped ${skippedEmpty} empty (no matched problems yet).`
                : `Nothing to import yet — ${skippedEmpty} contests need problems in the catalog first.`,
            );
          },
        },
      ],
    );
  }

  function confirmDelete(p: Playlist) {
    Alert.alert('Delete playlist?', `"${p.name}" will be removed on this device.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePlaylist(p.id);
          await reload();
        },
      },
    ]);
  }

  const empty = useMemo(() => !loading && playlists.length === 0, [loading, playlists.length]);

  return (
    <Screen scroll>
      <Text style={styles.title}>{picking ? 'Add to playlist' : 'Playlists'}</Text>
      <Text style={styles.sub}>
        {picking
          ? 'Tap a playlist to add this problem.'
          : 'Custom problem sets — group by source (UFV marathons, CSES DP, …) or any theme you study.'}
      </Text>

      {picking ? (
        <PrimaryButton label="Cancel" variant="ghost" onPress={() => router.back()} />
      ) : null}

      <Text style={styles.label}>New playlist</Text>
      <TextInput
        style={styles.input}
        placeholder="Name (e.g. UFV Marathons)"
        placeholderTextColor={colors.textDim}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.inputMulti]}
        placeholder="Description (optional)"
        placeholderTextColor={colors.textDim}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <PrimaryButton label="Create playlist" onPress={onCreate} loading={creating} />
      <PrimaryButton
        label="Create from source…"
        variant="secondary"
        onPress={onCreateFromSource}
      />
      {!picking ? (
        <PrimaryButton label="Import UFV VJudge…" variant="secondary" onPress={onImportUfv} />
      ) : null}

      <Text style={styles.section}>Your playlists</Text>
      {loading ? <ActivityIndicator color={colors.accent} /> : null}
      {empty ? (
        <Text style={styles.empty}>
          No playlists yet. Create one above, or generate from a catalog source.
        </Text>
      ) : null}

      {playlists.map((p) => (
        <Pressable
          key={p.id}
          style={styles.card}
          onPress={async () => {
            if (picking && addProblem) {
              await addProblemToPlaylist(p.id, addProblem);
              Alert.alert('Added', `Saved to “${p.name}”.`, [
                { text: 'OK', onPress: () => router.back() },
              ]);
              return;
            }
            router.push(`/playlists/${p.id}`);
          }}
          onLongPress={() => {
            if (!picking) confirmDelete(p);
          }}
        >
          <Text style={styles.cardTitle}>{p.name}</Text>
          {p.description ? <Text style={styles.cardDesc}>{p.description}</Text> : null}
          <Text style={styles.meta}>
            {p.problemIds.length} problem{p.problemIds.length === 1 ? '' : 's'}
            {picking && addProblem && p.problemIds.includes(addProblem) ? ' · already added' : ''}
          </Text>
        </Pressable>
      ))}
      {playlists.length > 0 ? (
        <Text style={styles.hint}>Long-press a playlist to delete.</Text>
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
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
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
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: spacing.md,
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
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  cardDesc: {
    color: colors.textMuted,
    fontSize: 13,
  },
  meta: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
  },
});
