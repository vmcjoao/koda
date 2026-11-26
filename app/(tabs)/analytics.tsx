import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { AnimatedNumber } from '@/components/game/AnimatedNumber';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
import {
  activityIntensity,
  computeActivityHeatmap,
  computePipeline,
  computeTopicStats,
  type DayActivity,
} from '@/lib/habit';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';
import { colors, radii, spacing } from '@/constants/theme';

const CATEGORIES = [
  'Dynamic Programming',
  'Greedy',
  'Graph Algorithms',
  'Two Pointers',
  'Math / Number Theory',
  'String Algorithms',
  'Binary Search on Answer',
  'Ad-Hoc',
];

export default function AnalyticsScreen() {
  const { user, profile } = useAuth();
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [problems, setProblems] = useState<ProblemWithApproaches[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        if (!hasLoadedRef.current) setLoading(true);
        const [a, p] = await Promise.all([fetchAttempts(user?.id ?? null), fetchProblems()]);
        if (!active) return;
        setAttempts(a);
        setProblems(p);
        hasLoadedRef.current = true;
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user?.id]),
  );

  const topicStats = useMemo(
    () => computeTopicStats(attempts, problems, CATEGORIES),
    [attempts, problems],
  );

  const blindSpots = useMemo(
    () => topicStats.filter((t) => t.blindSpot).sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0)),
    [topicStats],
  );

  const mistakeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of attempts) {
      for (const m of a.mistake_types ?? []) {
        counts[m] = (counts[m] ?? 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [attempts]);

  const funnel = useMemo(() => computePipeline(attempts), [attempts]);
  const heatmap = useMemo(() => computeActivityHeatmap(attempts, 84), [attempts]);
  const activeDays = useMemo(() => heatmap.filter((d) => d.count > 0).length, [heatmap]);

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score_accuracy, 0) / attempts.length)
    : 0;

  const avgInsightSec = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.time_spent_sec, 0) / attempts.length)
    : 0;

  const missRate = attempts.length
    ? Math.round(
        (attempts.filter((a) => (a.mistake_types?.length ?? 0) > 0).length / attempts.length) * 100,
      )
    : 0;

  const formLine =
    attempts.length === 0
      ? 'No rounds yet — clear a run to start the board.'
      : avgScore >= 75
        ? 'Form is sharp — keep pressure on the blind spots.'
        : avgScore >= 55
          ? 'Form is steady — push Boss slots for growth.'
          : 'Form is soft — Review deck will tighten reads.';

  return (
    <Screen scroll>
      <FadeInUp delayMs={40} waitForLaunch={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>PERFORMANCE</Text>
          <Text style={styles.title}>Stats</Text>
          <Text style={styles.sub}>{formLine}</Text>
        </View>
      </FadeInUp>

      <FadeInUp delayMs={110} waitForLaunch={false}>
        <View style={styles.bandPlate}>
          <Text style={styles.bandLabel}>Rating band</Text>
          <AnimatedNumber
            value={profile?.rating_band ?? 1200}
            style={styles.bandValue}
          />
          <Text style={styles.bandHint}>Steers Daily Set difficulty</Text>
        </View>
      </FadeInUp>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      <FadeInUp delayMs={180} waitForLaunch={false}>
        <View style={styles.metricRow}>
          <PressableScale style={styles.metric} onPress={() => router.push('/history')}>
            <AnimatedNumber value={attempts.length} style={styles.metricValue} />
            <Text style={styles.metricLabel}>Rounds ▸</Text>
          </PressableScale>
          <View style={[styles.metric, styles.metricAccent]}>
            <AnimatedNumber value={avgScore} suffix="%" style={styles.metricValueAccent} />
            <Text style={styles.metricLabel}>Avg score</Text>
          </View>
        </View>
      </FadeInUp>
      <FadeInUp delayMs={240} waitForLaunch={false}>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{formatTime(avgInsightSec)}</Text>
            <Text style={styles.metricLabel}>Avg insight</Text>
          </View>
          <View style={[styles.metric, missRate >= 50 && styles.metricWarn]}>
            <AnimatedNumber
              value={missRate}
              suffix="%"
              style={missRate >= 50 ? styles.metricValueWarn : styles.metricValue}
            />
            <Text style={styles.metricLabel}>Miss rate</Text>
          </View>
        </View>
      </FadeInUp>

      <Text style={styles.section}>Training calendar</Text>
      <Text style={styles.sectionHint}>
        {activeDays} active day{activeDays === 1 ? '' : 's'} · last 12 weeks
      </Text>
      <View style={styles.card}>
        <HeatmapGrid days={heatmap} />
        <View style={styles.legendRow}>
          <Text style={styles.legendLabel}>Less</Text>
          {[0, 1, 2, 3].map((level) => (
            <View key={level} style={[styles.heatCell, heatColor(level as 0 | 1 | 2 | 3)]} />
          ))}
          <Text style={styles.legendLabel}>More</Text>
        </View>
      </View>

      <Text style={styles.section}>Pipeline</Text>
      <Text style={styles.sectionHint}>Diagnose → Blueprint → Implement</Text>
      <View style={styles.pipelineCard}>
        <View style={styles.pipelineTrack}>
          <View
            style={[
              styles.pipelineFill,
              {
                width: `${Math.max(
                  funnel.diagnosed ? Math.round((funnel.implemented / funnel.diagnosed) * 100) : 0,
                  4,
                )}%`,
              },
            ]}
          />
        </View>
        <View style={styles.pipelineNodes}>
          <PipelineNode
            label="Diagnosed"
            value={funnel.diagnosed}
            detail="rounds saved"
            tone="radar"
            active
          />
          <PipelineNode
            label="Blueprinted"
            value={funnel.blueprinted}
            detail={`${funnel.blueprintRate}%`}
            tone="accent"
            active={funnel.blueprinted > 0}
          />
          <PipelineNode
            label="Implemented"
            value={funnel.implemented}
            detail={`${funnel.implementRate}%`}
            tone="warning"
            active={funnel.implemented > 0}
          />
        </View>
      </View>

      {blindSpots.length > 0 ? (
        <>
          <Text style={styles.section}>Blind spots</Text>
          <Text style={styles.sectionHint}>Missions — tap to open matching catalog problems</Text>
          {blindSpots.map((t, i) => (
            <PressableScale
              key={t.topic}
              style={styles.blindCard}
              haptic="medium"
              onPress={() =>
                router.push({ pathname: '/catalog', params: { topic: t.topic } })
              }
            >
              <View style={styles.blindTop}>
                <Text style={styles.blindBadge}>WEAK #{i + 1}</Text>
                <Text style={styles.blindScore}>{t.avg}%</Text>
              </View>
              <Text style={styles.blindTitle}>{t.topic}</Text>
              <Text style={styles.blindMeta}>
                {t.n} attempts · ~{formatTime(t.avgTimeSec ?? 0)} insight
              </Text>
              <Text style={styles.blindCta}>Practice →</Text>
            </PressableScale>
          ))}
        </>
      ) : attempts.length > 0 ? (
        <View style={styles.clearCard}>
          <Text style={styles.clearTitle}>No blind spots flagged</Text>
          <Text style={styles.clearSub}>Topics with enough samples are holding above the floor.</Text>
        </View>
      ) : null}

      <PrimaryButton
        label="Attempt history"
        variant="secondary"
        onPress={() => router.push('/history')}
      />

      <Text style={styles.section}>Topic mastery</Text>
      <View style={styles.masteryCard}>
        {topicStats.map((t) => (
          <View key={t.topic} style={styles.topicRow}>
            <Text style={[styles.topicLabel, t.blindSpot && styles.topicBlind]} numberOfLines={1}>
              {t.topic}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${t.avg ?? 0}%`,
                    backgroundColor: t.blindSpot
                      ? colors.danger
                      : (t.avg ?? 0) < 50
                        ? colors.warning
                        : colors.accent,
                  },
                ]}
              />
            </View>
            <Text style={styles.topicValue}>{t.n ? `${t.avg}%` : '—'}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Mistake breakdown</Text>
      {mistakeCounts.length === 0 ? (
        <Text style={styles.emptyMiss}>No misses logged yet — keep clearing runs.</Text>
      ) : (
        mistakeCounts.map(([label, count], i) => {
          const share = Math.round((count / Math.max(1, attempts.length)) * 100);
          return (
            <View key={label} style={styles.mistakeRow}>
              <Text style={styles.mistakeRank}>{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.mistakeLabel}>{label}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[styles.barFill, { width: `${share}%`, backgroundColor: colors.warning }]}
                  />
                </View>
              </View>
              <Text style={styles.topicValue}>{count}</Text>
            </View>
          );
        })
      )}
    </Screen>
  );
}

function formatTime(sec: number) {
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

function PipelineNode({
  label,
  value,
  detail,
  tone,
  active,
}: {
  label: string;
  value: number;
  detail: string;
  tone: 'radar' | 'accent' | 'warning';
  active: boolean;
}) {
  const color =
    tone === 'radar' ? colors.radar : tone === 'accent' ? colors.accent : colors.warning;
  return (
    <View style={[styles.pipeNode, active && { borderColor: color }]}>
      <Text style={[styles.pipeValue, { color }]}>{value}</Text>
      <Text style={styles.pipeLabel}>{label}</Text>
      <Text style={styles.pipeDetail}>{detail}</Text>
    </View>
  );
}

function heatColor(level: 0 | 1 | 2 | 3) {
  switch (level) {
    case 0:
      return { backgroundColor: colors.surfaceElevated };
    case 1:
      return { backgroundColor: '#1F4D3A' };
    case 2:
      return { backgroundColor: colors.accentDim };
    case 3:
      return { backgroundColor: colors.accent };
  }
}

function HeatmapGrid({ days }: { days: DayActivity[] }) {
  const weeks: DayActivity[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.heatGrid}>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.heatWeek}>
          {week.map((day) => {
            const level = activityIntensity(day.count);
            return (
              <View
                key={day.date}
                style={[styles.heatCell, heatColor(level)]}
                accessibilityLabel={`${day.date}: ${day.count} attempt(s)`}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 4,
  },
  kicker: {
    color: colors.xp,
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
  bandPlate: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.radar,
    padding: spacing.md,
    alignItems: 'flex-start',
    gap: 2,
  },
  bandLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bandValue: {
    color: colors.radar,
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  bandHint: {
    color: colors.textDim,
    fontSize: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 2,
  },
  metricAccent: {
    borderColor: colors.accentDim,
  },
  metricWarn: {
    borderColor: colors.warning,
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  metricValueAccent: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  metricValueWarn: {
    color: colors.warning,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  metricLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  sectionHint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: -8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pipelineCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pipelineTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.runTrack,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
  },
  pipelineFill: {
    height: '100%',
    backgroundColor: colors.warning,
    borderRadius: 3,
  },
  pipelineNodes: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pipeNode: {
    flex: 1,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.surfaceElevated,
  },
  pipeValue: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  pipeLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  pipeDetail: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: 'SpaceMono',
  },
  blindCard: {
    backgroundColor: '#2A1818',
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.danger,
    padding: spacing.md,
    gap: 4,
  },
  blindTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blindBadge: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  blindScore: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  blindTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  blindMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  blindCta: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
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
    fontSize: 15,
    fontWeight: '800',
  },
  clearSub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  masteryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topicLabel: {
    color: colors.textMuted,
    fontSize: 12,
    width: 110,
  },
  topicBlind: {
    color: colors.danger,
    fontWeight: '700',
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  topicValue: {
    color: colors.text,
    fontSize: 13,
    fontFamily: 'SpaceMono',
    width: 40,
    textAlign: 'right',
  },
  emptyMiss: {
    color: colors.textDim,
    fontSize: 13,
  },
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mistakeRank: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'SpaceMono',
    width: 18,
  },
  mistakeLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  heatGrid: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'space-between',
  },
  heatWeek: {
    gap: 3,
  },
  heatCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  legendLabel: {
    color: colors.textDim,
    fontSize: 11,
  },
});
