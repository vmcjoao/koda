import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { colors } from '@/constants/theme';

function TabIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color?: ColorValue | null;
}) {
  return (
    <FontAwesome
      size={22}
      style={{ marginBottom: -2 }}
      name={name}
      color={(color as string | undefined) ?? colors.textMuted}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Run',
          headerTitle: "Today's run",
          tabBarIcon: ({ color }) => <TabIcon name="bolt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Review',
          headerTitle: 'Review deck',
          tabBarIcon: ({ color }) => <TabIcon name="refresh" color={color} />,
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          title: 'Implement',
          headerTitle: 'Build queue',
          tabBarIcon: ({ color }) => <TabIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Stats',
          headerTitle: 'Stats',
          tabBarIcon: ({ color }) => <TabIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          headerTitle: 'Algorithm dojo',
          tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
        }}
      />
    </Tabs>
  );
}
