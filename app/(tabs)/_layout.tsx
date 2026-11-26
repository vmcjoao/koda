import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router, usePathname } from 'expo-router';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type AccessibilityState,
  type ColorValue,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { PlayerAvatar } from '@/components/game/PlayerAvatar';
import { PressableScale } from '@/components/game/PressableScale';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/constants/theme';

/** Near-black bolt on the green selected orb. */
const RUN_ICON_ON = '#0B1210';

type RunTabButtonProps = {
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityState?: AccessibilityState;
  style?: StyleProp<ViewStyle>;
};

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

function isRunRoute(pathname: string): boolean {
  // Home / Run is index under (tabs): "/", "/(tabs)", "/(tabs)/index"
  return (
    pathname === '/' ||
    pathname === '/(tabs)' ||
    pathname === '/(tabs)/' ||
    pathname === '/(tabs)/index' ||
    pathname.endsWith('/(tabs)/index')
  );
}

/** Clash Royale–style raised center battle button. */
function RunTabButton({ onPress, accessibilityState, style }: RunTabButtonProps) {
  const pathname = usePathname();
  const focused = !!accessibilityState?.selected || isRunRoute(pathname);
  return (
    <View style={[styles.runSlot, style]}>
      <PressableScale
        haptic={focused ? 'light' : 'medium'}
        scaleTo={0.92}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ ...accessibilityState, selected: focused }}
        accessibilityLabel="Run"
        style={styles.runPress}
      >
        <View style={[styles.runOrb, focused ? styles.runOrbOn : styles.runOrbOff]}>
          <FontAwesome
            name="bolt"
            size={30}
            color={focused ? RUN_ICON_ON : colors.textMuted}
          />
        </View>
      </PressableScale>
    </View>
  );
}

function ProfileHeaderButton() {
  const { profile } = useAuth();
  return (
    <Pressable
      onPress={() => router.push('/settings')}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      style={styles.profileBtn}
    >
      <PlayerAvatar
        avatarId={profile?.avatar_id}
        displayName={profile?.display_name}
        size="sm"
      />
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Transparent overlay header: no reserved bar, profile stays tappable on top.
        headerTransparent: true,
        headerTitle: () => null,
        headerLeft: () => null,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' },
        headerRight: () => <ProfileHeaderButton />,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.sideLabel,
        tabBarItemStyle: styles.sideItem,
      }}
    >
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Review',
          tabBarIcon: ({ color }) => <TabIcon name="refresh" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Run',
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <RunTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          title: 'Implement',
          tabBarIcon: ({ color }) => <TabIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <TabIcon name="bar-chart" color={color} />,
        }}
      />
    </Tabs>
  );
}

const ORB = 64;

const styles = StyleSheet.create({
  profileBtn: {
    marginRight: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 92 : 74,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 26 : 10,
  },
  sideItem: {
    paddingTop: 2,
  },
  sideLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  runSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  runPress: {
    alignItems: 'center',
    marginTop: -22,
  },
  runOrb: {
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  runOrbOff: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.accentDim,
  },
  runOrbOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
