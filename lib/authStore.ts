/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { useLogStore, ConversationTurn } from './state';

// In a real app, this would be a more secure session management system.
// For this demo, we use localStorage.

interface User {
  email: string;
  firstName: string;
  lastName: string;
  studyStartDate: string;
  termsAccepted?: boolean;
  needsToAcceptTerms?: boolean; // Transient state property
  credits: number;
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
      const isSystemUnlocked =
        localStorage.getItem(SYSTEM_UNLOCKED_KEY) === 'true';
      if (!isSystemUnlocked) {
        throw new Error(
          'O sistema precisa ser ativado por um administrador para permitir novos registros.'
        );
      }

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      if (users[email]) {
        throw new Error('Já existe um usuário com este e-mail.');
      }
      const studyStartDate = new Date().toISOString();
      // In a real app, you would hash the password
      users[email] = {
        pass,
        firstName,
        lastName,
        studyStartDate,
        termsAccepted: true,
        credits: 3000,
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      const user: User = {
        email,
        firstName,
        lastName,
        studyStartDate,
        termsAccepted: true,
        credits: 3000,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      set({ isAuthenticated: true, user, isLoading: false });
      // Clear any potential old history for this email and start fresh
      useLogStore.getState().clearTurns();
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  login: async (email, pass) => {
    set({ error: null, isLoading: true });

    // Master Key check for activation
    if (pass === 'Claustriania') {
      try {
        localStorage.setItem(SUPER_ADMIN_KEY, 'true');
        localStorage.setItem(SYSTEM_UNLOCKED_KEY, 'true'); // Unlock the system
        const superAdminUser: User = {
          email: 'admin@nativespeak.app',
          firstName: 'Administrador',
          lastName: 'Supremo',
          studyStartDate: new Date().toISOString(),
          termsAccepted: true,
          credits: 999999, // Super admin has unlimited credits
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(superAdminUser));
        set({
          isAuthenticated: true,
          user: superAdminUser,
          isLoading: false,
          isSystemUnlocked: true,
        });
        const history = loadHistory(superAdminUser.email);
        useLogStore.getState().setTurns(history);
        return;
      } catch (e: any) {
        set({
          error: 'Falha ao iniciar sessão de super administrador.',
          isLoading: false,
        });
        throw e;
      }
    }

    const isSystemUnlocked =
      localStorage.getItem(SYSTEM_UNLOCKED_KEY) === 'true';
    if (!isSystemUnlocked) {
      const e = new Error('Chave Suprema inválida.');
      set({ error: e.message, isLoading: false });
      throw e;
    }

    // Normal user login
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      const dbUser = users[email];
      if (!dbUser || dbUser.pass !== pass) {
        throw new Error('E-mail ou senha inválidos.');
      }

      // Backwards compatibility for credits
      if (typeof dbUser.credits === 'undefined') {
        dbUser.credits = 3000;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      const needsToAcceptTerms = !dbUser.termsAccepted;

      const user: User = {
        email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        studyStartDate: dbUser.studyStartDate,
        termsAccepted: dbUser.termsAccepted,
        credits: dbUser.credits,
        ...(needsToAcceptTerms && { needsToAcceptTerms: true }),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      // Ensure super admin key is removed on normal login
      localStorage.removeItem(SUPER_ADMIN_KEY);
      set({ isAuthenticated: true, user, isLoading: false });
      const history = loadHistory(user.email);
      useLogStore.getState().setTurns(history);
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SUPER_ADMIN_KEY); // Clear super admin key on logout
    (useLogStore.getState() as any).resetTurnsForSession();
    set({ isAuthenticated: false, user: null });
  },

  acceptTerms: async () => {
    const { user } = get();
    if (!user) return;
    set({ error: null });

    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      if (users[user.email]) {
        users[user.email].termsAccepted = true;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const updatedUser = {
          ...user,
          needsToAcceptTerms: false,
          termsAccepted: true,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
        set({ user: updatedUser });
      } else {
        throw new Error('Usuário não encontrado para atualizar os termos.');
      }
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  checkAuth: () => {
    try {
      const isUnlocked = localStorage.getItem(SYSTEM_UNLOCKED_KEY) === 'true';
      set({ isSystemUnlocked: isUnlocked });

      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const user: User = JSON.parse(session);
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        const dbUser = users[user.email];

        // Check against the source of truth (USERS_KEY) for super admin
        if (user.email === 'admin@nativespeak.app') {
            set({ isAuthenticated: true, user, isLoading: false });
            const history = loadHistory(user.email);
            useLogStore.getState().setTurns(history);
            return;
        }
        
        if (dbUser) {
          user.needsToAcceptTerms = !dbUser.termsAccepted;
          user.termsAccepted = dbUser.termsAccepted;
          
          if (!dbUser.studyStartDate) {
              dbUser.studyStartDate = new Date().toISOString();
          }
          user.studyStartDate = dbUser.studyStartDate;
          
          if (typeof dbUser.credits === 'undefined') {
              dbUser.credits = 3000;
          }
          user.credits = dbUser.credits;
          
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
          localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        }

        set({ isAuthenticated: true, user, isLoading: false });
        const history = loadHistory(user.email);
        useLogStore.getState().setTurns(history);
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
      // Super admin is not affected by credit changes
      if (state.user.email === 'admin@nativespeak.app') {
          return state;
      }
      
      const newCredits = Math.max(0, state.user.credits + amount);
      const updatedUser = { ...state.user, credits: newCredits };
      
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
}));