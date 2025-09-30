/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect } from 'react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useAuthStore } from '../lib/authStore';

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
  const { updateCredits, user } = useAuthStore();

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
    };
  }, [connected, updateCredits, user]);

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