import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems, updateAttemptStatus } from '@/lib/api';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function QueueScreen() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 900;
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [problems, setProblems] = useState<Record<string, ProblemWithApproaches>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const [a, p] = await Promise.all([fetchAttempts(user?.id ?? null), fetchProblems()]);
    const map: Record<string, ProblemWithApproaches> = {};
    for (const item of p) map[item.id] = item;
    setAttempts(a.filter((x) => x.status === 'drafted' || !!x.pseudocode_draft));
    setProblems(map);
    setLoading(false);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function markAc(id: string) {
    await updateAttemptStatus(id, user?.id ?? null, 'implemented_ac');
    await reload();
  }

  async function markReview(id: string) {
    await updateAttemptStatus(id, user?.id ?? null, 'needs_review');
    await reload();
  }

  async function copyDraft(id: string, text: string) {
    await Clipboard.setStringAsync(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1600);
  }

  async function openOj(url: string) {
    await WebBrowser.openBrowserAsync(url);
  }

  return (
    <Screen scroll contentStyle={isWide ? styles.wideContent : undefined}>
      <Text style={styles.title}>Implement Queue</Text>
      <Text style={styles.sub}>
        {Platform.OS === 'web'
          ? 'PC companion — copy your blueprint, open the OJ, then mark AC when you pass.'
          : 'Blueprints for your PC — open the OJ link, code from your draft, then mark AC.'}
      </Text>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {!loading && attempts.length === 0 ? (
        <Text style={styles.empty}>No drafts yet. Solve a problem and save a blueprint.</Text>
      ) : null}

      <View style={isWide ? styles.grid : styles.stack}>
        {attempts.map((a) => {
          const problem = problems[a.problem_id];
          const open = expanded[a.id] ?? isWide;
          const draft = a.pseudocode_draft?.trim() ?? '';
          return (
            <View key={a.id} style={[styles.card, isWide && styles.cardWide]}>
              <Text style={styles.source}>{problem?.source ?? 'Problem'}</Text>
              <Text style={styles.cardTitle}>{problem?.title ?? a.problem_id}</Text>
              <Text style={styles.meta}>
                Score {a.score_accuracy}% · {a.status.replace('_', ' ')}
              </Text>

              {draft ? (
                <>
                  <Pressable onPress={() => setExpanded((e) => ({ ...e, [a.id]: !open }))}>
                    <Text style={styles.draft} numberOfLines={open ? undefined : 6}>
                      {draft}
                    </Text>
                    {!isWide ? (
                      <Text style={styles.toggle}>{open ? 'Show less' : 'Expand draft'}</Text>
                    ) : null}
                  </Pressable>
                  <PrimaryButton
                    label={copiedId === a.id ? 'Copied' : 'Copy blueprint'}
                    variant="secondary"
                    onPress={() => copyDraft(a.id, draft)}
                  />
                </>
              ) : (
                <Text style={styles.meta}>No pseudocode saved</Text>
              )}

              <View style={styles.actions}>
                {problem?.url ? (
                  <PrimaryButton
                    label="Open OJ"
                    variant="secondary"
                    onPress={() => openOj(problem.url!)}
                    style={styles.actionBtn}
                  />
                ) : null}
                <PrimaryButton label="Mark AC" onPress={() => markAc(a.id)} style={styles.actionBtn} />
                <PrimaryButton
                  label="Review"
                  variant="ghost"
                  onPress={() => markReview(a.id)}
                  style={styles.actionBtn}
                />
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wideContent: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
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
  stack: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardWide: {
    width: '48%',
    flexGrow: 1,
    minWidth: 360,
  },
  source: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  draft: {
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.sm,
    borderRadius: radii.sm,
    lineHeight: 18,
  },
  toggle: {
    color: colors.radar,
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionBtn: {
    flexGrow: 1,
    minWidth: 100,
  },
});
