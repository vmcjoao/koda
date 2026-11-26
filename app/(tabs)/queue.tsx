import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect } from 'expo-router';
import { AnimatedNumber } from '@/components/game/AnimatedNumber';
import { PressableScale } from '@/components/game/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems, updateAttemptStatus } from '@/lib/api';
import { formatBlueprintShare, shareText } from '@/lib/share';
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

  const pending = attempts.length;
  const withDraft = useMemo(
    () => attempts.filter((a) => (a.pseudocode_draft?.trim() ?? '').length > 0).length,
    [attempts],
  );

  const formLine =
    pending === 0
      ? 'Forge empty — save a blueprint after a scored round.'
      : Platform.OS === 'web'
        ? 'PC companion — copy, open the OJ, land AC.'
        : 'Blueprints ready — code on PC, then mark AC here.';

  return (
    <Screen scroll contentStyle={isWide ? styles.wideContent : undefined}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>BUILD QUEUE</Text>
        <Text style={styles.title}>Implement</Text>
        <Text style={styles.sub}>{formLine}</Text>
      </View>

      <View style={styles.statRow}>
        <View style={[styles.statCell, styles.statPending]}>
          <Text style={styles.statLabel}>Queued</Text>
          <AnimatedNumber value={pending} style={styles.statValue} />
        </View>
        <View style={[styles.statCell, styles.statDrafts]}>
          <Text style={styles.statLabel}>With draft</Text>
          <AnimatedNumber value={withDraft} style={styles.statValueAccent} />
        </View>
      </View>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {!loading && attempts.length === 0 ? (
        <View style={styles.clearCard}>
          <Text style={styles.clearTitle}>No builds pending</Text>
          <Text style={styles.clearSub}>
            Clear a run, save a blueprint, and it drops into this forge.
          </Text>
        </View>
      ) : null}

      <View style={isWide ? styles.grid : styles.stack}>
        {attempts.map((a, i) => {
          const problem = problems[a.problem_id];
          const open = expanded[a.id] ?? isWide;
          const draft = a.pseudocode_draft?.trim() ?? '';
          const isLead = i === 0;
          return (
            <View
              key={a.id}
              style={[styles.card, isWide && styles.cardWide, isLead && styles.cardLead]}
            >
              <View style={styles.cardTop}>
                <Text style={[styles.badge, isLead && styles.badgeLead]}>
                  {isLead ? 'UP NEXT' : `#${i + 1}`}
                </Text>
                <Text style={styles.scoreChip}>{a.score_accuracy}%</Text>
              </View>
              <Text style={styles.source}>{problem?.source ?? 'Problem'}</Text>
              <Text style={styles.cardTitle}>{problem?.title ?? a.problem_id}</Text>
              <Text style={styles.meta}>{a.status.replace('_', ' ')}</Text>

              {draft ? (
                <>
                  <PressableScale
                    haptic={false}
                    onPress={() => setExpanded((e) => ({ ...e, [a.id]: !open }))}
                  >
                    <Text style={styles.draft} numberOfLines={open ? undefined : 6}>
                      {draft}
                    </Text>
                    {!isWide ? (
                      <Text style={styles.toggle}>{open ? 'Show less' : 'Expand draft'}</Text>
                    ) : null}
                  </PressableScale>
                  <View style={styles.actions}>
                    <PrimaryButton
                      label={copiedId === a.id ? 'Copied' : 'Copy'}
                      variant="secondary"
                      onPress={() => copyDraft(a.id, draft)}
                      style={styles.actionBtn}
                    />
                    <PrimaryButton
                      label="Share"
                      variant="secondary"
                      onPress={() =>
                        shareText(
                          `Koda blueprint · ${problem?.title ?? a.problem_id}`,
                          formatBlueprintShare({
                            title: problem?.title ?? a.problem_id,
                            url: problem?.url,
                            draft,
                            score: a.score_accuracy,
                          }),
                        )
                      }
                      style={styles.actionBtn}
                    />
                  </View>
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
                <PrimaryButton
                  label="Mark AC"
                  onPress={() => markAc(a.id)}
                  style={styles.actionBtn}
                />
                <PrimaryButton
                  label="To Review"
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
  hero: {
    gap: 4,
  },
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
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCell: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: 2,
  },
  statPending: {
    borderColor: colors.radar,
  },
  statDrafts: {
    borderColor: colors.accentDim,
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statValue: {
    color: colors.radar,
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  statValueAccent: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  clearCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    padding: spacing.md,
    gap: 4,
  },
  clearTitle: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  clearSub: {
    color: colors.textMuted,
    fontSize: 13,
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
  cardLead: {
    borderColor: colors.radar,
    borderWidth: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  badgeLead: {
    color: colors.radar,
  },
  scoreChip: {
    color: colors.xp,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  source: {
    color: colors.accent,
    fontSize: 11,
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggle: {
    color: colors.radar,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
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
