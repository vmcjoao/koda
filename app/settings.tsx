import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BrandWordmark } from '@/components/BrandWordmark';
import { useAuth } from '@/contexts/AuthContext';
import { updateRatingBand } from '@/lib/api';
import {
  clearLocalTrainingData,
  exportLocalTrainingJson,
  resetOnboardingTips,
} from '@/lib/localData';
import { shareText } from '@/lib/share';
import { colors, radii, spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const { user, profile, refreshProfile, demoMode, signOut } = useAuth();
  const [band, setBand] = useState(String(profile?.rating_band ?? 1200));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function saveBand() {
    const n = Number(band);
    if (!Number.isFinite(n)) return;
    setSaving(true);
    await updateRatingBand(user?.id ?? null, n);
    await refreshProfile();
    setBand(String(Math.max(800, Math.min(2400, Math.round(n)))));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function nudge(delta: number) {
    const n = Number(band);
    const next = Math.max(800, Math.min(2400, (Number.isFinite(n) ? n : 1200) + delta));
    setBand(String(next));
  }

  function confirmClear() {
    Alert.alert(
      'Clear local data?',
      'Deletes guest attempts, daily set, favorites, and onboarding on this device. Cloud data (if signed in) is not wiped from Supabase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearLocalTrainingData();
            await refreshProfile();
            setBand('1200');
            setStatus('Local training data cleared.');
          },
        },
      ],
    );
  }

  return (
    <Screen scroll>
      <BrandWordmark size="md" />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sub}>
        {demoMode ? 'Guest profile (local device).' : 'Signed in · band drives Daily Set difficulty.'}
      </Text>

      <Text style={styles.label}>Rating band</Text>
      <Text style={styles.hint}>800–2400. Warm-up / Target / Boss pick around this value.</Text>
      <View style={styles.bandRow}>
        <PrimaryButton label="−100" variant="secondary" onPress={() => nudge(-100)} style={styles.nudge} />
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={band}
          onChangeText={setBand}
          placeholderTextColor={colors.textDim}
        />
        <PrimaryButton label="+100" variant="secondary" onPress={() => nudge(100)} style={styles.nudge} />
      </View>
      <PrimaryButton label={saved ? 'Saved' : 'Save band'} onPress={saveBand} loading={saving} />

      <View style={styles.stats}>
        <Text style={styles.statLine}>Streak · {profile?.streak ?? 0}d</Text>
        <Text style={styles.statLine}>XP · {profile?.xp ?? 0}</Text>
      </View>

      <PrimaryButton
        label="Attempt history"
        variant="secondary"
        onPress={() => router.push('/history')}
      />

      <Text style={styles.label}>Local data</Text>
      <PrimaryButton
        label="Export backup JSON"
        variant="secondary"
        onPress={async () => {
          const json = await exportLocalTrainingJson();
          await shareText('Koda backup', json);
          setStatus('Backup shared.');
        }}
      />
      <PrimaryButton
        label="Show onboarding tips again"
        variant="secondary"
        onPress={async () => {
          await resetOnboardingTips();
          setStatus('Tips will show next time you open Home.');
        }}
      />
      <PrimaryButton label="Clear local training data" variant="ghost" onPress={confirmClear} />
      {status ? <Text style={styles.status}>{status}</Text> : null}

      {demoMode ? (
        <PrimaryButton label="Sign in" variant="secondary" onPress={() => router.push('/(auth)/login')} />
      ) : (
        <PrimaryButton
          label="Sign out"
          variant="ghost"
          onPress={async () => {
            await signOut();
            router.back();
          }}
        />
      )}
    </Screen>
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
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  hint: {
    color: colors.textDim,
    fontSize: 13,
  },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nudge: {
    minWidth: 72,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  stats: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  statLine: {
    color: colors.textMuted,
    fontSize: 14,
  },
  status: {
    color: colors.accent,
    fontSize: 13,
  },
});
