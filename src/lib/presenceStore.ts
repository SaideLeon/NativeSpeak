/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { useAuthStore } from './authStore';

export interface OnlineUser {
  email: string;
  firstName: string;
  avatar: string;
}

interface StoredUser extends OnlineUser {
  lastSeen: number;
}

interface PresenceState {
  onlineUsers: OnlineUser[];
  setSelfOnline: () => void;
  setSelfOffline: () => void;
  updateOnlineUsers: () => void;
}

const ONLINE_USERS_KEY = 'nativespeak_online_users';
const STALE_THRESHOLD = 30 * 1000; // 30 seconds

const getStoredUsers = (): StoredUser[] => {
  try {
    const stored = localStorage.getItem(ONLINE_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get stored users:', error);
    return [];
  }
};

const setStoredUsers = (users: StoredUser[]) => {
  try {
    localStorage.setItem(ONLINE_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to set stored users:', error);
  }
};

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUsers: [],
  setSelfOnline: () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const storedUsers = getStoredUsers();
    const now = Date.now();

    const self: StoredUser = {
      email: currentUser.email,
      firstName: currentUser.firstName,
      avatar: currentUser.avatar || 'person',
      lastSeen: now,
    };

    const otherUsers = storedUsers.filter(u => u.email !== currentUser.email);
    const newStoredUsers = [...otherUsers, self];
    setStoredUsers(newStoredUsers);
  },

  setSelfOffline: () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const storedUsers = getStoredUsers();
    const newStoredUsers = storedUsers.filter(u => u.email !== currentUser.email);
    setStoredUsers(newStoredUsers);
    get().updateOnlineUsers(); // Update UI immediately for self
  },

  updateOnlineUsers: () => {
    const storedUsers = getStoredUsers();
    const now = Date.now();
    
    const freshUsers = storedUsers.filter(
      u => now - u.lastSeen < STALE_THRESHOLD,
    );
    
    // If the list changed due to cleanup, update localStorage
    if (freshUsers.length !== storedUsers.length) {
      setStoredUsers(freshUsers);
    }

    set({ onlineUsers: freshUsers });
  },
}));