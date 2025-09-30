/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { Achievement, ALL_ACHIEVEMENTS } from './achievements';
import { useNotificationStore } from './notificationStore';

interface AchievementState {
  unlockedIds: Set<string>;
  loadAchievements: (email: string) => void;
  unlockAchievement: (id: string, email: string) => void;
  clearAchievements: () => void;
}

const saveAchievements = (email: string, ids: Set<string>) => {
  try {
    const key = `nativespeak_achievements_${email}`;
    localStorage.setItem(key, JSON.stringify(Array.from(ids)));
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
};

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedIds: new Set<string>(),

  loadAchievements: (email: string) => {
    try {
      const key = `nativespeak_achievements_${email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        set({ unlockedIds: new Set(parsed) });
      } else {
        set({ unlockedIds: new Set<string>() });
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
      set({ unlockedIds: new Set<string>() });
    }
  },

  unlockAchievement: (id: string, email: string) => {
    if (get().unlockedIds.has(id)) {
      return; // Already unlocked
    }

    const achievement = ALL_ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) {
      return; // Achievement not found
    }

    const newUnlockedIds = new Set<string>(get().unlockedIds);
    newUnlockedIds.add(id);

    set({ unlockedIds: newUnlockedIds });
    saveAchievements(email, newUnlockedIds);

    useNotificationStore.getState().addNotification({
      title: 'Conquista Desbloqueada!',
      message: achievement.name,
      type: 'achievement',
      icon: achievement.icon,
    });
  },

  clearAchievements: () => {
    set({ unlockedIds: new Set<string>() });
  },
}));