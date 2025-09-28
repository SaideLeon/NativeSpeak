/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';

// In a real app, this would be a more secure session management system.
// For this demo, we use localStorage.

interface User {
  email: string;
  firstName: string;
  lastName: string;
  studyStartDate: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

// NOTE: This is an insecure way to store user data, for demo purposes only.
const USERS_KEY = 'native_speak_users';
const SESSION_KEY = 'native_speak_session';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: true,

  register: async (email, pass, firstName, lastName) => {
    set({ error: null, isLoading: true });
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      if (users[email]) {
        throw new Error('Já existe um usuário com este e-mail.');
      }
      const studyStartDate = new Date().toISOString();
      // In a real app, you would hash the password
      users[email] = { pass, firstName, lastName, studyStartDate }; 
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const user = { email, firstName, lastName, studyStartDate };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  login: async (email, pass) => {
    set({ error: null, isLoading: true });
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      if (!users[email] || users[email].pass !== pass) {
        throw new Error('E-mail ou senha inválidos.');
      }
      
      const user = { 
        email, 
        firstName: users[email].firstName, 
        lastName: users[email].lastName,
        studyStartDate: users[email].studyStartDate,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: () => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const user = JSON.parse(session);

        // Backwards compatibility for users without a start date
        if (!user.studyStartDate) {
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
          if (users[user.email]?.studyStartDate) {
            user.studyStartDate = users[user.email].studyStartDate;
          } else {
            user.studyStartDate = new Date().toISOString();
          }
          localStorage.setItem(SESSION_KEY, JSON.stringify(user)); // Resave session
        }

        set({ isAuthenticated: true, user, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));