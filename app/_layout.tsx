import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router, type Href } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LaunchOverlay } from '@/components/game/LaunchOverlay';
import { AuthProvider } from '@/contexts/AuthContext';
import { AttemptProvider } from '@/contexts/AttemptContext';
import { LaunchProvider } from '@/contexts/LaunchContext';
import { syncRemindersOnLaunch } from '@/lib/notifications';
import { colors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const KodaDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

/** Open in-app route when the user taps a scheduled reminder. */
function useNotificationObserver() {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string' && url.length > 0) {
        router.push(url as Href);
        try {
          Notifications.clearLastNotificationResponse();
        } catch {
          /* native module unavailable */
        }
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((next) => {
      redirect(next.notification);
    });

    return () => subscription.remove();
  }, []);
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [showLaunch, setShowLaunch] = useState(true);

  useNotificationObserver();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    syncRemindersOnLaunch().catch(() => {
      /* permissions / web */
    });
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <AttemptProvider>
        <LaunchProvider ready={!showLaunch}>
          <ThemeProvider value={KodaDarkTheme}>
            <StatusBar style="light" />
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.surface },
                  headerTintColor: colors.text,
                  headerTitleStyle: { fontWeight: '700' },
                  contentStyle: { backgroundColor: colors.background },
                  animation: 'fade_from_bottom',
                  animationDuration: 280,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
                <Stack.Screen
                  name="(auth)/login"
                  options={{ title: 'Sign in', presentation: 'modal' }}
                />
                <Stack.Screen name="settings" options={{ title: 'Settings' }} />
                <Stack.Screen name="catalog" options={{ title: 'Catalog' }} />
                <Stack.Screen name="playlists/index" options={{ title: 'Playlists' }} />
                <Stack.Screen name="playlists/[id]" options={{ title: 'Playlist' }} />
                <Stack.Screen name="history" options={{ title: 'History' }} />
                <Stack.Screen name="problem/[id]/index" options={{ title: 'Encounter' }} />
                <Stack.Screen name="problem/[id]/radar" options={{ title: 'Constraint Radar' }} />
                <Stack.Screen
                  name="problem/[id]/hypothesis"
                  options={{ title: 'Hypothesis' }}
                />
                <Stack.Screen name="problem/[id]/blueprint" options={{ title: 'Blueprint' }} />
                <Stack.Screen
                  name="problem/[id]/reveal"
                  options={{ title: 'Reveal', headerBackVisible: false, animation: 'fade' }}
                />
              </Stack>
              {showLaunch ? <LaunchOverlay onFinished={() => setShowLaunch(false)} /> : null}
            </View>
          </ThemeProvider>
        </LaunchProvider>
      </AttemptProvider>
    </AuthProvider>
  );
}
