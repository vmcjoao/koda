import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ProseCard } from '@/components/ProseCard';
import { useAttempt } from '@/contexts/AttemptContext';
import { fetchProblem } from '@/lib/api';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { relativeDifficulty } from '@/lib/habit';
import { addProblemToPlaylistFlow } from '@/lib/playlistPicker';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radii, spacing } from '@/constants/theme';

export default function EncounterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, user } = useAuth();
  const { problem, draft, beginProblem, tickTime } = useAttempt();
  const [loading, setLoading] = useState(!problem || problem.id !== id);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (problem?.id === id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const p = await fetchProblem(id);
      if (!active) return;
      if (!p) {
        setError('Problem not found');
        setLoading(false);
        return;
      }
      beginProblem(p);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id, problem?.id, beginProblem]);

  useEffect(() => {
    const timer = setInterval(tickTime, 1000);
    return () => clearInterval(timer);
  }, [tickTime]);

  useEffect(() => {
    let active = true;
    (async () => {
      const favs = await getFavorites(user?.id ?? null);
      if (active) setFavorite(favs.includes(id));
    })();
    return () => {
      active = false;
    };
  }, [id, user?.id]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  if (error || !problem) {
    return (
      <Screen>
        <Text style={styles.error}>{error ?? 'Missing problem'}</Text>
      </Screen>
    );
  }

  const elapsed = draft?.timeSpentSec ?? 0;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.source}>
          {problem.source} · {problem.difficulty_rating}
        </Text>
        <View style={styles.headerRight}>
          <Pressable
            onPress={async () => {
              const next = await toggleFavorite(problem.id, user?.id ?? null);
              setFavorite(next.includes(problem.id));
            }}
            hitSlop={10}
          >
            <Text style={[styles.star, favorite && styles.starOn]}>{favorite ? '★' : '☆'}</Text>
          </Pressable>
          <Text style={styles.timer}>
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{problem.title}</Text>
      <Text style={styles.rel}>
        {relativeDifficulty(problem.difficulty_rating, profile?.rating_band ?? 1200)} vs your band
      </Text>

      <Text style={styles.label}>Statement</Text>
      <ProseCard markdown={problem.statement_md} />

      {problem.input_format_md?.trim() ? (
        <>
          <Text style={styles.label}>Input format</Text>
          <ProseCard markdown={problem.input_format_md} />
        </>
      ) : null}

      {problem.output_format_md?.trim() ? (
        <>
          <Text style={styles.label}>Output format</Text>
          <ProseCard markdown={problem.output_format_md} />
        </>
      ) : null}

      <Text style={styles.label}>Constraints</Text>
      <ProseCard markdown={problem.constraints_text} />

      <Text style={styles.label}>Samples</Text>
      {problem.sample_io.map((s, i) => (
        <View key={i} style={styles.sample}>
          <Text style={styles.sampleLabel}>Input</Text>
          <Text style={styles.mono}>{s.input}</Text>
          <Text style={styles.sampleLabel}>Output</Text>
          <Text style={styles.mono}>{s.output}</Text>
        </View>
      ))}

      <PrimaryButton
        label="Constraint Radar"
        onPress={() => router.push(`/problem/${problem.id}/radar`)}
      />
      <PrimaryButton
        label="Stuck? Hint path"
        variant="secondary"
        onPress={() => router.push(`/problem/${problem.id}/stuck`)}
      />
      <PrimaryButton
        label="Add to playlist"
        variant="ghost"
        onPress={() => addProblemToPlaylistFlow(problem.id, problem.title)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  source: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  star: {
    color: colors.textDim,
    fontSize: 22,
  },
  starOn: {
    color: colors.warning,
  },
  timer: {
    color: colors.textMuted,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  rel: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: -4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sample: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  sampleLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  mono: {
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  error: {
    color: colors.danger,
  },
});
