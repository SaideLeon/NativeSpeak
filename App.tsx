/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may
 * obtain a copy of the License at
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

const API_KEY = process.env.GEMINI_API_KEY as string;
if (typeof API_KEY !== 'string') {
  throw new Error(
    'Missing required environment variable: REACT_APP_GEMINI_API_KEY'
  );
}

/**
 * Main application component that provides a streaming interface for Live API.
 * Manages video streaming state and provides controls for webcam/screen capture.
 */
function App() {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<
    'privacy' | 'terms' | null
  >(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // To prevent flash of unauthenticated content
  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <div className="App">
      <LiveAPIProvider apiKey={API_KEY}>
        <ErrorScreen />
        <Header onLoginClick={() => setIsAuthModalOpen(true)} />
        <Sidebar />
        <div className="streaming-console">
          <main>
            <div className="main-app-area">
              {isAuthenticated ? (
                <StreamingConsole />
              ) : (
                <LandingPage
                  onStartClick={() => setIsAuthModalOpen(true)}
                  onLegalLinkClick={setActiveLegalDoc}
                />
              )}
            </div>

            {isAuthenticated && <ControlTray></ControlTray>}
          </main>
        </div>
        {isAuthModalOpen && (
          <AuthModal onClose={() => setIsAuthModalOpen(false)} />
        )}
        {activeLegalDoc && (
          <LegalModal
            docType={activeLegalDoc}
            onClose={() => setActiveLegalDoc(null)}
          />
        )}
      </LiveAPIProvider>
    </div>
  );
}

export default App;
