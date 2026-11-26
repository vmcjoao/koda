import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { getProfile, syncLocalProgressToCloud } from '@/lib/api';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/database';

export type SignUpResult = {
  error: string | null;
  /** True when Supabase created the user but did not return a session yet. */
  needsEmailConfirm?: boolean;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  demoMode: boolean;
  /** True while a password-recovery deep link session is active. */
  passwordRecovery: boolean;
  lastSyncSummary: string | null;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<SignUpResult>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  clearPasswordRecovery: () => void;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  refreshProfile: () => Promise<void>;
  syncNow: () => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function runSync(userId: string): Promise<string> {
  const result = await syncLocalProgressToCloud(userId);
  if (result.error) return result.error;
  if (
    result.uploadedAttempts === 0 &&
    result.upsertedStates === 0 &&
    result.uploadedFavorites === 0 &&
    result.uploadedPlaylists === 0 &&
    !result.profileSynced
  ) {
    return 'Nothing new to sync.';
  }
  const parts: string[] = [];
  if (result.uploadedAttempts) parts.push(`${result.uploadedAttempts} attempt(s)`);
  if (result.upsertedStates) parts.push(`${result.upsertedStates} review state(s)`);
  if (result.uploadedFavorites) parts.push(`${result.uploadedFavorites} favorite(s)`);
  if (result.uploadedPlaylists) parts.push(`${result.uploadedPlaylists} playlist(s)`);
  if (result.profileSynced) parts.push('XP/streak');
  const base = parts.length ? `Synced ${parts.join(', ')}` : 'Synced';
  return result.pendingLeft > 0 ? `${base} · ${result.pendingLeft} still pending` : base;
}

function authRedirectTo(path: string): string {
  return Linking.createURL(path);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [lastSyncSummary, setLastSyncSummary] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    const p = await getProfile(user?.id ?? null);
    setProfile(p);
  }, [user?.id]);

  const syncNow = useCallback(async () => {
    if (!user?.id) return 'Sign in to sync guest progress.';
    const summary = await runSync(user.id);
    setLastSyncSummary(summary);
    const p = await getProfile(user.id);
    setProfile(p);
    return summary;
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    async function init() {
      if (!supabase) {
        const p = await getProfile(null);
        if (mounted) {
          setProfile(p);
          setGuest(true);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        const summary = await runSync(data.session.user.id);
        if (mounted) setLastSyncSummary(summary);
      }

      const p = await getProfile(data.session?.user?.id ?? null);
      if (mounted) {
        setProfile(p);
        setLoading(false);
      }

      const { data: sub } = supabase.auth.onAuthStateChange(async (event, next) => {
        setSession(next);
        setUser(next?.user ?? null);

        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true);
          setGuest(false);
          if (next?.user) {
            const nextProfile = await getProfile(next.user.id);
            setProfile(nextProfile);
          }
          try {
            router.push('/(auth)/reset');
          } catch {
            /* navigation tree may not be ready yet */
          }
          return;
        }

        if (!next?.user) {
          setGuest(true);
          setPasswordRecovery(false);
          const guestProfile = await getProfile(null);
          setProfile(guestProfile);
          return;
        }

        setGuest(false);
        if (event === 'SIGNED_IN') {
          setPasswordRecovery(false);
          const summary = await runSync(next.user.id);
          setLastSyncSummary(summary);
        }
        const nextProfile = await getProfile(next.user.id);
        setProfile(nextProfile);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    }

    init();
    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return 'Supabase is not configured. Continue as guest.';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string): Promise<SignUpResult> => {
      if (!supabase) {
        return { error: 'Supabase is not configured. Continue as guest.' };
      }
      const name = displayName?.trim();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: authRedirectTo('(auth)/login'),
          ...(name ? { data: { display_name: name } } : {}),
        },
      });
      if (error) return { error: error.message };
      if (!data.session) return { error: null, needsEmailConfirm: true };
      return { error: null };
    },
    [],
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!supabase) return 'Supabase is not configured.';
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: authRedirectTo('(auth)/reset'),
    });
    return error?.message ?? null;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return 'Supabase is not configured.';
    if (!user) return 'Sign in to change your password.';
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setPasswordRecovery(false);
    return error?.message ?? null;
  }, [user]);

  const clearPasswordRecovery = useCallback(() => setPasswordRecovery(false), []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setGuest(true);
    setPasswordRecovery(false);
    setUser(null);
    setSession(null);
    setLastSyncSummary(null);
    const p = await getProfile(null);
    setProfile(p);
  }, []);

  const continueAsGuest = useCallback(() => {
    setGuest(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      demoMode: guest || !isSupabaseConfigured || !user,
      passwordRecovery,
      lastSyncSummary,
      signInWithEmail,
      signUpWithEmail,
      requestPasswordReset,
      updatePassword,
      clearPasswordRecovery,
      signOut,
      continueAsGuest,
      refreshProfile,
      syncNow,
    }),
    [
      user,
      session,
      profile,
      loading,
      guest,
      passwordRecovery,
      lastSyncSummary,
      signInWithEmail,
      signUpWithEmail,
      requestPasswordReset,
      updatePassword,
      clearPasswordRecovery,
      signOut,
      continueAsGuest,
      refreshProfile,
      syncNow,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
