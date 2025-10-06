/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState } from 'react';
import ControlTray from './components/console/control-tray/ControlTray';
import ErrorScreen from './components/demo/ErrorScreen';
import StreamingConsole from './components/demo/streaming-console/StreamingConsole';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { useAuthStore } from './lib/authStore';
import LandingPage from './components/LandingPage';
import LegalModal from './components/LegalModal';
import TermsAcceptanceModal from './components/TermsAcceptanceModal';
import NotificationToast from './components/NotificationToast';
import AchievementTracker from './components/AchievementTracker';
import { useSettings, useUI } from './lib/state';
import LeftSidebar from './components/LeftSidebar';
import cn from 'classnames';
import { THEMES } from './lib/customization';
import { usePresenceStore } from './lib/presenceStore';
import LessonsPage from './components/LessonsPage';

const SYSTEM_API_KEY = process.env.API_KEY as string;
if (!SYSTEM_API_KEY) {
  throw new Error(
    'Missing required environment variable: GEMINI_API_KEY. Please set it in your .env file.'
  );
}

/**
 * Main application component that provides a streaming interface for Live API.
 * Manages video streaming state and provides controls for webcam/screen capture.
 */
function App() {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<
    'privacy' | 'terms' | null
  >(null);
  const { isLeftSidebarOpen, currentView } = useUI();
  const { geminiApiKey } = useSettings();
  const activeApiKey = geminiApiKey || SYSTEM_API_KEY;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const themeKey = user?.theme || 'default';
    const activeTheme = THEMES[themeKey] || THEMES['default'];

    const root = document.documentElement;
    Object.entries(activeTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [user?.theme]);

  // Handle user leaving the page to set them as offline
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (useAuthStore.getState().isAuthenticated) {
        usePresenceStore.getState().setSelfOffline();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  // To prevent flash of unauthenticated content
  if (isLoading) {
    return null; // or a loading spinner
  }

  const showTermsModal = isAuthenticated && user?.needsToAcceptTerms;

  return (
    <div className={cn('App', { 'left-sidebar-open': isLeftSidebarOpen })}>
      <LiveAPIProvider apiKey={activeApiKey}>
        <ErrorScreen />
        {isAuthenticated && <LeftSidebar />}
        <Sidebar />
        <div className="content-wrapper">
          <Header onLoginClick={() => setIsAuthModalOpen(true)} />
          <div className="streaming-console">
            <main>
              <div className="main-app-area">
                {isAuthenticated ? (
                  <>
                    {currentView === 'console' && <StreamingConsole />}
                    {currentView === 'lessons' && <LessonsPage />}
                  </>
                ) : (
                  <LandingPage
                    onStartClick={() => setIsAuthModalOpen(true)}
                    onLegalLinkClick={setActiveLegalDoc}
                  />
                )}
              </div>

              {isAuthenticated && !showTermsModal && currentView === 'console' && <ControlTray />}
            </main>
          </div>
        </div>
        {isAuthenticated && !showTermsModal && (
          <>
            <AchievementTracker />
            <NotificationToast />
          </>
        )}
        {isAuthModalOpen && (
          <AuthModal onClose={() => setIsAuthModalOpen(false)} />
        )}
        {activeLegalDoc && (
          <LegalModal
            docType={activeLegalDoc}
            onClose={() => setActiveLegalDoc(null)}
          />
        )}
        {showTermsModal && <TermsAcceptanceModal />}
      </LiveAPIProvider>
    </div>
  );
}

export default App;