import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

interface StreakData {
  count: number;
  lastLoginDate: string;
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
      return;
    }

    const lastDate = new Date(stored.lastLoginDate);
    lastDate.setHours(0, 0, 0, 0);
    const nowDate = new Date();
    nowDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no change
      setStreak(stored.count);
    } else if (diffDays === 1) {
      // Consecutive day
      const updated: StreakData = { count: stored.count + 1, lastLoginDate: todayStr };
      await storage.set(storage.keys.STREAK_DATA, updated);
      setStreak(updated.count);
    } else {
      // Streak broken
      const reset: StreakData = { count: 1, lastLoginDate: todayStr };
      await storage.set(storage.keys.STREAK_DATA, reset);
      setStreak(1);
    }
  };

  return { streak };
};
