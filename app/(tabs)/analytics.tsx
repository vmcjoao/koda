import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchProblems } from '@/lib/api';
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
] as const;

export default function AnalyticsScreen() {
  const { user } = useAuth();
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

  const problemMap = useMemo(() => {
    const m = new Map<string, ProblemWithApproaches>();
    for (const p of problems) m.set(p.id, p);
    return m;
  }, [problems]);

  const topicStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const related = attempts.filter((a) => {
        const p = problemMap.get(a.problem_id);
        return p?.approaches.some((ap) => ap.paradigms.includes(cat));
      });
      if (!related.length) return { cat, avg: null as number | null, n: 0 };
      const avg = Math.round(related.reduce((s, a) => s + a.score_accuracy, 0) / related.length);
      return { cat, avg, n: related.length };
    });
  }, [attempts, problemMap]);

  const mistakeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of attempts) {
      for (const m of a.mistake_types ?? []) {
        counts[m] = (counts[m] ?? 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [attempts]);

  const funnel = useMemo(() => {
    const diagnosed = attempts.length;
    const blueprinted = attempts.filter((a) => !!a.pseudocode_draft).length;
    const implemented = attempts.filter((a) => a.status === 'implemented_ac').length;
    return { diagnosed, blueprinted, implemented };
  }, [attempts]);

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score_accuracy, 0) / attempts.length)
    : 0;

  return (
    <Screen scroll>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.sub}>Actionable signals from your hypothesis accuracy.</Text>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      <View style={styles.row}>
        <Metric label="Attempts" value={`${attempts.length}`} />
        <Metric label="Avg score" value={`${avgScore}%`} />
      </View>

      <Text style={styles.section}>Pipeline</Text>
      <View style={styles.card}>
        <FunnelRow label="Diagnosed" value={funnel.diagnosed} />
        <FunnelRow label="Blueprinted" value={funnel.blueprinted} />
        <FunnelRow label="Implemented (AC)" value={funnel.implemented} />
      </View>

      <Text style={styles.section}>Topic mastery</Text>
      {topicStats.map((t) => (
        <View key={t.cat} style={styles.topicRow}>
          <Text style={styles.topicLabel}>{t.cat}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${t.avg ?? 0}%`,
                  backgroundColor: (t.avg ?? 0) < 50 ? colors.danger : colors.accent,
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
        mistakeCounts.map(([label, count]) => (
          <View key={label} style={styles.mistakeRow}>
            <Text style={styles.topicLabel}>{label}</Text>
            <Text style={styles.topicValue}>{count}</Text>
          </View>
        ))
      )}
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function FunnelRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.funnelRow}>
      <Text style={styles.topicLabel}>{label}</Text>
      <Text style={styles.topicValue}>{value}</Text>
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
    fontSize: 13,
    width: 120,
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
  mistakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  funnelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
