/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '../lib/state';
import c from 'classnames';
import { useAuthStore } from '../lib/authStore';
import { useLearningStore, LessonTopic } from '../lib/learningStore';
import { lessons } from '../lib/lessons';
import { useState } from 'react';
import ProfileCustomizer from './ProfileCustomizer';
import ConversationEvaluator from './ConversationEvaluator';
import OnlineUsersPanel from './OnlineUsersPanel';

const formatTotalTime = (totalSeconds: number) => {
  if (!totalSeconds) return '0m';
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let result = '';
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m`;
  }
  return result.trim();
};

export default function LeftSidebar() {
  const { isLeftSidebarOpen, toggleLeftSidebar, currentView, setView } = useUI();
  const { user } = useAuthStore();
  const { progress } = useLearningStore();
  const [isCustomizing, setIsCustomizing] = useState(false);

  const hasProgress = Object.keys(progress).length > 0;

  return (
    <>
      <aside className={c('left-sidebar', { open: isLeftSidebarOpen })}>
        <div className="sidebar-header">
          <h3>Painel</h3>
          <button
            onClick={toggleLeftSidebar}
            className="close-button"
            title="Fechar Painel"
          >
            <span className="icon">close</span>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <nav className="main-nav">
              <button
                className={c({ active: currentView === 'console' })}
                onClick={() => setView('console')}
              >
                <span className="icon">mic</span> Prática de Conversa
              </button>
              <button
                className={c({ active: currentView === 'lessons' })}
                onClick={() => setView('lessons')}
              >
                <span className="icon">school</span> Aulas e Exercícios
              </button>
            </nav>
          </div>
          {user && (
            <div className="sidebar-section user-panel">
              <div className="user-info">
                <div className="user-header">
                  <button
                    className="avatar-button"
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    title="Personalizar Perfil"
                  >
                    <span className="icon user-avatar">
                      {user.avatar || 'person'}
                    </span>
                    <span className="icon edit-icon">edit</span>
                  </button>
                  <span className="user-name">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                {isCustomizing && <ProfileCustomizer />}

                <div className="credits-display">
                  <span className="icon">toll</span>
                  <span className="credits-value">
                    {user.credits.toLocaleString('pt-BR')}
                  </span>
                  <span className="credits-label">Créditos</span>
                </div>
                <div className="user-stats">
                  <div className="stat-item">
                    <span className="icon">history</span>
                    <span className="stat-value">
                      {formatTotalTime(user.totalConversationTime)}
                    </span>
                    <span className="stat-label">Tempo Total</span>
                  </div>
                  <div className="stat-item">
                    <span className="icon">school</span>
                    <span className="stat-value">{user.completedLessons}</span>
                    <span className="stat-label">Aulas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="sidebar-section">
            <OnlineUsersPanel />
          </div>

          <div className="sidebar-section">
            <ConversationEvaluator />
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Progresso da Aula</h4>
            {!hasProgress ? (
              <p className="no-progress-text">
                Comece uma aula guiada para ver seu progresso aqui.
              </p>
            ) : (
              <div className="lessons-progress-list">
                {Object.entries(lessons).map(([topic, details]) => {
                  const lessonProgress = progress[topic as LessonTopic];
                  if (!lessonProgress) return null; // Only show lessons that have been started
                  return (
                    <div key={topic} className="lesson-progress-item">
                      <span className="lesson-progress-title">
                        {details.title}
                      </span>
                      <span className="lesson-progress-step">
                        Passo {lessonProgress.currentStep}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}