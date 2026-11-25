import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { getProfile } from '@/lib/api';
import type { UserProfile } from '@/types/database';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  demoMode: boolean;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);

  const refreshProfile = useCallback(async () => {
    const p = await getProfile(user?.id ?? null);
    setProfile(p);
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
      const p = await getProfile(data.session?.user?.id ?? null);
      if (mounted) {
        setProfile(p);
        setLoading(false);
      }

      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
        setSession(next);
        setUser(next?.user ?? null);
        setGuest(false);
        const nextProfile = await getProfile(next?.user?.id ?? null);
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
      signInWithEmail,
      signUpWithEmail,
      signOut,
      continueAsGuest,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      loading,
      guest,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      continueAsGuest,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
