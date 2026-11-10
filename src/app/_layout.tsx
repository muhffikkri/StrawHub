import {
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_500Medium,
  Newsreader_500Medium_Italic,
  Newsreader_600SemiBold,
} from '@expo-google-fonts/newsreader';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import React, { useEffect } from 'react';

import { Colors, Fonts } from '@/constants/theme';
import { useAuth, AuthProvider } from '@/store/auth-store';
import { DemoProvider } from '@/store/demo-store';

import * as WebBrowser from 'expo-web-browser';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

/** Single light organic navigation theme (design.md §3). */
const OrganicTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.forest,
    background: Colors.cream,
    card: '#FFFFFF',
    text: Colors.soil,
    border: Colors.sand,
  },
};

export default function RootLayout() {
  // Complete the OAuth exchange when Google redirects the popup back to our
  // own URL (the popup boots our app fresh — it does not land on /login).
  // No-op when no session is in progress, so safe on every mount.
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  return (
    <ThemeProvider value={OrganicTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

/**
 * Route gate: an active session (restored from local storage) bypasses the
 * login screen; a signed-out user can only reach /login.
 */
function RootNavigator() {
  const { user, loading } = useAuth();

  const [fontsLoaded] = useFonts({
    [Fonts.serif.regular]: Newsreader_400Regular,
    [Fonts.serif.medium]: Newsreader_500Medium,
    [Fonts.serif.semibold]: Newsreader_600SemiBold,
    [Fonts.serif.italic]: Newsreader_400Regular_Italic,
    [Fonts.serif.italicMedium]: Newsreader_500Medium_Italic,
    [Fonts.sans.regular]: PlusJakartaSans_400Regular,
    [Fonts.sans.medium]: PlusJakartaSans_500Medium,
    [Fonts.sans.semibold]: PlusJakartaSans_600SemiBold,
    [Fonts.sans.bold]: PlusJakartaSans_700Bold,
  });

  const ready = fontsLoaded && !loading;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <DemoProvider>
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          headerTitleStyle: { fontFamily: Fonts.serif.medium },
        }}
      >
        <Stack.Protected guard={!!user} redirectTo="/login">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'Register Residue' }} />
          <Stack.Screen name="impact" options={{ title: 'Impact & Evidence' }} />
          <Stack.Screen name="transaction/[id]" options={{ title: 'Transaction' }} />
        </Stack.Protected>
        <Stack.Protected guard={!user} redirectTo="/">
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </DemoProvider>
  );
}
