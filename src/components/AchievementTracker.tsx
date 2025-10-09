/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect } from 'react';
import { useAuthStore } from '../lib/authStore';
import { useAchievementStore } from '../lib/achievementStore';
import { useGoalsData } from '../hooks/useGoalsData';

// This is a "logic-only" component that doesn't render any UI.
// It's responsible for tracking user progress and unlocking achievements.
const AchievementTracker = () => {
  const { user } = useAuthStore();
  const { unlockAchievement } = useAchievementStore();
  const { goals, updateGoal } = useGoalsData();

  useEffect(() => {
    if (!user) {
      return;
    }

    // --- Goal-based Achievements ---
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    if (completedGoals >= 5) {
      unlockAchievement('complete_5_goals');
    }

    // --- Time-based Achievements ---
    const totalMinutes = (user.totalConversationTime || 0) / 60;

    if (totalMinutes >= 10) {
      unlockAchievement('convo_10_minutes');
    }
    if (totalMinutes >= 60) {
      unlockAchievement('convo_60_minutes');
    }

    // --- Lesson-based Achievements ---
    const lessons = user.completedLessons || 0;
    if (lessons >= 1) {
        unlockAchievement('complete_1_lesson');
    }
    if (lessons >= 5) {
      unlockAchievement('complete_5_lessons');
    }

    // --- Auto-complete goals based on other stats ---
    if (totalMinutes >= 60) {
      const goalToComplete = goals.find(
        (g) => g.text.toLowerCase().includes('1 hora') && g.status !== 'completed'
      );
      if (goalToComplete) {
        updateGoal(goalToComplete.id, { status: 'completed' });
      }
    }

  }, [user, goals, unlockAchievement, updateGoal]);

  return null; // This component does not render anything.
};

export default AchievementTracker;