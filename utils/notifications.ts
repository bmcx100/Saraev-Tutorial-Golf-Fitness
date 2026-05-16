import Constants from 'expo-constants';
import { Platform } from 'react-native';

// expo-notifications push support was removed from Expo Go in SDK 53+.
// The require itself throws a fatal error in Expo Go, so we must skip
// loading entirely when running inside Expo Go.
const isExpoGo = Constants.appOwnership === 'expo';

let Notifications: typeof import('expo-notifications') | null = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
  } catch {
    // Native module unavailable — notifications disabled
  }
}

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web' || !Notifications) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedules the two daily recurring notifications.
 * Cancels all existing ones first to avoid duplicates.
 */
export async function scheduleDaily(
  morningTime: string,
  eveningTime: string,
  activeHabitCount: number,
  enabled: boolean,
): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!enabled) return;

  const [mHour, mMin] = morningTime.split(':').map(Number);
  const [eHour, eMin] = eveningTime.split(':').map(Number);

  // Morning reminder
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for your sessions',
      body: `Start your day right. You have ${activeHabitCount} sessions waiting.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: mHour,
      minute: mMin,
    },
  });

  // Evening check-in
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't forget your sessions today!",
      body: 'Check in and log your progress before bed.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: eHour,
      minute: eMin,
    },
  });
}
