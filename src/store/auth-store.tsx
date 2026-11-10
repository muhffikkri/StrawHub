/**
 * Auth store — Firebase Authentication with Google Sign-In.
 *
 * - Google sign-in runs through expo-auth-session (works in Expo Go),
 *   then exchanges the Google ID token for a Firebase session via
 *   signInWithCredential.
 * - Firebase persists the session in AsyncStorage, so an active token
 *   bypasses the login screen on restart.
 * - The lightweight profile is also stored under
 *   `strawhub.session.profile` (local storage) for quick reads.
 * - Without Firebase env config the store falls back to a demo profile
 *   so the prototype keeps working offline.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

import { ensureUserWorkspace } from '@/lib/firestore';
import { auth, GOOGLE_WEB_CLIENT_ID, isFirebaseConfigured } from '@/lib/firebase';

export const PROFILE_STORAGE_KEY = 'strawhub.session.profile';

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  /** Demo profile — local only, no Firebase session behind it. */
  isDemo: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  /** True when the Google OAuth request is ready to be prompted. */
  googleReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  lastError: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: AuthUser = {
  uid: 'demo-farmer',
  displayName: 'Demo Farmer',
  email: 'demo.farmer@strawhub.example',
  photoURL: null,
  isDemo: true,
};

function toAuthUser(user: User): AuthUser {
  const name = user.displayName ?? user.email?.split('@')[0] ?? 'Farmer';
  return {
    uid: user.uid,
    displayName: name,
    email: user.email,
    photoURL: user.photoURL,
    isDemo: false,
  };
}

async function persistProfile(user: AuthUser): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Local profile is a convenience only — Firebase owns the session.
  }
}

async function clearProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function readProfile(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Called unconditionally (hooks rules); request stays null without a client id.
  const [googleRequest, googleResponse, promptGoogle] = useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID || undefined,
    selectAccount: true,
  });

  // Restore session: Firebase listener when configured, local profile otherwise.
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      let active = true;
      readProfile().then((profile) => {
        if (active) {
          setUser(profile);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const next = toAuthUser(firebaseUser);
        setUser(next);
        persistProfile(next);
        // First login seeds the Firestore workspace with demo data.
        ensureUserWorkspace(firebaseUser.uid, {
          displayName: next.displayName,
          email: next.email,
          photoURL: next.photoURL,
        }).catch((err) => console.warn('[strawhub] workspace seed failed:', err));
      } else {
        setUser(null);
        clearProfile();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Exchange the Google ID token for a Firebase session.
  // State updates happen in the async continuation, never in the effect body.
  useEffect(() => {
    if (!auth || !googleResponse || googleResponse.type !== 'success') return;
    const idToken = googleResponse.params?.id_token;
    if (!idToken) return;
    const credential = GoogleAuthProvider.credential(idToken);
    signInWithCredential(auth, credential).catch((err: unknown) => {
      console.warn('[strawhub] firebase sign-in failed:', err);
      setError(
        err instanceof Error && err.message
          ? `Firebase sign-in failed: ${err.message}`
          : 'Firebase sign-in failed.'
      );
    });
  }, [googleResponse]);

  // A failed OAuth round-trip is derived from the response, not stored.
  const responseError =
    googleResponse?.type === 'error'
      ? 'Google sign-in was cancelled or failed.'
      : null;
  const lastError = error ?? responseError;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isFirebaseConfigured,
      googleReady: isFirebaseConfigured && googleRequest !== null,
      signInWithGoogle: async () => {
        setError(null);
        if (!isFirebaseConfigured || !auth) {
          setError('Firebase is not configured — use the demo profile instead.');
          return;
        }
        if (!googleRequest) {
          setError('Google sign-in is not set up (missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID).');
          return;
        }
        await promptGoogle();
      },
      signInDemo: async () => {
        setError(null);
        setUser(DEMO_USER);
        await persistProfile(DEMO_USER);
      },
      signOut: async () => {
        setError(null);
        if (auth && !user?.isDemo) {
          await firebaseSignOut(auth);
        }
        setUser(null);
        await clearProfile();
      },
      lastError,
    }),
    [user, loading, googleRequest, promptGoogle, lastError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
