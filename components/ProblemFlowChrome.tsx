import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams, usePathname, type Href } from 'expo-router';
import { useAttempt, type ProblemFlowStep } from '@/contexts/AttemptContext';
import { colors, radii, spacing } from '@/constants/theme';

const STEPS: { key: ProblemFlowStep; label: string; path: (id: string) => string }[] = [
  { key: 'statement', label: 'Statement', path: (id) => `/problem/${id}` },
  { key: 'radar', label: 'Radar', path: (id) => `/problem/${id}/radar` },
  { key: 'hypothesis', label: 'Hypothesis', path: (id) => `/problem/${id}/hypothesis` },
  { key: 'blueprint', label: 'Blueprint', path: (id) => `/problem/${id}/blueprint` },
];

const ORDER: ProblemFlowStep[] = STEPS.map((s) => s.key);

function stepFromPath(pathname: string | null, id: string): ProblemFlowStep | null {
  if (!pathname || !id) return null;
  const base = `/problem/${id}`;
  if (pathname === base || pathname === `${base}/`) return 'statement';
  if (pathname.includes('/radar')) return 'radar';
  if (pathname.includes('/hypothesis')) return 'hypothesis';
  if (pathname.includes('/blueprint')) return 'blueprint';
  return null;
}

export function ProblemFlowChrome() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pathname = usePathname();
  const { furthestStep, markStepReached } = useAttempt();
  const current = stepFromPath(pathname, id);

  useEffect(() => {
    if (current) markStepReached(current);
  }, [current, markStepReached]);

  if (!id || !current) return null;

  const furthestIdx = ORDER.indexOf(furthestStep);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.wrap}>
      <Pressable onPress={goBack} hitSlop={8} style={styles.back}>
        <Text style={styles.backChevron}>‹</Text>
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>

      <View style={styles.steps}>
        {STEPS.map((step, i) => {
          const reached = i <= furthestIdx;
          const active = step.key === current;
          const tappable = reached && !active;
          return (
            <Pressable
              key={step.key}
              disabled={!tappable}
              onPress={() => {
                if (!tappable) return;
                router.replace(step.path(id) as Href);
              }}
              style={[styles.step, active && styles.stepActive, !reached && styles.stepLocked]}
            >
              <Text
                style={[
                  styles.stepLabel,
                  active && styles.stepLabelActive,
                  !reached && styles.stepLabelLocked,
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
  },
  backChevron: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: -2,
  },
  backLabel: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  steps: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  step: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: 2,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  stepLocked: {
    opacity: 0.45,
  },
  stepLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: colors.accent,
  },
  stepLabelLocked: {
    color: colors.textDim,
  },
});
