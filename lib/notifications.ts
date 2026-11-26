import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const PREF_KEY = 'koda.reminders.enabled';
const HOUR_KEY = 'koda.reminders.hour';
const DEFAULT_HOUR = 19;
const MINUTE = 0;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('daily', {
    name: 'Daily training',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function areRemindersEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(PREF_KEY)) === '1';
}

export async function getReminderHour(): Promise<number> {
  const raw = await AsyncStorage.getItem(HOUR_KEY);
  const n = raw == null ? DEFAULT_HOUR : Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_HOUR;
  return Math.max(0, Math.min(23, Math.round(n)));
}

export async function setReminderHour(hour: number): Promise<number> {
  const clamped = Math.max(0, Math.min(23, Math.round(hour)));
  await AsyncStorage.setItem(HOUR_KEY, String(clamped));
  if (await areRemindersEnabled()) {
    await scheduleDailyReminder();
  }
  return clamped;
}

export function formatReminderLabel(hour: number): string {
  const hh = String(hour).padStart(2, '0');
  return `Daily at ${hh}:00 (device time)`;
}

export async function requestReminderPermissions(): Promise<boolean> {
  void Device.isDevice;
  if (Platform.OS === 'web') return false;

  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync();
  return !!(
    asked.granted ||
    asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function scheduleDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  const hour = await getReminderHour();
  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Koda · Daily Set',
      body: 'Warm-up, Target, Boss — keep the streak. Check Review if anything is due.',
      data: { url: '/(tabs)' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: MINUTE,
      channelId: Platform.OS === 'android' ? 'daily' : undefined,
    },
  });
}

export async function cancelReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Enable or disable the daily reminder. Returns false if permission denied. */
export async function setRemindersEnabled(enabled: boolean): Promise<boolean> {
  if (!enabled) {
    await cancelReminders();
    await AsyncStorage.setItem(PREF_KEY, '0');
    return true;
  }
  const ok = await requestReminderPermissions();
  if (!ok) {
    await AsyncStorage.setItem(PREF_KEY, '0');
    return false;
  }
  await scheduleDailyReminder();
  await AsyncStorage.setItem(PREF_KEY, '1');
  return true;
}

/** Re-apply schedule on launch if the user previously enabled reminders. */
export async function syncRemindersOnLaunch(): Promise<void> {
  if (Platform.OS === 'web') return;
  if (!(await areRemindersEnabled())) return;
  const ok = await requestReminderPermissions();
  if (ok) await scheduleDailyReminder();
}
