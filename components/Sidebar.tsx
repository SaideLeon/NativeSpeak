/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useSettings, useUI } from '@/lib/state';
import c from 'classnames';
import { AVAILABLE_VOICES } from '@/lib/constants';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import TodoList from './TodoList';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUI();
  const { voice, setVoice } =
    useSettings();
  const { connected } = useLiveAPIContext();

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
          <div className="sidebar-section">
            <fieldset disabled={connected}>
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
            <TodoList />
          </div>
        </div>
      </aside>
    </>
  );
}
