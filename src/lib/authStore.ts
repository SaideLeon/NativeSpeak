/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { useLogStore, ConversationTurn } from './state';
import { useAchievementStore } from './achievementStore';
import { useNotificationStore } from './notificationStore';
import { useLearningStore } from './learningStore';
import { useEvaluationStore } from './evaluationStore';
import { usePresenceStore } from './presenceStore';
import axios from 'axios';

// In a real app, this would be a more secure session management system.
// For this demo, we use localStorage.

const api = axios.create({
  baseURL: '/api',
});

interface User {
  id?: number;
  token?: { access: string; refresh: string };
  email: string;
  firstName: string;
  lastName: string;
  studyStartDate: string;
  termsAccepted?: boolean;
  needsToAcceptTerms?: boolean; // Transient state property
  credits: number;
  totalConversationTime: number; // in seconds
  completedLessons: number;
  avatar?: string;
  theme?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;
  isSystemUnlocked: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (
    email: string,
    pass: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  acceptTerms: () => Promise<void>;
  updateCredits: (amount: number) => void;
  addConversationTime: (seconds: number) => void;
  incrementCompletedLessons: () => void;
  updateProfile: (updates: Partial<Pick<User, 'avatar' | 'theme'>>) => void;
}

// NOTE: This is an insecure way to store user data, for demo purposes only.
const USERS_KEY = 'native_speak_users';
const SESSION_KEY = 'native_speak_session';
const SUPER_ADMIN_KEY = 'isSuperAdmin';
const SYSTEM_UNLOCKED_KEY = 'native_speak_unlocked';

const loadHistory = (email: string): ConversationTurn[] => {
  const historyKey = `nativespeak_history_${email}`;
  const savedHistory = localStorage.getItem(historyKey);
  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory) as ConversationTurn[];
      // Re-hydrate Date objects from ISO strings
      return parsed.map(turn => ({
        ...turn,
        timestamp: new Date(turn.timestamp),
      }));
    } catch (e) {
      console.error('Failed to parse conversation history:', e);
      // If parsing fails, clear the corrupted data
      localStorage.removeItem(historyKey);
      return [];
    }
  }
  return [];
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: true,
  isSystemUnlocked: false,

  register: async (email, pass, firstName, lastName) => {
    set({ error: null, isLoading: true });
    try {
      await api.post('/register/', {
        first_name: firstName,
        last_name: lastName,
        email,
        password: pass,
        password2: pass,
        terms: true,
      });
      // After successful registration, log the user in
      await get().login(email, pass);
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.email?.[0] ||
        'Ocorreu um erro durante o registro.';
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  login: async (email, pass) => {
    set({ error: null, isLoading: true });
    try {
      const response = await api.post('/login/', { email, password: pass });
      const token = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token.access}`;

      const meResponse = await api.get('/me/');
      const serverUser = meResponse.data;

      // Check for local data and merge
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      let localUser = users[email];
      if (!localUser) {
        // First time login for this user on this device, create local data
        localUser = {
          studyStartDate: new Date().toISOString(),
          credits: 3000,
          totalConversationTime: 0,
          completedLessons: 0,
          avatar: 'person',
          theme: 'default',
        };
        users[email] = localUser;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      const user: User = {
        id: serverUser.id,
        email: serverUser.email,
        firstName: serverUser.first_name,
        lastName: serverUser.last_name,
        token,
        studyStartDate: localUser.studyStartDate,
        termsAccepted: true, // Assuming terms are accepted on register
        credits: localUser.credits,
        totalConversationTime: localUser.totalConversationTime,
        completedLessons: localUser.completedLessons,
        avatar: localUser.avatar,
        theme: localUser.theme,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      set({ isAuthenticated: true, user, isLoading: false, error: null });

      // Load other stores
      const history = loadHistory(user.email);
      useLogStore.getState().setTurns(history);
      useAchievementStore.getState().loadAchievements(user.email);
      useLearningStore.getState().loadProgress();
      useEvaluationStore.getState().loadEvaluation();
      usePresenceStore.getState().setSelfOnline();
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.detail || 'E-mail ou senha inválidos.';
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  logout: () => {
    usePresenceStore.getState().setSelfOffline();
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SUPER_ADMIN_KEY); // Clear super admin key on logout
    delete api.defaults.headers.common['Authorization'];
    (useLogStore.getState() as any).resetTurnsForSession();
    useAchievementStore.getState().clearAchievements();
    useLearningStore.getState().clearProgress();
    useEvaluationStore.getState().clearEvaluation();
    set({ isAuthenticated: false, user: null });
  },

  acceptTerms: async () => {
    const { user } = get();
    if (!user) return;
    set({ error: null });

    try {
      // This is now handled on the backend, but we reflect it in the frontend state
      const updatedUser = {
        ...user,
        needsToAcceptTerms: false,
        termsAccepted: true,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  checkAuth: () => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const user: User = JSON.parse(session);
        if (user.token?.access) {
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${user.token.access}`;
          set({ isAuthenticated: true, user, isLoading: false });

          // Load other stores
          const history = loadHistory(user.email);
          useLogStore.getState().setTurns(history);
          useAchievementStore.getState().loadAchievements(user.email);
          useLearningStore.getState().loadProgress();
          useEvaluationStore.getState().loadEvaluation();
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },

  updateCredits: (amount: number) => {
    set((state) => {
      if (!state.isAuthenticated || !state.user) {
        return state;
      }
      
      const oldCredits = state.user.credits;
      const newCredits = Math.max(0, oldCredits + amount);
      const updatedUser = { ...state.user, credits: newCredits };

      const LOW_CREDIT_THRESHOLD = 500;
      if (newCredits < LOW_CREDIT_THRESHOLD && oldCredits >= LOW_CREDIT_THRESHOLD) {
        useNotificationStore.getState().addNotification({
          title: 'Créditos Baixos',
          message: 'Seus créditos de conversação estão acabando. Recarregue em breve!',
          type: 'info',
          icon: 'account_balance_wallet',
        });
      }
      
      // Update localStorage
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        if (users[updatedUser.email]) {
          users[updatedUser.email].credits = newCredits;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to update credits in localStorage", error);
      }

      return { user: updatedUser };
    });
  },
  
  addConversationTime: (seconds: number) => {
    set((state) => {
      if (!state.user) return state;
      const newTotalTime = (state.user.totalConversationTime || 0) + seconds;
      const updatedUser = { ...state.user, totalConversationTime: newTotalTime };
      
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        if (users[updatedUser.email]) {
          users[updatedUser.email].totalConversationTime = newTotalTime;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to update conversation time in localStorage", error);
      }

      return { user: updatedUser };
    });
  },

  incrementCompletedLessons: () => {
    set((state) => {
      if (!state.user) return state;
      const newCount = (state.user.completedLessons || 0) + 1;
      const updatedUser = { ...state.user, completedLessons: newCount };
      
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        if (users[updatedUser.email]) {
          users[updatedUser.email].completedLessons = newCount;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to update completed lessons in localStorage", error);
      }

      return { user: updatedUser };
    });
  },

  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };

      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        if (users[updatedUser.email]) {
          users[updatedUser.email] = { ...users[updatedUser.email], ...updates };
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to update profile in localStorage", error);
      }
      return { user: updatedUser };
    });
  },
}));
