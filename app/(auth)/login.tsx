import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { FadeInUp } from '@/components/game/FadeInUp';
import { PressableScale } from '@/components/game/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radii, spacing } from '@/constants/theme';
import { isSupabaseConfigured } from '@/lib/supabase';

type Mode = 'signin' | 'register' | 'reset';

export default function LoginScreen() {
  const { signInWithEmail, signUpWithEmail, requestPasswordReset, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (mode === 'register') return 'Create account';
    if (mode === 'reset') return 'Reset password';
    return 'Sign in';
  }, [mode]);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  function validate(): string | null {
    if (!email.trim() || !email.includes('@')) return 'Enter a valid email.';
    if (mode === 'reset') return null;
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'register') {
      if (password !== confirm) return 'Passwords do not match.';
      if (displayName.trim().length > 40) return 'Display name is too long.';
    }
    return null;
  }

  async function onSubmit() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === 'signin') {
      const err = await signInWithEmail(email.trim(), password);
      setLoading(false);
      if (err) setError(err);
      else router.back();
      return;
    }

    if (mode === 'register') {
      const err = await signUpWithEmail(email.trim(), password, displayName.trim() || undefined);
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
      setInfo('Account created. Check your email to confirm, then sign in.');
      setMode('signin');
      setPassword('');
      setConfirm('');
      return;
    }

    const err = await requestPasswordReset(email.trim());
    setLoading(false);
    if (err) setError(err);
    else {
      setInfo('If that email exists, a reset link is on the way.');
      setMode('signin');
    }
  }

  return (
    <Screen scroll>
      <FadeInUp delayMs={20} waitForLaunch={false}>
        <BrandWordmark size="lg" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>
          {mode === 'reset'
            ? 'We’ll email a reset link if the account exists.'
            : 'Sync attempts, XP, and streaks across devices'}
          {!isSupabaseConfigured ? ' · Supabase env missing — guest mode still works.' : '.'}
        </Text>
      </FadeInUp>

      {mode !== 'reset' ? (
        <View style={styles.tabs}>
          <PressableScale
            style={[styles.tab, mode === 'signin' && styles.tabOn]}
            onPress={() => switchMode('signin')}
          >
            <Text style={[styles.tabText, mode === 'signin' && styles.tabTextOn]}>Sign in</Text>
          </PressableScale>
          <PressableScale
            style={[styles.tab, mode === 'register' && styles.tabOn]}
            onPress={() => switchMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextOn]}>Register</Text>
          </PressableScale>
        </View>
      ) : null}

      {mode === 'register' ? (
        <TextInput
          style={styles.input}
          autoCapitalize="words"
          placeholder="Display name (optional)"
          placeholderTextColor={colors.textDim}
          value={displayName}
          onChangeText={setDisplayName}
          maxLength={40}
        />
      ) : null}

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="Email"
        placeholderTextColor={colors.textDim}
        value={email}
        onChangeText={setEmail}
      />

      {mode !== 'reset' ? (
        <TextInput
          style={styles.input}
          secureTextEntry
          autoComplete={mode === 'register' ? 'new-password' : 'password'}
          placeholder="Password"
          placeholderTextColor={colors.textDim}
          value={password}
          onChangeText={setPassword}
        />
      ) : null}

      {mode === 'register' ? (
        <TextInput
          style={styles.input}
          secureTextEntry
          autoComplete="new-password"
          placeholder="Confirm password"
          placeholderTextColor={colors.textDim}
          value={confirm}
          onChangeText={setConfirm}
        />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {info ? <Text style={styles.info}>{info}</Text> : null}

      <PrimaryButton
        label={
          mode === 'signin' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'
        }
        onPress={onSubmit}
        loading={loading}
      />

      {mode === 'signin' ? (
        <Pressable onPress={() => switchMode('reset')} style={styles.linkWrap}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      ) : null}

      {mode === 'reset' ? (
        <PrimaryButton label="Back to sign in" variant="ghost" onPress={() => switchMode('signin')} />
      ) : null}

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <PrimaryButton
        label="Continue as guest"
        variant="secondary"
        onPress={() => {
          continueAsGuest();
          router.back();
        }}
      />
      <Text style={styles.guestHint}>
        Guest progress stays on this device until you sign in and sync.
      </Text>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  tabOn: {
    backgroundColor: colors.chipSelected,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '800',
  },
  tabTextOn: {
    color: colors.accent,
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
  info: {
    color: colors.accent,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  linkWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  link: {
    color: colors.radar,
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  guestHint: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
});
