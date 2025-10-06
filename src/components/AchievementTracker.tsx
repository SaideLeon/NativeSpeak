/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect } from 'react';
import { useAuthStore } from '../lib/authStore';
import { useAchievementStore } from '../lib/achievementStore';
import { useTodoStore } from '../lib/todoStore';

// This is a "logic-only" component that doesn't render any UI.
// It's responsible for tracking user progress and unlocking achievements.
const AchievementTracker = () => {
  const { user } = useAuthStore();
  const { unlockAchievement } = useAchievementStore();
  const { completeTaskByText } = useTodoStore();

  useEffect(() => {
    if (!user) {
      return;
    }

    // --- Time-based Achievements ---
    const totalMinutes = (user.totalConversationTime || 0) / 60;

    if (totalMinutes >= 10) {
      unlockAchievement('convo_10_minutes', user.email);
    }
    if (totalMinutes >= 60) {
      unlockAchievement('convo_60_minutes', user.email);
    }

    // --- Lesson-based Achievements ---
    const lessons = user.completedLessons || 0;
    if (lessons >= 1) {
        unlockAchievement('complete_1_lesson', user.email);
    }
    if (lessons >= 5) {
      unlockAchievement('complete_5_lessons', user.email);
    }

    // --- Todo-based Progress Tracking ---
    if (totalMinutes >= 60) {
      completeTaskByText('1 hora');
    }
    
  }, [user, unlockAchievement, completeTaskByText]);

  return null; // This component does not render anything.
};

export default AchievementTracker;