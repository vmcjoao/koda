import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getProfile, syncLocalProgressToCloud } from '@/lib/api';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/database';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  demoMode: boolean;
  lastSyncSummary: string | null;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
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
    !result.profileSynced
  ) {
    return 'Nothing new to sync.';
  }
  const parts: string[] = [];
  if (result.uploadedAttempts) parts.push(`${result.uploadedAttempts} attempt(s)`);
  if (result.upsertedStates) parts.push(`${result.upsertedStates} review state(s)`);
  if (result.uploadedFavorites) parts.push(`${result.uploadedFavorites} favorite(s)`);
  if (result.profileSynced) parts.push('XP/streak');
  const base = parts.length ? `Synced ${parts.join(', ')}` : 'Synced';
  return result.pendingLeft > 0 ? `${base} · ${result.pendingLeft} still pending` : base;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);
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
        if (!next?.user) {
          setGuest(true);
          const guestProfile = await getProfile(null);
          setProfile(guestProfile);
          return;
        }

        setGuest(false);
        if (event === 'SIGNED_IN') {
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

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return 'Supabase is not configured. Continue as guest.';
    const { error } = await supabase.auth.signUp({ email, password });
    return error?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setGuest(true);
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
      lastSyncSummary,
      signInWithEmail,
      signUpWithEmail,
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
      lastSyncSummary,
      signInWithEmail,
      signUpWithEmail,
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
