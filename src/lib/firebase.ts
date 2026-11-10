/**
 * Firebase bootstrap (JS SDK — works in Expo Go, no native build required).
 *
 * Config comes from EXPO_PUBLIC_* env vars (see .env.local.example).
 * When the config is missing the app falls back to demo mode:
 * local fixtures + demo sign-in, so the prototype always runs.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
// On React Native, Metro resolves `firebase/auth` to the RN build,
// which exports initializeAuth + getReactNativePersistence.
import * as firebaseAuth from 'firebase/auth';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';

type RNStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

/**
 * `getReactNativePersistence` ships in the React Native build that Metro
 * selects, but it is absent from the web/node builds used for SSR and the
 * published web type definitions.
 */
const getReactNativePersistence = (
  firebaseAuth as unknown as {
    getReactNativePersistence?: (storage: RNStorage) => firebaseAuth.Persistence;
  }
).getReactNativePersistence;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Web OAuth client ID used for Google Sign-In.
 * Must match a client ID listed under
 * Firebase Console → Authentication → Sign-in method → Google.
 */
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

/**
 * Auth session persists in AsyncStorage on React Native (an active token
 * survives restarts). On web/node the SDK's default persistence applies.
 * The try/catch keeps Fast Refresh (module re-evaluation) from throwing
 * auth/already-initialized.
 */
function createAuth(app: FirebaseApp): firebaseAuth.Auth {
  const persistence = getReactNativePersistence
    ? getReactNativePersistence(AsyncStorage)
    : undefined;
  if (!persistence) {
    return firebaseAuth.getAuth(app);
  }
  try {
    return firebaseAuth.initializeAuth(app, { persistence });
  } catch {
    return firebaseAuth.getAuth(app);
  }
}

function createFirestore(app: FirebaseApp): Firestore {
  try {
    return initializeFirestore(app, {
      // React Native has no WebSocket-based gRPC transport — long polling is the reliable path.
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
}

export const auth: firebaseAuth.Auth | null = firebaseApp ? createAuth(firebaseApp) : null;

export const firestore: Firestore | null = firebaseApp ? createFirestore(firebaseApp) : null;
