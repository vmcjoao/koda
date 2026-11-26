import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
import { computePipeline, computeTopicStats } from '@/lib/habit';
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

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [a, p] = await Promise.all([fetchAttempts(user?.id ?? null), fetchProblems()]);
        if (!active) return;
        setAttempts(a);
        setProblems(p);
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

  return (
    <Screen scroll>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.sub}>
        Band {profile?.rating_band ?? 1200} · signals that steer Daily Set & Review.
      </Text>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      <View style={styles.row}>
        <Pressable style={{ flex: 1 }} onPress={() => router.push('/history')}>
          <Metric label="Attempts ▸" value={`${attempts.length}`} />
        </Pressable>
        <Metric label="Avg score" value={`${avgScore}%`} />
      </View>
      <View style={styles.row}>
        <Metric label="Avg insight" value={formatTime(avgInsightSec)} />
        <Metric label="Miss rate" value={`${missRate}%`} />
      </View>

      <Text style={styles.section}>Pipeline funnel</Text>
      <Text style={styles.sectionHint}>Diagnosed → Blueprinted → Implemented (AC)</Text>
      <View style={styles.card}>
        <FunnelRow
          label="Diagnosed"
          value={`${funnel.diagnosed}`}
          detail="hypothesis saved"
        />
        <FunnelRow
          label="Blueprinted"
          value={`${funnel.blueprinted}`}
          detail={`${funnel.blueprintRate}% of diagnosed`}
        />
        <FunnelRow
          label="Implemented"
          value={`${funnel.implemented}`}
          detail={`${funnel.implementRate}% of diagnosed`}
        />
        <View style={styles.funnelBars}>
          <FunnelBar label="D" pct={100} color={colors.radar} />
          <FunnelBar label="B" pct={funnel.blueprintRate} color={colors.accent} />
          <FunnelBar label="I" pct={funnel.implementRate} color={colors.warning} />
        </View>
      </View>

      {blindSpots.length > 0 ? (
        <>
          <Text style={styles.section}>Blind spots</Text>
          <Text style={styles.sectionHint}>Tap a topic to practice matching catalog problems</Text>
          {blindSpots.map((t) => (
            <Pressable
              key={t.topic}
              style={styles.blindCard}
              onPress={() =>
                router.push({ pathname: '/catalog', params: { topic: t.topic } })
              }
            >
              <Text style={styles.blindTitle}>{t.topic}</Text>
              <Text style={styles.blindMeta}>
                {t.avg}% avg · {t.n} attempts · ~{formatTime(t.avgTimeSec ?? 0)} insight
              </Text>
              <Text style={styles.blindCta}>Practice →</Text>
            </Pressable>
          ))}
        </>
      ) : null}

      <PrimaryButton
        label="Attempt history"
        variant="secondary"
        onPress={() => router.push('/history')}
      />

      <Text style={styles.section}>Topic mastery</Text>
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

      <Text style={styles.section}>Mistake breakdown</Text>
      {mistakeCounts.length === 0 ? (
        <Text style={styles.sub}>No misses logged yet.</Text>
      ) : (
        mistakeCounts.map(([label, count]) => {
          const share = Math.round((count / Math.max(1, attempts.length)) * 100);
          return (
            <View key={label} style={styles.mistakeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mistakeLabel}>{label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${share}%`, backgroundColor: colors.warning }]} />
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function FunnelRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <View style={styles.funnelRow}>
      <View>
        <Text style={styles.funnelLabel}>{label}</Text>
        <Text style={styles.funnelDetail}>{detail}</Text>
      </View>
      <Text style={styles.topicValue}>{value}</Text>
    </View>
  );
}

function FunnelBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <View style={styles.funnelBarCol}>
      <View style={styles.funnelBarTrack}>
        <View style={[styles.funnelBarFill, { height: `${Math.max(8, pct)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.funnelBarLabel}>{label}</Text>
    </View>
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
  sectionHint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: -4,
  },
  row: {
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
  },
  metricValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textDim,
    fontSize: 12,
  },
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  card: {
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
    marginTop: 4,
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
  mistakeLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  funnelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  funnelLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  funnelDetail: {
    color: colors.textDim,
    fontSize: 12,
  },
  funnelBars: {
    flexDirection: 'row',
    gap: spacing.md,
    height: 80,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  funnelBarCol: {
    alignItems: 'center',
    width: 36,
  },
  funnelBarTrack: {
    flex: 1,
    width: 20,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  funnelBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  funnelBarLabel: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 4,
  },
  blindCard: {
    backgroundColor: '#2A1818',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    gap: 2,
  },
  blindTitle: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 15,
  },
  blindMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  blindCta: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
});
