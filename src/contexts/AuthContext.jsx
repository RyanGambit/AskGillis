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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);

  // Dev mode: override profile for testing
  const [devOverride, setDevOverride] = useState(null);
  const effectiveProfile = devOverride || profile;

  const visiblePodIds = effectiveProfile
    ? effectiveProfile.role === 'executive'
      ? PODS.map(p => p.id)
      : getVisiblePodIds(effectiveProfile.manages)
    : [];

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check for invite/recovery tokens in the URL hash
    // Supabase redirects with #access_token=...&type=invite or type=recovery
    const hash = window.location.hash;
    if (hash && (hash.includes('type=invite') || hash.includes('type=recovery'))) {
      setNeedsPasswordSetup(true);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        // User clicked a password reset link
        setNeedsPasswordSetup(true);
        setLoading(false);
      } else if (session?.user) {
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

  // Email + password sign in
  async function signInWithPassword(email, password) {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    return { error };
  }

  // Set or update password (used on first login via invite, or password reset)
  async function setPassword(password) {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    setAuthError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setAuthError(error.message);
    } else {
      setNeedsPasswordSetup(false);
      // Clear the hash from the URL
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    return { error };
  }

  // Send password reset email
  async function resetPassword(email) {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    setAuthError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) setAuthError(error.message);
    return { error };
  }

  async function signOut() {
    if (!supabase) return;
    setDevOverride(null);
    setNeedsPasswordSetup(false);
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
      needsPasswordSetup,
      signInWithPassword,
      setPassword,
      resetPassword,
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
