/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect, useRef } from 'react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useAuthStore } from '../lib/authStore';
import { useAchievementStore } from '../lib/achievementStore';
import { useLearningStore } from '../lib/learningStore';
import { useGoalsData } from '../hooks/useGoalsData';

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

export default function SessionTimer() {
  const { connected } = useLiveAPIContext();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const wasConnectedRef = useRef(false);

  const { updateCredits, user, addConversationTime, incrementCompletedLessons } = useAuthStore();
  const { unlockAchievement } = useAchievementStore();
  const { mode } = useLearningStore();
  const { completeTaskByText } = useTodoStore();

  // Effect for the timer logic.
  useEffect(() => {
    if (!connected) {
      setElapsedSeconds(0);
      return;
    }

    const interval = window.setInterval(() => {
      // Use functional update to avoid needing elapsedSeconds in dependencies
      setElapsedSeconds(prevSeconds => {
        const newSeconds = prevSeconds + 1;
        
        // Deduct credits every 10 seconds of conversation
        if (newSeconds > 0 && newSeconds % 10 === 0) {
          // This is safe. `updateCredits` uses the `set(state => ...)` form
          // and can access the latest state, so we don't need to pass user/credits from here.
          updateCredits(-10);
        }
        
        // Check for 2-minute goal completion
        if (newSeconds === 2 * 60) { // 2 minutes in seconds
          completeTaskByText('2 minutos');
        }

        // Check for 10-minute goal completion
        if (newSeconds === 10 * 60) { // 10 minutes in seconds
          completeTaskByText('10 minutos');
        }
        return newSeconds;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [connected, updateCredits, completeTaskByText]); // Dependencies are stable, effect runs only when `connected` changes.

  // Effect for session cleanup logic, which runs when a session ends.
  useEffect(() => {
    // Check if the connection state changed from connected (true) to disconnected (false).
    if (wasConnectedRef.current && !connected) {
      if (elapsedSeconds > 0 && user) {
        addConversationTime(elapsedSeconds);
        unlockAchievement('first_session', user.email);
        if (mode === 'guided') {
          incrementCompletedLessons();
        }
      }
    }
    // Update the ref at the end of every render to track the previous state for the next render.
    wasConnectedRef.current = connected;
  }, [connected, elapsedSeconds, user, addConversationTime, unlockAchievement, mode, incrementCompletedLessons]);

  if (!connected) {
    return null;
  }

  return (
    <div className="session-timer">
      <span className="icon">timer</span>
      <span className="time-display">{formatTime(elapsedSeconds)}</span>
    </div>
  );
}