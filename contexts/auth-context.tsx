import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { initialSync, hasSyncCompleted, setSyncCompleted, clearSyncFlag } from '@/lib/supabase-initial-sync';

// Must be called at module level for OAuth redirect handling
WebBrowser.maybeCompleteAuthSession();

export const redirectTo = makeRedirectUri();

// Register before React mounts to catch PASSWORD_RECOVERY during Supabase
// client initialization. The client processes recovery tokens from the URL
// hash (web) or deep link (native) during its async init, which completes
// before AuthProvider's useEffect registers its own listener.
let _pendingRecovery = false;
const { data: { subscription: _earlyRecoverySub } } = supabase.auth.onAuthStateChange(
  (event) => {
    if (event === 'PASSWORD_RECOVERY') {
      _pendingRecovery = true;
    }
  },
);

export async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;

  if (!access_token || !refresh_token) {
    throw new Error('Missing access_token or refresh_token in URL');
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;

  return data.session;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isPasswordRecovery: false,
  clearPasswordRecovery: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const syncingRef = useRef(false);

  const clearPasswordRecovery = () => setIsPasswordRecovery(false);

  const triggerInitialSync = async (userId: string) => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    try {
      const done = await hasSyncCompleted(userId);
      if (!done) {
        await initialSync(userId);
        await setSyncCompleted(userId);
      }
    } catch (e) {
      console.warn('Initial sync failed:', e);
    } finally {
      syncingRef.current = false;
    }
  };

  useEffect(() => {
    // Pick up any PASSWORD_RECOVERY event that fired before mount
    if (_pendingRecovery) {
      setIsPasswordRecovery(true);
      _pendingRecovery = false;
    }
    _earlyRecoverySub.unsubscribe();

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setIsLoading(false);
      if (existingSession?.user) {
        triggerInitialSync(existingSession.user.id);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }
        if (event === 'SIGNED_IN' && newSession?.user) {
          triggerInitialSync(newSession.user.id);
        }
        if (event === 'SIGNED_OUT') {
          // Clear sync flag for the user that just signed out
          const userId = session?.user?.id;
          if (userId) {
            clearSyncFlag(userId).catch(() => {});
          }
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading,
        isPasswordRecovery,
        clearPasswordRecovery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
