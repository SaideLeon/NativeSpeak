/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';
import { useAuthStore } from '../lib/authStore';

interface HeaderProps {
  onLoginClick: () => void;
}


export default function Header({ onLoginClick }: HeaderProps) {
  const { toggleSidebar } = useUI();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <>
      <header>
        <div className="header-left">
          <h1>NativeSpeak</h1>
        </div>
        <div className="header-right">
          {isAuthenticated && user ? (
            <div className="header-user-info">
              <span className="user-welcome">Olá, {user.firstName}!</span>
              <button onClick={logout} className="logout-button" title="Logout">
                <span className="logout-text">Logout</span>
                <span className="icon logout-icon">logout</span>
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              <span className="login-text-full">Login / Register</span>
              <span className="login-text-short">Login</span>
            </button>
          )}
          <button
            className="settings-button"
            onClick={toggleSidebar}
            aria-label="Settings"
          >
            <span className="icon">tune</span>
          </button>
        </div>
      </header>
    </>
  );
}