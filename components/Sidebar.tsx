/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useSettings, useUI } from '@/lib/state';
import c from 'classnames';
import { DEFAULT_LIVE_API_MODEL, AVAILABLE_VOICES } from '@/lib/constants';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import TodoList from './TodoList';
import { useAuthStore } from '../lib/authStore';
import AchievementsPanel from './AchievementsPanel';

const AVAILABLE_MODELS = [
  DEFAULT_LIVE_API_MODEL
];

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


export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUI();
  const { model, voice, setModel, setVoice } =
    useSettings();
  const { connected } = useLiveAPIContext();
  const { user } = useAuthStore();

  return (
    <>
      <aside className={c('sidebar', { open: isSidebarOpen })}>
        <div className="sidebar-header">
          <h3>Configurações</h3>
          <button onClick={toggleSidebar} className="close-button">
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
          <div className="sidebar-section">
            <fieldset disabled={connected}>
              <label>
                Modelo
                <select value={model} onChange={e => setModel(e.target.value)}>
                  {/* This is an experimental model name that should not be removed from the options. */}
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Voz
                <select value={voice} onChange={e => setVoice(e.target.value)}>
                  {AVAILABLE_VOICES.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          </div>
          <div className="sidebar-section">
            <AchievementsPanel />
          </div>
          <div className="sidebar-section">
            <TodoList />
          </div>
        </div>
      </aside>
    </>
  );
}