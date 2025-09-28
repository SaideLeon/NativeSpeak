/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';
import { useState } from 'react';
import { useAuthStore } from '../lib/authStore';
import AuthModal from './AuthModal';

export default function Header() {
  const { toggleSidebar } = useUI();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <>
      <header>
        <div className="header-left">
          <h1>NativeSpeak</h1>
          <div className="subtitle">
            <p>Your AI partner for mastering English conversation.</p>
            <p>Practice speaking, get instant feedback, and improve fluency.</p>
          </div>
        </div>
        <div className="header-right">
          {isAuthenticated ? (
            <div className="header-user-info">
              <span className="user-email">{user?.email}</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          ) : (
            <button className="login-button" onClick={() => setIsAuthModalOpen(true)}>
              Login / Register
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
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
}