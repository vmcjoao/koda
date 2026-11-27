import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PlayerAvatar } from '@/components/game/PlayerAvatar';
import { XpChip } from '@/components/game/XpChip';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { updateAvatarId, updateDisplayName, updateRatingBand } from '@/lib/api';
import { AVATAR_PRESETS } from '@/lib/avatar';
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
import {
  getLearnRandomScope,
  setLearnRandomScope,
  type LearnRandomScope,
} from '@/lib/preferences';
import { shareText } from '@/lib/share';
import { colors, radii, spacing } from '@/constants/theme';

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionKicker}>{kicker}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const {
    user,
    profile,
    refreshProfile,
    demoMode,
    signOut,
    syncNow,
    lastSyncSummary,
    updatePassword,
  } = useAuth();
  const [band, setBand] = useState(String(profile?.rating_band ?? 1200));
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [avatarId, setAvatarId] = useState(profile?.avatar_id ?? 'bolt');
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [reminders, setReminders] = useState(false);
  const [reminderHour, setReminderHourState] = useState(19);
  const [reminderBusy, setReminderBusy] = useState(false);
  const [learnRandomScope, setLearnRandomScopeState] = useState<LearnRandomScope>('completed');
  const [importText, setImportText] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setReminders(await areRemindersEnabled());
      setReminderHourState(await getReminderHour());
      setLearnRandomScopeState(await getLearnRandomScope());
    })();
  }, []);

  async function onToggleLearnRandomScope(unlockAll: boolean) {
    const next: LearnRandomScope = unlockAll ? 'all' : 'completed';
    await setLearnRandomScope(next);
    setLearnRandomScopeState(next);
    flashSaved(
      unlockAll
        ? 'Random drills · any lesson'
        : 'Random drills · completed lessons only',
    );
  }

  useEffect(() => {
    if (profile?.rating_band != null) setBand(String(profile.rating_band));
    if (profile?.display_name != null) setDisplayName(profile.display_name);
    if (profile?.avatar_id) setAvatarId(profile.avatar_id);
  }, [profile?.rating_band, profile?.display_name, profile?.avatar_id]);

  async function pickAvatar(id: string) {
    setAvatarId(id);
    await updateAvatarId(user?.id ?? null, id);
    await refreshProfile();
    flashSaved(`Avatar · ${AVATAR_PRESETS.find((p) => p.id === id)?.label ?? id}`);
  }

  function flashSaved(label: string) {
    setSaved(label);
    setTimeout(() => setSaved(null), 1600);
  }

  async function saveProfile() {
    setSaving(true);
    const n = Number(band);
    if (Number.isFinite(n)) {
      await updateRatingBand(user?.id ?? null, n);
      setBand(String(Math.max(800, Math.min(2400, Math.round(n)))));
    }
    await updateDisplayName(user?.id ?? null, displayName);
    await refreshProfile();
    setSaving(false);
    flashSaved('Profile saved');
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
    if (next && !ok) setStatus('Notification permission denied.');
    else if (next) setStatus(`Reminder on · ${formatReminderLabel(reminderHour)}`);
    else setStatus('Reminder off.');
  }

  async function onChangePassword() {
    if (newPassword.length < 6) {
      setStatus('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus('Passwords do not match.');
      return;
    }
    setPasswordBusy(true);
    const err = await updatePassword(newPassword);
    setPasswordBusy(false);
    if (err) {
      setStatus(err);
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    flashSaved('Password updated');
    setStatus(null);
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
            setDisplayName(profileAfter.display_name ?? '');
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
      'Deletes guest attempts, daily set, favorites, playlists, reminders pref, and onboarding on this device. Cloud data (if signed in) is not wiped from Supabase.',
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
            setDisplayName('Coder');
            setAvatarId('bolt');
            setStatus('Local training data cleared.');
          },
        },
      ],
    );
  }

  const email = user?.email ?? null;

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <Text style={styles.kicker}>PLAYER CARD</Text>
        <Text style={styles.title}>Profile & settings</Text>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <PlayerAvatar
              avatarId={avatarId}
              displayName={displayName || profile?.display_name}
              size="lg"
              showInitials
            />
            <View style={styles.heroCopy}>
              <Text style={styles.heroName}>{profile?.display_name || 'Coder'}</Text>
              <Text style={styles.heroMeta}>
                {demoMode ? 'Guest · local device' : email ?? 'Signed in'}
              </Text>
            </View>
          </View>
          <View style={styles.chipRow}>
            <XpChip label={`${profile?.streak ?? 0}D STREAK`} tone="accent" />
            <XpChip label={`${profile?.xp ?? 0} XP`} tone="xp" delayMs={40} />
            <XpChip label={`BAND ${profile?.rating_band ?? 1200}`} tone="warning" delayMs={80} />
          </View>
          {lastSyncSummary && !demoMode ? (
            <Text style={styles.hint}>Last sync · {lastSyncSummary}</Text>
          ) : null}
        </View>
      </FadeInUp>

      {saved ? <Text style={styles.savedFlash}>{saved}</Text> : null}
      {status ? <Text style={styles.status}>{status}</Text> : null}

      <Section kicker="ACCOUNT" title="Identity">
        {demoMode ? (
          <Text style={styles.hint}>
            You’re on a guest profile. Sign in to sync progress across devices.
          </Text>
        ) : (
          <>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.readOnly}>{email}</Text>
          </>
        )}
        <Text style={styles.label}>Display name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Coder"
          placeholderTextColor={colors.textDim}
          maxLength={40}
        />
        <Text style={styles.label}>Avatar</Text>
        <View style={styles.avatarGrid}>
          {AVATAR_PRESETS.map((preset) => {
            const selected = preset.id === avatarId;
            return (
              <Pressable
                key={preset.id}
                onPress={() => pickAvatar(preset.id)}
                style={[styles.avatarPick, selected && styles.avatarPickOn]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Avatar ${preset.label}`}
              >
                <PlayerAvatar avatarId={preset.id} size="sm" />
                <Text style={[styles.avatarPickLabel, selected && styles.avatarPickLabelOn]}>
                  {preset.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {demoMode ? (
          <PrimaryButton label="Sign in / Register" onPress={() => router.push('/(auth)/login')} />
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
      </Section>

      <Section kicker="LEARN" title="Random drills">
        <View style={styles.reminderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Unlock all lessons</Text>
            <Text style={styles.hint}>
              Off = only from completed lessons. On = any lesson with a Skill Check.
            </Text>
          </View>
          <Switch
            value={learnRandomScope === 'all'}
            onValueChange={onToggleLearnRandomScope}
            trackColor={{ false: colors.border, true: colors.accentDim }}
            thumbColor={learnRandomScope === 'all' ? colors.accent : colors.textDim}
          />
        </View>
      </Section>

      <Section kicker="TRAINING" title="Rating band">
        <Text style={styles.hint}>800–2400. Warm-up / Target / Boss pick around this value.</Text>
        <View style={styles.bandRow}>
          <PrimaryButton
            label="−100"
            variant="secondary"
            onPress={() => nudge(-100)}
            style={styles.nudge}
          />
          <TextInput
            style={styles.bandInput}
            keyboardType="number-pad"
            value={band}
            onChangeText={setBand}
            placeholderTextColor={colors.textDim}
          />
          <PrimaryButton
            label="+100"
            variant="secondary"
            onPress={() => nudge(100)}
            style={styles.nudge}
          />
        </View>
        <PrimaryButton
          label={demoMode ? 'Save band & name' : 'Save profile'}
          onPress={saveProfile}
          loading={saving}
        />
      </Section>

      {!demoMode ? (
        <Section kicker="SECURITY" title="Password">
          <Text style={styles.hint}>Change password for this signed-in account.</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="New password"
            placeholderTextColor={colors.textDim}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Confirm new password"
            placeholderTextColor={colors.textDim}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <PrimaryButton
            label="Update password"
            variant="secondary"
            loading={passwordBusy}
            onPress={onChangePassword}
          />
        </Section>
      ) : null}

      <Section kicker="HABIT" title="Reminders">
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
          <PrimaryButton
            label="−1h"
            variant="secondary"
            onPress={() => nudgeHour(-1)}
            style={styles.nudge}
          />
          <Text style={styles.hourReadout}>{String(reminderHour).padStart(2, '0')}:00</Text>
          <PrimaryButton
            label="+1h"
            variant="secondary"
            onPress={() => nudgeHour(1)}
            style={styles.nudge}
          />
        </View>
      </Section>

      <Section kicker="PROGRESS" title="Cloud & history">
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
      </Section>

      <Section kicker="DEVICE" title="Local data">
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
      </Section>

      <View style={styles.footerPad} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.radar,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  heroMeta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  avatarPick: {
    width: '23%',
    minWidth: 72,
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  avatarPickOn: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  avatarPickLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
  },
  avatarPickLabelOn: {
    color: colors.accent,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  savedFlash: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  status: {
    color: colors.accent,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  section: {
    marginTop: spacing.md,
    gap: 4,
  },
  sectionKicker: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionBody: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  hint: {
    color: colors.textDim,
    fontSize: 13,
  },
  readOnly: {
    color: colors.textMuted,
    fontSize: 15,
    fontFamily: 'SpaceMono',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
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
  bandInput: {
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
  statLine: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
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
  footerPad: {
    height: spacing.xl,
  },
});
