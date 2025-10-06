/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useAchievementStore } from '../lib/achievementStore';
import { ALL_ACHIEVEMENTS } from '../lib/achievements';
import cn from 'classnames';
import './AchievementsPanel.css';

const AchievementsPanel: React.FC = () => {
  const { unlockedIds } = useAchievementStore();

  return (
    <div className="achievements-container">
      <h4 className="sidebar-section-title">Conquistas</h4>
      <div className="achievements-list">
        {ALL_ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlockedIds.has(ach.id);
          return (
            <div
              key={ach.id}
              className={cn('achievement-item', { unlocked: isUnlocked })}
              title={ach.name}
            >
              <span className="achievement-icon icon">{ach.icon}</span>
              <div className="achievement-tooltip">
                <div className="tooltip-name">{ach.name}</div>
                <div className="tooltip-description">{ach.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPanel;
