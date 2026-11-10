import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

/**
 * Floating pill dock (design.md §6): translucent white pill, sand hairline,
 * forest active state with a dot above the label. Plain-word labels —
 * never icon-only.
 */
function TabLabel({ children, focused }: { children: string; focused: boolean }) {
  return (
    <View style={styles.tabLabelWrap}>
      {focused ? <View style={styles.tabDot} /> : null}
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? Colors.forest : Colors.muted },
          focused && styles.tabLabelActive,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { palette } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.forest,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: [
          styles.dock,
          {
            backgroundColor: 'rgba(255,255,255,0.94)',
            borderColor: palette.border,
          },
        ],
        tabBarItemStyle: { borderRadius: Radius.pill },
        tabBarLabel: ({ focused, children }) =>
          typeof children === 'string' ? (
            <TabLabel focused={focused}>{children}</TabLabel>
          ) : null,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="registry" options={{ title: 'Registry' }} />
      <Tabs.Screen name="matches" options={{ title: 'Matches' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Deals' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm + 2,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    ...Shadows.soft,
  },
  tabLabelWrap: { alignItems: 'center', paddingBottom: 2 },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.pill,
    backgroundColor: Colors.forest,
    marginBottom: 2,
  },
  tabLabel: {
    fontFamily: Fonts.sans.medium,
    fontSize: 11,
  },
  tabLabelActive: { fontFamily: Fonts.sans.bold },
});
