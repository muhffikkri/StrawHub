import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

/**
 * Tab labels carry plain words alongside visual weight — never rely on
 * an icon alone (design.md §7).
 */
function TabLabel({ children, focused }: { children: string; focused: boolean }) {
  const { palette } = useAppTheme();
  return (
    <Text
      style={[
        styles.tabLabel,
        { color: focused ? palette.accent : palette.textSecondary },
        focused && styles.tabLabelActive,
      ]}
    >
      {children}
    </Text>
  );
}

export default function TabsLayout() {
  const { palette } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Home</TabLabel>,
        }}
      />
      <Tabs.Screen
        name="registry"
        options={{
          title: 'Registry',
          tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Registry</TabLabel>,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Matches</TabLabel>,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Deals</TabLabel>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: { fontSize: 11, fontWeight: '500' },
  tabLabelActive: { fontWeight: '700' },
  tabBarLabel: { marginTop: 2 },
});
