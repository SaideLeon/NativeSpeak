/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { LessonTopic } from './lessons';
import { useAuthStore } from './authStore';

export type { LessonTopic };

export type LearningMode = 'conversation' | 'guided';

type LessonProgress = {
  currentStep: number;
};

// Refactored to remove redundant currentStep and improve persistence logic.
export const useLearningStore = create<{
  mode: LearningMode;
  lessonTopic: LessonTopic;
  progress: Partial<Record<LessonTopic, LessonProgress>>;
  continuationPrompt: string | null;
  setMode: (mode: LearningMode) => void;
  setLessonTopic: (topic: LessonTopic) => void;
  setContinuationPrompt: (prompt: string) => void;
  goToStep: (step: number) => void;
  loadProgress: () => void;
  clearProgress: () => void;
  clearContinuationPrompt: () => void;
}>((set, get) => {
  const LESSON_PROGRESS_KEY_PREFIX = 'nativespeak_lesson_progress_';

  // Helper to save progress to localStorage, associated with the current user.
  const saveProgress = (
    progress: Partial<Record<LessonTopic, LessonProgress>>,
  ) => {
    const user = useAuthStore.getState().user;
    if (user?.email) {
      try {
        localStorage.setItem(
          `${LESSON_PROGRESS_KEY_PREFIX}${user.email}`,
          JSON.stringify(progress),
        );
      } catch (e) {
        console.error('Failed to save lesson progress', e);
      }
    }
  };

  return {
    mode: 'conversation',
    lessonTopic: 'ordering-food',
    progress: {},
    continuationPrompt: null,
    setMode: mode => set({ mode }),
    setLessonTopic: (topic: LessonTopic) => {
      set(state => {
        // If there's no progress for this topic, initialize it.
        // This ensures it appears in the user's "in-progress" list.
        if (!state.progress[topic]) {
          const newProgress = {
            ...state.progress,
            [topic]: { currentStep: 1 },
          };
          saveProgress(newProgress);
          return { lessonTopic: topic, mode: 'guided', progress: newProgress };
        }
        // If progress already exists, just switch to the lesson.
        return { lessonTopic: topic, mode: 'guided' };
      });
    },
    setContinuationPrompt: (prompt: string) => set({ continuationPrompt: prompt }),
    goToStep: (step: number) => {
      const newStep = Math.max(1, Math.min(5, step)); // Lessons have 5 steps.
      set(state => {
        const currentStep = state.progress[state.lessonTopic]?.currentStep ?? 1;
        if (newStep === currentStep) return state;

        const newProgress = {
          ...state.progress,
          [state.lessonTopic]: { currentStep: newStep },
        };
        saveProgress(newProgress);
        return { progress: newProgress };
      });
    },
    // Loads progress from localStorage for the currently logged-in user.
    loadProgress: () => {
      const user = useAuthStore.getState().user;
      if (user?.email) {
        try {
          const saved = localStorage.getItem(
            `${LESSON_PROGRESS_KEY_PREFIX}${user.email}`,
          );
          if (saved) {
            set({ progress: JSON.parse(saved) });
          } else {
            set({ progress: {} }); // No saved progress for this user.
          }
        } catch (e) {
          console.error('Failed to load lesson progress', e);
          set({ progress: {} });
        }
      }
    },
    // Clears progress from the state (e.g., on logout).
    clearProgress: () => {
      set({ progress: {} });
    },
    clearContinuationPrompt: () => set({ continuationPrompt: null }),
  };
});