import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { AnimatedNumber } from '@/components/game/AnimatedNumber';
import { XpChip } from '@/components/game/XpChip';
import { scoreRank } from '@/components/game/scoreRank';
import { PressableScale } from '@/components/game/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ProseCard } from '@/components/ProseCard';
import { useAttempt } from '@/contexts/AttemptContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems, saveAttempt, type SaveAttemptResult } from '@/lib/api';
import { buildDrillNextPlan, type DrillNextPlan } from '@/lib/drillNext';
import { formatScoreShare, shareText } from '@/lib/share';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

export default function RevealScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const fromStuck = from === 'stuck';
  const { user, profile, refreshProfile } = useAuth();
  const { problem, draft, breakdown, finalizeScore, reset, beginProblem } = useAttempt();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<SaveAttemptResult | null>(null);
  const [catalog, setCatalog] = useState<ProblemWithApproaches[]>([]);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);

  const scoreScale = useSharedValue(0.92);

  useEffect(() => {
    if (!breakdown) finalizeScore();
  }, [breakdown, finalizeScore]);

  useEffect(() => {
    if (!breakdown) return;
    scoreScale.value = withSequence(
      withTiming(1.06, { duration: 220 }),
      withSpring(1, { damping: 10, stiffness: 180 }),
    );
  }, [breakdown, scoreScale]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [p, a] = await Promise.all([
        fetchProblems(),
        fetchAttempts(user?.id ?? null),
      ]);
      if (!active) return;
      setCatalog(p);
      setAttempts(a);
    })();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const scoreAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  const drillPlan: DrillNextPlan | null = useMemo(() => {
    if (!breakdown || !problem) return null;
    return buildDrillNextPlan({
      breakdown,
      currentProblemId: problem.id,
      catalog,
      attempts,
      ratingBand: profile?.rating_band ?? 1200,
    });
  }, [breakdown, problem, catalog, attempts, profile?.rating_band]);

  if (!problem || !draft || problem.id !== id || !breakdown) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  const approach = breakdown.matchedApproach;
  const saved = !!result;
  const rank = scoreRank(breakdown.score);

  function startPractice(next: ProblemWithApproaches) {
    beginProblem(next);
    router.replace(`/problem/${next.id}`);
  }

  async function persist(status: 'drafted' | 'needs_review') {
    setSaving(true);
    const savedAttempt = await saveAttempt({
      userId: user?.id ?? null,
      problemId: problem!.id,
      problemDifficulty: problem!.difficulty_rating,
      timeSpentSec: draft!.timeSpentSec,
      paradigms: draft!.paradigms,
      algorithms: draft!.algorithms,
      dataStructures: draft!.dataStructures,
      twists: draft!.twists,
      guessedComplexity: draft!.guessedComplexity,
      complexityBonus: breakdown!.complexityBonus,
      pseudocode: draft!.pseudocode,
      breakdown: breakdown!,
      status,
    });
    setResult(savedAttempt);
    await refreshProfile();
    try {
      if (savedAttempt.dailyBonusXp > 0) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      /* web / unsupported */
    }
    setSaving(false);
  }

  function goHome() {
    reset();
    router.replace('/(tabs)');
  }

  const totalXp = result ? result.xpGain.total + result.dailyBonusXp : 0;

  return (
    <Screen scroll>
      {fromStuck ? (
        <View style={styles.stuckBanner}>
          <Text style={styles.stuckBannerTitle}>Revealed from stuck path</Text>
          <Text style={styles.stuckBannerBody}>
            Score reflects an empty hypothesis — use the editorial and Drill next to recover.
          </Text>
        </View>
      ) : null}
      <View style={styles.scoreBlock}>
        <Text style={styles.rankLabel}>{rank.label}</Text>
        <Animated.View style={scoreAnimStyle}>
          <AnimatedNumber value={breakdown.score} suffix="%" style={styles.score} />
        </Animated.View>
        <Text style={styles.rankBlurb}>{rank.blurb}</Text>
        <Text style={styles.sub}>
          Best match{approach ? `: ${approach.approach_name}` : ''}
          {breakdown.complexityBonus ? ' · radar bonus unlocked' : ''}
        </Text>
      </View>

      <View style={styles.bars}>
        <Bar label="Paradigm" value={breakdown.paradigmScore} />
        <Bar label="Algorithm" value={breakdown.algorithmScore} />
        <Bar label="Structures" value={breakdown.dsScore} />
        <Bar label="Twist" value={breakdown.twistScore} />
      </View>

      {breakdown.mistakeTypes.length > 0 ? (
        <View style={styles.mistakes}>
          <Text style={styles.label}>Miss reasons</Text>
          {breakdown.mistakeTypes.map((m) => (
            <Text key={m} style={styles.mistake}>
              · {m}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.good}>Strong read — pattern recognized.</Text>
      )}

      {approach ? (
        <>
          <Text style={styles.label}>Editorial</Text>
          <ProseCard markdown={approach.editorial_summary_md} />
          <Text style={styles.label}>Registered tags</Text>
          <Text style={styles.tags}>
            {[...approach.paradigms, ...approach.algorithms, ...approach.data_structures].join(' · ')}
          </Text>
          {approach.key_insights.length ? (
            <>
              <Text style={styles.label}>Key insights</Text>
              {approach.key_insights.map((k) => (
                <Text key={k} style={styles.insight}>
                  · {k}
                </Text>
              ))}
            </>
          ) : null}
        </>
      ) : null}

      {drillPlan && (drillPlan.lessons.length > 0 || drillPlan.practice.length > 0) ? (
        <View style={styles.drillCard}>
          <Text style={styles.drillHeadline}>{drillPlan.headline}</Text>
          <Text style={styles.drillReason}>{drillPlan.focusReason}</Text>
          {drillPlan.lessons.length ? (
            <>
              <Text style={styles.drillSub}>Learn</Text>
              {drillPlan.lessons.map((link) => (
                <PressableScale
                  key={link.lesson.id}
                  style={styles.drillRow}
                  onPress={() => router.push(`/learn/${link.lesson.id}`)}
                >
                  <View style={styles.drillRowBody}>
                    <Text style={styles.drillTitle}>{link.lesson.title}</Text>
                    <Text style={styles.drillWhy}>{link.why}</Text>
                  </View>
                  <Text style={styles.drillCta}>Open</Text>
                </PressableScale>
              ))}
            </>
          ) : null}
          {drillPlan.practice.length ? (
            <>
              <Text style={styles.drillSub}>Similar problems</Text>
              {drillPlan.practice.map((rec) => (
                <PressableScale
                  key={rec.problem.id}
                  style={styles.drillRow}
                  onPress={() => startPractice(rec.problem)}
                >
                  <View style={styles.drillRowBody}>
                    <Text style={styles.drillTitle}>{rec.problem.title}</Text>
                    <Text style={styles.drillWhy}>
                      {rec.problem.source} · {rec.why}
                    </Text>
                  </View>
                  <Text style={styles.drillCta}>Run</Text>
                </PressableScale>
              ))}
            </>
          ) : null}
        </View>
      ) : null}

      {!saved ? (
        <>
          <PrimaryButton
            label={fromStuck ? 'Mark for review (SRS)' : 'Add to Implement Queue'}
            loading={saving}
            onPress={() => persist(fromStuck ? 'needs_review' : 'drafted')}
          />
          <PrimaryButton
            label={fromStuck ? 'Add to Implement Queue' : 'Mark for review (SRS)'}
            variant="secondary"
            disabled={saving}
            onPress={() => persist(fromStuck ? 'drafted' : 'needs_review')}
          />
        </>
      ) : (
        <View style={styles.xpCard}>
          <Text style={styles.payoffTitle}>Round saved</Text>
          <View style={styles.chipRow}>
            <XpChip label={`+${totalXp} XP`} tone="xp" delayMs={0} />
            <XpChip label={`${result.streak}d streak`} tone="warning" delayMs={80} />
            {result.dailyBonusXp > 0 ? (
              <XpChip label={`Daily +${result.dailyBonusXp}`} tone="accent" delayMs={160} />
            ) : null}
          </View>
          <Text style={styles.xpDetail}>
            base {result.xpGain.base}
            {result.xpGain.radarBonus ? ` · radar +${result.xpGain.radarBonus}` : ''}
            {result.xpGain.streakBonus ? ` · streak +${result.xpGain.streakBonus}` : ''}
            {result.dailyBonusXp ? ` · daily set +${result.dailyBonusXp}` : ''}
          </Text>
          <Text style={styles.xpDetail}>
            Band {result.ratingBand}
            {result.bandDelta !== 0
              ? ` (${result.bandDelta > 0 ? '+' : ''}${result.bandDelta})`
              : ' (unchanged)'}
          </Text>
          {result.dailyBonusXp > 0 ? (
            <Text style={styles.good}>Daily run cleared — nice work.</Text>
          ) : null}
          <PrimaryButton
            label="Share result"
            variant="secondary"
            onPress={() =>
              shareText(
                `Koda · ${problem.title}`,
                formatScoreShare({
                  title: problem.title,
                  score: breakdown.score,
                  approachName: approach?.approach_name,
                  paradigms: draft.paradigms,
                  algorithms: draft.algorithms,
                  twists: draft.twists,
                  complexityBonus: breakdown.complexityBonus,
                  band: result.ratingBand,
                }),
              )
            }
          />
        </View>
      )}

      <PrimaryButton
        label={saved ? 'Back to run' : 'Back to Home'}
        variant={saved ? 'primary' : 'ghost'}
        onPress={goHome}
      />
    </Screen>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.barValue}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stuckBanner: {
    backgroundColor: colors.atmosphereBoss,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: spacing.md,
    gap: 4,
    marginBottom: spacing.sm,
  },
  stuckBannerTitle: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  stuckBannerBody: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  scoreBlock: {
    alignItems: 'flex-start',
    gap: 4,
  },
  rankLabel: {
    color: colors.xp,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  score: {
    color: colors.accent,
    fontSize: 56,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  rankBlurb: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  bars: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barLabel: {
    color: colors.textMuted,
    width: 84,
    fontSize: 12,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  barValue: {
    width: 40,
    textAlign: 'right',
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  mistakes: {
    gap: 4,
  },
  mistake: {
    color: colors.warning,
    fontSize: 14,
  },
  good: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  tags: {
    color: colors.text,
    fontSize: 14,
  },
  insight: {
    color: colors.text,
    fontSize: 14,
  },
  drillCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.radar,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  drillHeadline: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  drillReason: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  drillSub: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  drillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  drillRowBody: {
    flex: 1,
    gap: 2,
  },
  drillTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  drillWhy: {
    color: colors.textMuted,
    fontSize: 12,
  },
  drillCta: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  xpCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    padding: spacing.md,
    gap: spacing.sm,
  },
  payoffTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  xpDetail: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
