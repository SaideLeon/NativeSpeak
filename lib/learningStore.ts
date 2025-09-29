/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { LessonTopic } from './state';

// FIX: Export LessonTopic so other modules can import it from here.
export type { LessonTopic };

export type LearningMode = 'conversation' | 'guided';

export const useLearningStore = create<{
  mode: LearningMode;
  lessonTopic: LessonTopic;
  setMode: (mode: LearningMode) => void;
  setLessonTopic: (topic: LessonTopic) => void;
}>((set) => ({
  mode: 'conversation',
  lessonTopic: 'ordering-food',
  setMode: (mode) => set({ mode }),
  // FIX: Corrected shorthand property to use the 'topic' argument.
  setLessonTopic: (topic) => set({ lessonTopic: topic }),
}));
