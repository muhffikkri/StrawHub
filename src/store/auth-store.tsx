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
 *
 * The Google auth request hook lives on the login screen, mounted only when a
 * client ID exists — it throws without one, including during web SSR.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

import { ensureUserWorkspace } from '@/lib/firestore';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

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
  /** Exchanges a Google ID token (from expo-auth-session) for a Firebase session. */
  signInWithGoogleIdToken: (idToken: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
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

  /** Stable: only touches module-level Firebase instances. */
  const signInWithGoogleIdToken = useCallback(async (idToken: string) => {
    if (!auth) {
      throw new Error('Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* to .env.local.');
    }
    await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  }, []);

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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isFirebaseConfigured,
      signInWithGoogleIdToken,
      signInDemo: async () => {
        setUser(DEMO_USER);
        await persistProfile(DEMO_USER);
      },
      signOut: async () => {
        if (auth && !user?.isDemo) {
          await firebaseSignOut(auth);
        }
        setUser(null);
        await clearProfile();
      },
    }),
    [user, loading, signInWithGoogleIdToken]
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
