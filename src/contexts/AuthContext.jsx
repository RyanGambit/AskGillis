import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { USERS, PODS, getVisiblePodIds } from '../data/userSeed.js';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // Supabase auth user
  const [profile, setProfile] = useState(null);   // profiles table row
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Dev mode: override profile for testing
  const [devOverride, setDevOverride] = useState(null);

  // The effective profile (real or dev-overridden)
  const effectiveProfile = devOverride || profile;

  // Compute visible pods for the effective profile
  const visiblePodIds = effectiveProfile
    ? effectiveProfile.role === 'executive'
      ? PODS.map(p => p.id)
      : getVisiblePodIds(effectiveProfile.manages)
    : [];

  useEffect(() => {
    if (!supabase) {
      // No Supabase configured - use dev mode with local seed data
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch profile:', error);
      // Profile might not exist yet if trigger failed — try to create from seed data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.email) {
        const seedUser = USERS.find(u => u.email === authUser.email.toLowerCase());
        if (seedUser) {
          const { data: newProfile, error: insertErr } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              email: seedUser.email,
              full_name: seedUser.fullName,
              title: seedUser.title,
              role: seedUser.role,
              pod_id: seedUser.podId,
              manages: seedUser.manages,
            })
            .select()
            .single();
          if (!insertErr && newProfile) {
            setProfile(newProfile);
            setLoading(false);
            return;
          }
        }
      }
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  async function signInWithMagicLink(email) {
    if (!supabase) {
      setAuthError('Supabase not configured');
      return { error: { message: 'Supabase not configured' } };
    }
    setAuthError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) setAuthError(error.message);
    return { error };
  }

  async function signOut() {
    if (!supabase) return;
    setDevOverride(null);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  // Dev mode: impersonate a user from the seed data
  function devSetProfile(email) {
    const seedUser = USERS.find(u => u.email === email);
    if (seedUser) {
      setDevOverride({
        id: 'dev-' + seedUser.email,
        email: seedUser.email,
        full_name: seedUser.fullName,
        title: seedUser.title,
        role: seedUser.role,
        pod_id: seedUser.podId,
        manages: seedUser.manages,
        is_active: true,
      });
    }
  }

  function devClearOverride() {
    setDevOverride(null);
  }

  // Dev mode: sign in without Supabase using seed data
  function devSignIn(email) {
    const seedUser = USERS.find(u => u.email === email);
    if (seedUser) {
      const fakeProfile = {
        id: 'dev-' + seedUser.email,
        email: seedUser.email,
        full_name: seedUser.fullName,
        title: seedUser.title,
        role: seedUser.role,
        pod_id: seedUser.podId,
        manages: seedUser.manages,
        is_active: true,
      };
      setUser({ id: fakeProfile.id, email: seedUser.email });
      setProfile(fakeProfile);
      return true;
    }
    return false;
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile: effectiveProfile,
      realProfile: profile,
      loading,
      authError,
      visiblePodIds,
      signInWithMagicLink,
      signOut,
      devSetProfile,
      devClearOverride,
      devSignIn,
      devOverride,
      isSupabaseConfigured: !!supabase,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
