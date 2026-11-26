import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MarkdownMath } from '@/components/MarkdownMath';
import { useAttempt } from '@/contexts/AttemptContext';
import { useAuth } from '@/contexts/AuthContext';
import { saveAttempt, type SaveAttemptResult } from '@/lib/api';
import { colors, radii, spacing } from '@/constants/theme';

export default function RevealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, refreshProfile } = useAuth();
  const { problem, draft, breakdown, finalizeScore, reset } = useAttempt();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<SaveAttemptResult | null>(null);

  useEffect(() => {
    if (!breakdown) finalizeScore();
  }, [breakdown, finalizeScore]);

  if (!problem || !draft || problem.id !== id || !breakdown) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  const approach = breakdown.matchedApproach;
  const saved = !!result;

  async function persist(status: 'drafted' | 'needs_review') {
    setSaving(true);
    const savedAttempt = await saveAttempt({
      userId: user?.id ?? null,
      problemId: problem!.id,
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
    setSaving(false);
  }

  function goHome() {
    reset();
    router.replace('/(tabs)');
  }

  return (
    <Screen scroll>
      <Text style={styles.score}>{breakdown.score}%</Text>
      <Text style={styles.sub}>
        Best match{approach ? `: ${approach.approach_name}` : ''}
        {breakdown.complexityBonus ? ' · radar bonus unlocked' : ''}
      </Text>

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
          <MarkdownMath markdown={approach.editorial_summary_md} minHeight={140} />
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

      {!saved ? (
        <>
          <PrimaryButton
            label="Add to Implement Queue"
            loading={saving}
            onPress={() => persist('drafted')}
          />
          <PrimaryButton
            label="Mark for review (SRS)"
            variant="secondary"
            disabled={saving}
            onPress={() => persist('needs_review')}
          />
        </>
      ) : (
        <View style={styles.xpCard}>
          <Text style={styles.good}>Saved · streak {result.streak}d</Text>
          <Text style={styles.xpLine}>+{result.xpGain.total} XP</Text>
          <Text style={styles.xpDetail}>
            base {result.xpGain.base}
            {result.xpGain.radarBonus ? ` · radar +${result.xpGain.radarBonus}` : ''}
            {result.xpGain.streakBonus ? ` · streak +${result.xpGain.streakBonus}` : ''}
          </Text>
        </View>
      )}

      <PrimaryButton label="Back to Home" variant={saved ? 'primary' : 'ghost'} onPress={goHome} />
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
  score: {
    color: colors.accent,
    fontSize: 48,
    fontWeight: '800',
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
  xpCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    padding: spacing.md,
    gap: 4,
  },
  xpLine: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  xpDetail: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
