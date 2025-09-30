/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect } from 'react';
import { useAchievementStore } from '../lib/achievementStore';
import cn from 'classnames';

const AchievementToast: React.FC = () => {
  const { lastUnlocked, clearLastUnlocked } = useAchievementStore();

  useEffect(() => {
    if (lastUnlocked) {
      const timer = setTimeout(() => {
        clearLastUnlocked();
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [lastUnlocked, clearLastUnlocked]);

  if (!lastUnlocked) {
    return null;
  }

  return (
    <div className={cn('achievement-toast', { visible: !!lastUnlocked })}>
      <span className="achievement-toast-icon icon">{lastUnlocked.icon}</span>
      <div className="achievement-toast-content">
        <span className="achievement-toast-title">Conquista Desbloqueada!</span>
        <span className="achievement-toast-name">{lastUnlocked.name}</span>
      </div>
    </div>
  );
};

export default AchievementToast;
