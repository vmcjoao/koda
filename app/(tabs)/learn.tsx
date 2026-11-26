import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { listLessons } from '@/lib/learn';
import { LEARN_FAMILY_LABELS, type LearnFamily } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

const FAMILY_ORDER: LearnFamily[] = [
  'graphs',
  'search',
  'structures',
  'dp',
  'math',
  'strings',
  'geometry',
];

export default function LearnScreen() {
  const lessons = useMemo(() => listLessons(), []);
  const byFamily = useMemo(() => {
    const map = new Map<LearnFamily, typeof lessons>();
    for (const f of FAMILY_ORDER) map.set(f, []);
    for (const l of lessons) {
      const list = map.get(l.family) ?? [];
      list.push(l);
      map.set(l.family, list);
    }
    return map;
  }, [lessons]);

  return (
    <Screen scroll>
      <FadeInUp delayMs={40} waitForLaunch={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>ALGORITHM DOJO</Text>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.sub}>
            Short usage notes, complexity, C++ snippets, and easy practice picks.
          </Text>
        </View>
      </FadeInUp>

      {FAMILY_ORDER.map((family, fi) => {
        const group = byFamily.get(family) ?? [];
        if (!group.length) return null;
        return (
          <FadeInUp key={family} delayMs={80 + fi * 60} waitForLaunch={false}>
            <Text style={styles.section}>{LEARN_FAMILY_LABELS[family]}</Text>
            <View style={styles.gap}>
              {group.map((l) => (
                <PressableScale
                  key={l.id}
                  style={styles.card}
                  onPress={() => router.push(`/learn/${l.id}`)}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.tag}>{l.tagLabel}</Text>
                    {l.visualization ? <Text style={styles.vizBadge}>VIZ</Text> : null}
                  </View>
                  <Text style={styles.cardTitle}>{l.title}</Text>
                  <Text style={styles.summary} numberOfLines={2}>
                    {l.summary}
                  </Text>
                  <Text style={styles.complexity}>
                    {l.complexity.time} · {l.complexity.extraMemory}
                  </Text>
                </PressableScale>
              ))}
            </View>
          </FadeInUp>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 4 },
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
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  gap: { gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  vizBadge: {
    color: colors.xp,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  summary: {
    color: colors.textMuted,
    fontSize: 13,
  },
  complexity: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: 'SpaceMono',
    marginTop: 4,
  },
});
