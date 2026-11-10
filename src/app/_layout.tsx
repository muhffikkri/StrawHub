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
import { DemoProvider } from '@/store/demo-store';

export const unstable_settings = {
  initialRouteName: '(tabs)',
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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={OrganicTheme}>
      <DemoProvider>
        <Stack
          screenOptions={{
            headerBackTitle: 'Back',
            headerTitleStyle: { fontFamily: Fonts.serif.medium },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'Register Residue' }} />
          <Stack.Screen name="impact" options={{ title: 'Impact & Evidence' }} />
          <Stack.Screen name="transaction/[id]" options={{ title: 'Transaction' }} />
        </Stack>
      </DemoProvider>
    </ThemeProvider>
  );
}
