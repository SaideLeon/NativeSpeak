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

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUI();
  const {
    model,
    voice,
    useWebSearch,
    geminiApiKey,
    setModel,
    setVoice,
    setUseWebSearch,
    setGeminiApiKey,
  } = useSettings();
  const { connected } = useLiveAPIContext();
  const { user } = useAuthStore();

  return (
    <>
      <aside className={c('sidebar', { open: isSidebarOpen })}>
        <div className="sidebar-header">
          <h3>Configurações</h3>
          <button
            onClick={toggleSidebar}
            className="close-button"
            title="Fechar Configurações"
          >
            <span className="icon">close</span>
          </button>
        </div>
        <div className="sidebar-content">
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
              <label>
                <span className="label-line">
                  Sua Chave de API Gemini
                  {geminiApiKey ? (
                    <span className="api-key-badge active" title="Usando sua chave de API pessoal">Ativa</span>
                  ) : (
                    <span className="api-key-badge" title="Usando a chave de API do sistema">Padrão</span>
                  )}
                </span>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  placeholder="Deixe em branco para usar o padrão"
                />
                <p className="setting-description">
                  Sua chave é salva localmente e usada para todas as chamadas da API Gemini.
                </p>
              </label>
              <div className="tool-item">
                <label className="tool-checkbox-wrapper">
                  <input
                    id="web-search-toggle"
                    type="checkbox"
                    checked={useWebSearch}
                    onChange={e => setUseWebSearch(e.target.checked)}
                  />
                  <span className="checkbox-visual"></span>
                </label>
                <label
                  htmlFor="web-search-toggle"
                  className="tool-name-text"
                  style={{ cursor: 'pointer' }}
                >
                  Ativar Pesquisa na Web
                </label>
              </div>
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