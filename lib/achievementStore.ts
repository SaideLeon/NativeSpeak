/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { Achievement, ALL_ACHIEVEMENTS } from './achievements';

interface AchievementState {
  unlockedIds: Set<string>;
  lastUnlocked: Achievement | null;
  loadAchievements: (email: string) => void;
  unlockAchievement: (id: string, email: string) => void;
  clearLastUnlocked: () => void;
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
  // FIX: Explicitly set the type for the new Set to avoid it being inferred as Set<unknown>.
  unlockedIds: new Set<string>(),
  lastUnlocked: null,

  loadAchievements: (email: string) => {
    try {
      const key = `nativespeak_achievements_${email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        set({ unlockedIds: new Set(parsed) });
      } else {
        // FIX: Explicitly set the type for the new Set to avoid it being inferred as Set<unknown>.
        set({ unlockedIds: new Set<string>() });
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
      // FIX: Explicitly set the type for the new Set to avoid it being inferred as Set<unknown>.
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

    const newUnlockedIds = new Set(get().unlockedIds);
    newUnlockedIds.add(id);

    set({ unlockedIds: newUnlockedIds, lastUnlocked: achievement });
    saveAchievements(email, newUnlockedIds);
  },

  clearLastUnlocked: () => {
    set({ lastUnlocked: null });
  },

  clearAchievements: () => {
    // FIX: Explicitly set the type for the new Set to avoid it being inferred as Set<unknown>.
    set({ unlockedIds: new Set<string>(), lastUnlocked: null });
  },
}));