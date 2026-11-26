import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { FadeInUp } from '@/components/game/FadeInUp';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radii, spacing } from '@/constants/theme';

/** Landed here after the password-recovery email deep link. */
export default function ResetPasswordScreen() {
  const { user, updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!user) {
      setError('Recovery session expired. Request a new reset link.');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await updatePassword(password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <Screen>
        <FadeInUp delayMs={20} waitForLaunch={false}>
          <BrandWordmark size="lg" />
          <Text style={styles.title}>Password updated</Text>
          <Text style={styles.sub}>You can keep training — you are signed in.</Text>
          <PrimaryButton label="Back to run" onPress={() => router.replace('/(tabs)')} />
        </FadeInUp>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <BrandWordmark size="lg" />
        <Text style={styles.title}>Choose a new password</Text>
        <Text style={styles.sub}>
          {user
            ? 'Recovery link verified. Set a new password for this account.'
            : 'Open the reset link from your email in this app, then return here.'}
        </Text>
      </FadeInUp>

      <TextInput
        style={styles.input}
        secureTextEntry
        autoComplete="new-password"
        placeholder="New password"
        placeholderTextColor={colors.textDim}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        autoComplete="new-password"
        placeholder="Confirm new password"
        placeholderTextColor={colors.textDim}
        value={confirm}
        onChangeText={setConfirm}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton label="Save password" onPress={onSubmit} loading={loading} disabled={!user} />
      <PrimaryButton
        label="Cancel"
        variant="ghost"
        onPress={async () => {
          await signOut();
          router.replace('/(auth)/login');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  sub: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
});
