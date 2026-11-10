/**
 * Login screen — Google Sign-In via Firebase Authentication.
 *
 * Follows the design system splash archetype (design.md §8): moss canvas,
 * centered brand mark, serif display headline, white hero pill.
 * A demo profile keeps the prototype usable without Firebase config.
 *
 * Google OAuth runs through expo-auth-session. The route guard
 * (Stack.Protected in _layout.tsx) redirects to the home stack
 * once the user session is restored from persistence.
 *
 * ⚠️ No window.close() is called — modern browsers (COOP/COEP) block it.
 * The popup closes automatically after the OAuth exchange completes.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';

import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import { GOOGLE_WEB_CLIENT_ID } from '@/lib/firebase';
import { useAuth } from '@/store/auth-store';

export default function LoginScreen() {
  const { isFirebaseConfigured, signInDemo } = useAuth();
  const [busy, setBusy] = useState(false);
  const googleEnabled = isFirebaseConfigured && GOOGLE_WEB_CLIENT_ID.length > 0;

  const handleDemo = async () => {
    setBusy(true);
    try {
      await signInDemo();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={styles.mark}>
          <Text style={styles.markGlyph}>🌾</Text>
        </View>
        <Text style={styles.headline}>Jerami Jadi Rupiah</Text>
        <Text style={styles.sub}>
          Match straw supply with verified buyers. Sign in to sync your registry,
          deals and impact data across devices.
        </Text>
      </View>

      <View style={styles.footer}>
        {googleEnabled ? (
          <GoogleSignInButton />
        ) : (
          <View style={styles.notePill}>
            <Text style={styles.noteText}>
              {isFirebaseConfigured
                ? 'Google sign-in is not set up — add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env.local.'
                : 'Firebase not configured — running in demo mode. Add your keys to .env.local to enable Google Sign-In.'}
            </Text>
          </View>
        )}

        <Pressable
          onPress={handleDemo}
          disabled={busy}
          style={({ pressed }) => [styles.demoButton, pressed && { opacity: 0.7 }]}
        >
          {busy ? (
            <ActivityIndicator color="rgba(255,255,255,0.9)" />
          ) : (
            <Text style={styles.demoText}>Continue with demo profile</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function GoogleSignInButton() {
  const { signInWithGoogleIdToken } = useAuth();
  const [request, response, promptAsync] = useIdTokenAuthRequest({
    // Web needs `webClientId`; native falls back to `clientId` — same OAuth client.
    clientId: GOOGLE_WEB_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    selectAccount: true,
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exchange the Google ID token for a Firebase session.
  // The route guard (Stack.Protected in _layout.tsx) will re-evaluate and
  // redirect to the home stack ((tabs)) once the user state is updated by
  // onAuthStateChanged. We do NOT call window.close() — modern browsers
  // (COOP/COEP) block it.
  useEffect(() => {
    if (!response || response.type !== 'success') return;
    const idToken = response.params?.id_token;
    if (!idToken) return;
    signInWithGoogleIdToken(idToken).catch((err: unknown) => {
      console.warn('[strawhub] firebase sign-in failed:', err);
      setError(
        err instanceof Error && err.message
          ? `Firebase sign-in failed: ${err.message}`
          : 'Firebase sign-in failed.'
      );
    });
    // No window management here — the browser handles the popup lifecycle,
    // and the route guard handles the navigation redirect.
  }, [response, signInWithGoogleIdToken]);

  // A failed OAuth round-trip is derived from the response, not stored.
  const responseError =
    response?.type === 'error' ? 'Google sign-in was cancelled or failed.' : null;

  const handlePress = async () => {
    setError(null);
    setBusy(true);
    try {
      await promptAsync();
    } finally {
      setBusy(false);
    }
  };

  const disabled = !request || busy;

  return (
    <>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.primaryPill,
          disabled && styles.disabled,
          pressed && { opacity: 0.85 },
        ]}
      >
        {busy ? (
          <ActivityIndicator color={Colors.soil} />
        ) : (
          <Text style={styles.primaryText}>
            {request ? 'Sign in with Google' : 'Preparing Google sign-in…'}
          </Text>
        )}
      </Pressable>
      {error || responseError ? (
        <View style={styles.errorPill}>
          <Text style={styles.errorText}>{error ?? responseError}</Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.moss,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.xl,
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markGlyph: { fontSize: 30 },
  headline: {
    fontFamily: Fonts.serif.medium,
    fontSize: Typography.display,
    lineHeight: Typography.display * 1.15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sub: {
    fontFamily: Fonts.sans.regular,
    fontSize: Typography.caption,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  primaryPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { backgroundColor: 'rgba(255,255,255,0.55)' },
  primaryText: {
    fontFamily: Fonts.sans.semibold,
    fontSize: 15,
    color: Colors.soil,
  },
  notePill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  noteText: {
    fontFamily: Fonts.sans.regular,
    fontSize: Typography.caption,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  demoButton: { paddingVertical: Spacing.sm, alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  demoText: {
    fontFamily: Fonts.sans.semibold,
    fontSize: Typography.caption,
    color: 'rgba(255,255,255,0.9)',
    textDecorationLine: 'underline',
  },
  errorPill: {
    backgroundColor: Colors.coralSoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  errorText: {
    fontFamily: Fonts.sans.semibold,
    fontSize: Typography.caption,
    color: Colors.coral,
    textAlign: 'center',
  },
});