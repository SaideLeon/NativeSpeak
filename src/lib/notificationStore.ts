/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';

export interface Notification {
  id: number;
  message: string;
  type: 'goal' | 'achievement' | 'info';
  title?: string;
  icon?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now() }],
    }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
