/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect } from 'react';
import { usePresenceStore } from '../lib/presenceStore';
import { useAuthStore } from '../lib/authStore';

const OnlineUsersPanel: React.FC = () => {
  const { onlineUsers, updateOnlineUsers, setSelfOnline } = usePresenceStore();
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const updatePresence = () => {
      setSelfOnline();
      updateOnlineUsers();
    };

    updatePresence(); // Initial call
    const intervalId = setInterval(updatePresence, 10000); // Heartbeat and poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [setSelfOnline, updateOnlineUsers]);

  const otherUsers = onlineUsers.filter(
    (user) => user.email !== currentUser?.email
  );

  return (
    <div className="online-users-panel">
      <h4 className="sidebar-section-title">Usuários Online ({otherUsers.length + 1})</h4>
      <div className="online-users-list">
        {currentUser && (
           <div className="online-user-item">
           <div className="online-user-avatar-container">
             <div className="online-user-avatar">
               <span className="icon">{currentUser.avatar}</span>
             </div>
             <div className="online-indicator"></div>
           </div>
           <span className="online-user-name">{currentUser.firstName} (Você)</span>
         </div>
        )}
        {otherUsers.map(user => (
          <div key={user.email} className="online-user-item">
            <div className="online-user-avatar-container">
              <div className="online-user-avatar">
                <span className="icon">{user.avatar}</span>
              </div>
              <div className="online-indicator"></div>
            </div>
            <span className="online-user-name">{user.firstName}</span>
          </div>
        ))}
        {onlineUsers.length === 0 && (
             <p className="no-users-text">Ninguém online no momento.</p>
        )}
      </div>
    </div>
  );
};

export default OnlineUsersPanel;
