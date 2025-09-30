/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect, useRef } from 'react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useAuthStore } from '../lib/authStore';
import { useAchievementStore } from '../lib/achievementStore';
import { useLearningStore } from '../lib/learningStore';
import { useTodoStore } from '../lib/todoStore';

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
  const elapsedSecondsRef = useRef(elapsedSeconds);
  elapsedSecondsRef.current = elapsedSeconds;

  const { updateCredits, user, addConversationTime, incrementCompletedLessons } = useAuthStore();
  const { unlockAchievement } = useAchievementStore();
  const { mode } = useLearningStore();
  const { completeTaskByText } = useTodoStore();

  useEffect(() => {
    let interval: number | null = null;

    if (connected) {
      // Start timer
      interval = window.setInterval(() => {
        setElapsedSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          // Deduct credits every 10 seconds of conversation
          if (newSeconds > 0 && newSeconds % 10 === 0) {
            if ((user?.credits ?? 0) > 0) {
              updateCredits(-10);
            }
          }
          // Check for 10-minute goal completion
          if (newSeconds === 10 * 60) {
            // 10 minutes in seconds
            completeTaskByText('10 minutos');
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      // Reset timer if disconnected
      setElapsedSeconds(0);
    }

    // Cleanup function
    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
      
      // This part runs when the component unmounts or `connected` changes.
      // We check if it was previously connected and a session was running.
      if (elapsedSecondsRef.current > 0 && user) {
        // Update total conversation time
        addConversationTime(elapsedSecondsRef.current);
        
        // Unlock first session achievement
        unlockAchievement('first_session', user.email);
        
        // If it was a guided lesson, increment lesson count
        if (mode === 'guided') {
            incrementCompletedLessons();
        }
      }
    };
  }, [connected, updateCredits, user, addConversationTime, incrementCompletedLessons, unlockAchievement, mode, completeTaskByText]);

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