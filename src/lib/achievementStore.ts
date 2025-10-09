/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { Achievement, ALL_ACHIEVEMENTS } from './achievements';
import { useNotificationStore } from './notificationStore';
import { useAuthStore } from './authStore';

const API_URL = 'https://nativespeak.cognick.qzz.io/api';

interface AchievementState {
  unlockedIds: Set<string>;
  lastUnlocked: Achievement | null;
  fetchAchievements: () => Promise<void>;
  unlockAchievement: (id: string) => Promise<void>;
  clearAchievements: () => void;
  clearLastUnlocked: () => void;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedIds: new Set<string>(),
  lastUnlocked: null,

  fetchAchievements: async () => {
    const token = useAuthStore.getState().user?.token?.access;
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/achievements/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const data = await response.json();
      const unlockedIds = new Set<string>(data.results.map((ach: any) => ach.name)); // Assuming name is the unique identifier used as ID
      set({ unlockedIds });
    } catch (error) {
      console.error('Failed to load achievements:', error);
      set({ unlockedIds: new Set<string>() });
    }
  },

  unlockAchievement: async (id: string) => {
    const { unlockedIds, fetchAchievements } = get();
    const achievement = ALL_ACHIEVEMENTS.find(a => a.id === id);

    if (!achievement || unlockedIds.has(achievement.name)) {
      return; // Not found or already unlocked
    }

    try {
      const token = useAuthStore.getState().user?.token?.access;
      if (!token) return;

      const response = await fetch(`${API_URL}/achievements/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: achievement.name, 
          description: achievement.description 
        }),
      });

      if (!response.ok) throw new Error('Failed to unlock achievement');
      
      // Refetch achievements to ensure consistency
      await fetchAchievements();

      set({ lastUnlocked: achievement });

      useNotificationStore.getState().addNotification({
        title: 'Conquista Desbloqueada!',
        message: achievement.name,
        type: 'achievement',
        icon: achievement.icon,
      });

    } catch (error) {
      console.error('Failed to unlock achievement:', error);
    }
  },

  clearAchievements: () => {
    set({ unlockedIds: new Set<string>(), lastUnlocked: null });
  },

  clearLastUnlocked: () => {
    set({ lastUnlocked: null });
  },
}));
