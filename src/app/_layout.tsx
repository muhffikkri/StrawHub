import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';

import { DemoProvider } from '@/store/demo-store';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DemoProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerBackTitle: 'Back',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'Register Residue' }} />
          <Stack.Screen name="impact" options={{ title: 'Impact & Evidence' }} />
          <Stack.Screen
            name="transaction/[id]"
            options={{ title: 'Transaction' }}
          />
        </Stack>
      </DemoProvider>
    </ThemeProvider>
  );
}
