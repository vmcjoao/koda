import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radii, spacing } from '@/constants/theme';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function LoginScreen() {
  const { signInWithEmail, signUpWithEmail, continueAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSignIn() {
    setLoading(true);
    setError(null);
    const err = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
    else router.back();
  }

  async function onSignUp() {
    setLoading(true);
    setError(null);
    const err = await signUpWithEmail(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
    else {
      setError('Check your email to confirm, or sign in if confirmations are disabled.');
    }
  }

  return (
    <Screen scroll>
      <BrandWordmark size="lg" />
      <Text style={styles.sub}>
        Sign in to upload guest progress and sync attempts across devices
        {!isSupabaseConfigured ? ' (Supabase env not set — guest mode works offline).' : '.'}
      </Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={colors.textDim}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={colors.textDim}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton label="Sign in" onPress={onSignIn} loading={loading} />
      <PrimaryButton label="Create account" onPress={onSignUp} variant="secondary" disabled={loading} />
      <PrimaryButton
        label="Continue as guest"
        variant="ghost"
        onPress={() => {
          continueAsGuest();
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.sm,
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
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
});
