import * as ExpoNotifications from 'expo-notifications';
import { Platform } from 'react-native';
import { storage } from '../utils/storage';

ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notifications = {
  /** Request permission and store the Expo push token. */
  async registerForPushNotifications(): Promise<string | null> {
    // Push notifications are not supported on emulators without credentials
    if (Platform.OS === 'android') {
      await ExpoNotifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: ExpoNotifications.AndroidImportance.DEFAULT,
      });
    }

    const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    try {
      const tokenData = await ExpoNotifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      await storage.set(storage.keys.PUSH_TOKEN, token);
      return token;
    } catch {
      // Token retrieval can fail in simulators or Expo Go without project ID
      return null;
    }
  },

  /** Return the cached push token (if any). */
  async getStoredToken(): Promise<string | null> {
    return storage.get<string>(storage.keys.PUSH_TOKEN);
  },

  /** Schedule a local notification (used for streak reminders, etc.). */
  async scheduleLocal(
    title: string,
    body: string,
    triggerSeconds: number
  ): Promise<string> {
    return ExpoNotifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: { type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: triggerSeconds },
    });
  },

  /** Cancel all pending local notifications. */
  async cancelAll(): Promise<void> {
    await ExpoNotifications.cancelAllScheduledNotificationsAsync();
  },

  /** Add a listener for incoming notifications while the app is foregrounded. */
  addReceivedListener(
    handler: (notification: ExpoNotifications.Notification) => void
  ) {
    return ExpoNotifications.addNotificationReceivedListener(handler);
  },

  /** Add a listener for when the user taps a notification. */
  addResponseListener(
    handler: (response: ExpoNotifications.NotificationResponse) => void
  ) {
    return ExpoNotifications.addNotificationResponseReceivedListener(handler);
  },
};
