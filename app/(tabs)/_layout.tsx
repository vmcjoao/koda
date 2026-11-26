import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router, usePathname } from 'expo-router';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type AccessibilityState,
  type ColorValue,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
        <Text style={[styles.runLabel, focused && styles.runLabelOn]}>Run</Text>
      </PressableScale>
    </View>
  );
}

function FloatingProfileButton() {
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={() => router.push('/settings')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      style={[styles.profileFloat, { top: insets.top + 6 }]}
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
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
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
      <View pointerEvents="box-none" style={styles.profileOverlay}>
        <FloatingProfileButton />
      </View>
    </View>
  );
}

const ORB = 64;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  profileOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  profileFloat: {
    position: 'absolute',
    right: spacing.md,
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
    gap: 2,
  },
  runOrb: {
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    // Soft lift above the bar
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
  runLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  runLabelOn: {
    color: colors.accent,
  },
});
