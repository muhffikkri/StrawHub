/**
 * Login screen — Google Sign-In via Firebase Authentication.
 *
 * Follows the design system splash archetype (design.md §8): moss canvas,
 * centered brand mark, serif display headline, white hero pill.
 * A demo profile keeps the prototype usable without Firebase config.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/store/auth-store';

export default function LoginScreen() {
  const { isFirebaseConfigured, googleReady, signInWithGoogle, signInDemo, lastError } =
    useAuth();
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
    } finally {
      setBusy(false);
    }
  };

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
        {busy ? (
          <ActivityIndicator color={Colors.coral} />
        ) : (
          <>
            {isFirebaseConfigured ? (
              <Pressable
                onPress={handleGoogle}
                disabled={!googleReady}
                style={({ pressed }) => [
                  styles.primaryPill,
                  !googleReady && styles.disabled,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={styles.primaryText}>
                  {googleReady ? 'Sign in with Google' : 'Google sign-in not configured'}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.notePill}>
                <Text style={styles.noteText}>
                  Firebase not configured — running in demo mode. Add your keys to
                  .env.local to enable Google Sign-In.
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleDemo}
              disabled={busy}
              style={({ pressed }) => [styles.demoButton, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.demoText}>Continue with demo profile</Text>
            </Pressable>

            {lastError ? (
              <View style={styles.errorPill}>
                <Text style={styles.errorText}>{lastError}</Text>
              </View>
            ) : null}
          </>
        )}
      </View>
    </SafeAreaView>
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
    color: 'rgba(255,255,255,0.8)',
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
  demoButton: { paddingVertical: Spacing.sm, alignItems: 'center' },
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
