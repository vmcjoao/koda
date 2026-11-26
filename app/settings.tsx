import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BrandWordmark } from '@/components/BrandWordmark';
import { useAuth } from '@/contexts/AuthContext';
import { updateRatingBand } from '@/lib/api';
import {
  clearLocalTrainingData,
  exportLocalTrainingJson,
  importLocalTrainingJson,
  resetOnboardingTips,
} from '@/lib/localData';
import {
  areRemindersEnabled,
  formatReminderLabel,
  getReminderHour,
  setReminderHour,
  setRemindersEnabled,
} from '@/lib/notifications';
import { shareText } from '@/lib/share';
import { colors, radii, spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const { user, profile, refreshProfile, demoMode, signOut, syncNow, lastSyncSummary } = useAuth();
  const [band, setBand] = useState(String(profile?.rating_band ?? 1200));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [reminders, setReminders] = useState(false);
  const [reminderHour, setReminderHourState] = useState(19);
  const [reminderBusy, setReminderBusy] = useState(false);
  const [importText, setImportText] = useState('');

  useEffect(() => {
    (async () => {
      setReminders(await areRemindersEnabled());
      setReminderHourState(await getReminderHour());
    })();
  }, []);

  useEffect(() => {
    if (profile?.rating_band != null) setBand(String(profile.rating_band));
  }, [profile?.rating_band]);

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

  async function nudgeHour(delta: number) {
    const next = await setReminderHour(reminderHour + delta);
    setReminderHourState(next);
    setStatus(
      reminders
        ? `Reminder rescheduled · ${formatReminderLabel(next)}`
        : `Reminder time set · ${formatReminderLabel(next)} (enable to schedule)`,
    );
  }

  async function onToggleReminders(next: boolean) {
    if (Platform.OS === 'web') {
      setStatus('Reminders need a native build / Expo Go on a phone.');
      return;
    }
    setReminderBusy(true);
    const ok = await setRemindersEnabled(next);
    setReminders(ok ? next : false);
    setReminderBusy(false);
    if (next && !ok) {
      setStatus('Notification permission denied.');
    } else if (next) {
      setStatus(`Reminder on · ${formatReminderLabel(reminderHour)}`);
    } else {
      setStatus('Reminder off.');
    }
  }

  async function onImport() {
    const raw = importText.trim() || (await Clipboard.getStringAsync());
    if (!raw.trim()) {
      setStatus('Paste a backup JSON first (or copy it to clipboard).');
      return;
    }
    Alert.alert(
      'Restore backup?',
      'This overwrites local attempts, profile, favorites, and related keys on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            const result = await importLocalTrainingJson(raw);
            if (!result.ok) {
              setStatus(result.error);
              return;
            }
            const enabled = await areRemindersEnabled();
            const hour = await getReminderHour();
            setReminders(enabled);
            setReminderHourState(hour);
            if (enabled) await setRemindersEnabled(true);
            const { getProfile } = await import('@/lib/api');
            const profileAfter = await getProfile(user?.id ?? null);
            setBand(String(profileAfter.rating_band ?? 1200));
            await refreshProfile();
            setImportText('');
            setStatus(`Restored ${result.restored} local keys.`);
          },
        },
      ],
    );
  }

  function confirmClear() {
    Alert.alert(
      'Clear local data?',
      'Deletes guest attempts, daily set, favorites, reminders pref, and onboarding on this device. Cloud data (if signed in) is not wiped from Supabase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearLocalTrainingData();
            await setRemindersEnabled(false);
            setReminders(false);
            setReminderHourState(19);
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

      <Text style={styles.label}>Reminders</Text>
      <View style={styles.reminderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.statLine}>{formatReminderLabel(reminderHour)}</Text>
          <Text style={styles.hint}>Nudges Daily Set + Review habit.</Text>
        </View>
        <Switch
          value={reminders}
          onValueChange={onToggleReminders}
          disabled={reminderBusy}
          trackColor={{ false: colors.border, true: colors.accentDim }}
          thumbColor={reminders ? colors.accent : colors.textDim}
        />
      </View>
      <View style={styles.bandRow}>
        <PrimaryButton label="−1h" variant="secondary" onPress={() => nudgeHour(-1)} style={styles.nudge} />
        <Text style={styles.hourReadout}>{String(reminderHour).padStart(2, '0')}:00</Text>
        <PrimaryButton label="+1h" variant="secondary" onPress={() => nudgeHour(1)} style={styles.nudge} />
      </View>

      <View style={styles.stats}>
        <Text style={styles.statLine}>Streak · {profile?.streak ?? 0}d</Text>
        <Text style={styles.statLine}>XP · {profile?.xp ?? 0}</Text>
        {lastSyncSummary && !demoMode ? (
          <Text style={styles.hint}>Last sync · {lastSyncSummary}</Text>
        ) : null}
      </View>

      <PrimaryButton
        label="Attempt history"
        variant="secondary"
        onPress={() => router.push('/history')}
      />

      {!demoMode ? (
        <PrimaryButton
          label="Sync guest progress to cloud"
          variant="secondary"
          loading={syncing}
          onPress={async () => {
            setSyncing(true);
            const summary = await syncNow();
            setStatus(summary);
            setSyncing(false);
          }}
        />
      ) : null}

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
      <Text style={styles.hint}>Paste a backup below, or leave empty to import from clipboard.</Text>
      <TextInput
        style={styles.importBox}
        multiline
        value={importText}
        onChangeText={setImportText}
        placeholder='{ "app": "koda", ... }'
        placeholderTextColor={colors.textDim}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <PrimaryButton label="Import backup" variant="secondary" onPress={onImport} />
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
  hourReadout: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 22,
    fontWeight: '700',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
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
  importBox: {
    minHeight: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  status: {
    color: colors.accent,
    fontSize: 13,
  },
});
