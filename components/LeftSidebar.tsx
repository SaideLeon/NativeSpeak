/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';
import c from 'classnames';
import { useAuthStore } from '../lib/authStore';

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
  const { isLeftSidebarOpen, toggleLeftSidebar } = useUI();
  const { user } = useAuthStore();

  return (
    <>
      <aside className={c('left-sidebar', { open: isLeftSidebarOpen })}>
        <div className="sidebar-header">
          <h3>Painel</h3>
          <button onClick={toggleLeftSidebar} className="close-button">
            <span className="icon">close</span>
          </button>
        </div>
        <div className="sidebar-content">
          {user && (
            <div className="sidebar-section user-panel">
              <h4 className="sidebar-section-title">Painel do Aluno</h4>
              <div className="user-info">
                <span className="user-name">
                  {user.firstName} {user.lastName}
                </span>
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
          {/* Future sections for the left sidebar can be added here */}
        </div>
      </aside>
    </>
  );
}
