/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { LessonTopic } from './state';
import { useAuthStore } from './authStore';

export type { LessonTopic };

export type LearningMode = 'conversation' | 'guided';

type LessonProgress = {
  currentStep: number;
};

export const useLearningStore = create<{
  mode: LearningMode;
  lessonTopic: LessonTopic;
  currentStep: number; // Current step of the active lesson
  progress: Partial<Record<LessonTopic, LessonProgress>>; // Progress for all lessons
  setMode: (mode: LearningMode) => void;
  setLessonTopic: (topic: LessonTopic) => void; // This will now handle starting/resuming
  updateCurrentStep: (step: number) => void; // Updates step for the *active* lesson
  loadProgress: () => void; // Loads from localStorage based on current user
  clearProgress: () => void;
}>((set, get) => {
  const LESSON_PROGRESS_KEY_PREFIX = 'nativespeak_lesson_progress_';

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
    currentStep: 1,
    progress: {},
    setMode: mode => set({ mode }),
    setLessonTopic: (topic: LessonTopic) => {
      const { progress } = get();
      const savedProgress = progress[topic];
      const stepToStart = savedProgress ? savedProgress.currentStep : 1;
      set({ lessonTopic: topic, currentStep: stepToStart, mode: 'guided' });
    },
    updateCurrentStep: (step: number) => {
      set(state => {
        // Only update if the step has advanced and is part of the current lesson
        if (step > state.currentStep) {
          const newProgress = {
            ...state.progress,
            [state.lessonTopic]: { currentStep: step },
          };
          saveProgress(newProgress);
          return { currentStep: step, progress: newProgress };
        }
        return state;
      });
    },
    loadProgress: () => {
      const user = useAuthStore.getState().user;
      if (user?.email) {
        try {
          const saved = localStorage.getItem(
            `${LESSON_PROGRESS_KEY_PREFIX}${user.email}`,
          );
          if (saved) {
            const parsedProgress = JSON.parse(saved) as Partial<
              Record<LessonTopic, LessonProgress>
            >;
            set({ progress: parsedProgress });
          } else {
            set({ progress: {} }); // No saved progress
          }
        } catch (e) {
          console.error('Failed to load lesson progress', e);
          set({ progress: {} });
        }
      }
    },
    clearProgress: () => {
      set({ progress: {}, currentStep: 1 });
    },
  };
});