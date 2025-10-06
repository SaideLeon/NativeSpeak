/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';
import { useAuthStore } from '../lib/authStore';
import SessionTimer from './SessionTimer';

interface HeaderProps {
  onLoginClick: () => void;
}


export default function Header({ onLoginClick }: HeaderProps) {
  const { toggleSidebar, toggleLeftSidebar } = useUI();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <>
      <header>
        <div className="header-left">
          {isAuthenticated && (
            <button
              className="menu-button"
              onClick={toggleLeftSidebar}
              aria-label="Painel do Aluno"
              title="Painel do Aluno"
            >
              <span className="icon">menu</span>
            </button>
          )}
          <h1>NativeSpeak</h1>
          <SessionTimer />
        </div>
        <div className="header-right">
          {isAuthenticated && user ? (
            <div className="header-user-info">
              <span className="user-welcome">Olá, {user.firstName}!</span>
              <button onClick={logout} className="logout-button" title="Sair">
                <span className="logout-text">Sair</span>
                <span className="icon logout-icon">logout</span>
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              <span className="login-text-full">Entrar / Registrar</span>
              <span className="login-text-short">Entrar</span>
            </button>
          )}
          {isAuthenticated && (
            <button
              className="settings-button"
              onClick={toggleSidebar}
              aria-label="Configurações"
              title="Configurações"
            >
              <span className="icon">tune</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
}