import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { notifications } from '../services/notifications';
import { analytics } from '../services/analytics';

interface StreakData {
  count: number;
  lastLoginDate: string;
}

/** Seconds until 08:00 tomorrow from now. */
function secondsUntilTomorrow8am(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  // Use a minimum delay so the scheduler always gets a positive value
  const MIN_NOTIFICATION_DELAY_SECONDS = 60;
  return Math.max(MIN_NOTIFICATION_DELAY_SECONDS, Math.floor((tomorrow.getTime() - now.getTime()) / 1000));
}

export const useStreak = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    updateStreak();
  }, []);

  const updateStreak = async () => {
    const todayStr = new Date().toDateString();
    const stored = await storage.get<StreakData>(storage.keys.STREAK_DATA);

    if (!stored) {
      const initial: StreakData = { count: 1, lastLoginDate: todayStr };
      await storage.set(storage.keys.STREAK_DATA, initial);
      setStreak(1);
      scheduleStreakReminder(1);
      return;
    }

    const lastDate = new Date(stored.lastLoginDate);
    lastDate.setHours(0, 0, 0, 0);
    const nowDate = new Date();
    nowDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      setStreak(stored.count);
    } else if (diffDays === 1) {
      const updated: StreakData = { count: stored.count + 1, lastLoginDate: todayStr };
      await storage.set(storage.keys.STREAK_DATA, updated);
      setStreak(updated.count);
      analytics.streakUpdated(updated.count);
      scheduleStreakReminder(updated.count);
    } else {
      const reset: StreakData = { count: 1, lastLoginDate: todayStr };
      await storage.set(storage.keys.STREAK_DATA, reset);
      setStreak(1);
      scheduleStreakReminder(1);
    }
  };

  return { streak };
};

/** Schedule (or reschedule) tomorrow's daily horoscope reminder. */
async function scheduleStreakReminder(currentStreak: number): Promise<void> {
  try {
    const enabled = await storage.get<boolean>(storage.keys.NOTIFICATIONS_ENABLED);
    if (enabled === false) return; // user has turned off notifications

    // Store the scheduled notification ID so we can cancel only the streak
    // reminder (not other notification types) on the next reschedule
    const prevId = await storage.get<string>(storage.keys.STREAK_REMINDER_ID);
    if (prevId) {
      try {
        const ExpoNotifications = await import('expo-notifications');
        await ExpoNotifications.cancelScheduledNotificationAsync(prevId);
      } catch {
        // Best-effort cancel
      }
    }

    const title = currentStreak > 1
      ? `🔥 ${currentStreak}-day streak! Don't break it`
      : '🌟 Your daily horoscope is ready';
    const body = 'Open AstroApp to check today\'s cosmic guidance.';

    const id = await notifications.scheduleLocal(title, body, secondsUntilTomorrow8am());
    await storage.set(storage.keys.STREAK_REMINDER_ID, id);
  } catch {
    // Notification scheduling is non-critical
  }
}
