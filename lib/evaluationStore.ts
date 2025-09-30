/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { ConversationTurn, useSettings } from './state';
import { useAuthStore } from './authStore';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

const SYSTEM_API_KEY = process.env.API_KEY as string;

interface Evaluation {
  rating: 'Péssima' | 'Média' | 'Alta';
  feedback: string;
}

interface SessionData {
  evaluation: Evaluation | null;
  history: ConversationTurn[] | null;
}

interface EvaluationState {
  isLoading: boolean;
  lastEvaluation: Evaluation | null;
  lastConversationHistory: ConversationTurn[] | null;
  evaluateConversation: (turns: ConversationTurn[]) => Promise<void>;
  loadEvaluation: () => void;
  clearEvaluation: () => void;
  clearLastHistory: () => void;
  setLastConversationHistory: (turns: ConversationTurn[]) => void;
}

const EVALUATION_KEY_PREFIX = 'nativespeak_evaluation_';

const saveSessionData = (sessionData: SessionData) => {
  const user = useAuthStore.getState().user;
  if (user?.email) {
    try {
      localStorage.setItem(
        `${EVALUATION_KEY_PREFIX}${user.email}`,
        JSON.stringify(sessionData),
      );
    } catch (e) {
      console.error('Failed to save session data', e);
    }
  }
};

export const useEvaluationStore = create<EvaluationState>((set, get) => ({
  isLoading: false,
  lastEvaluation: null,
  lastConversationHistory: null,
  setLastConversationHistory: (turns: ConversationTurn[]) => {
    if (turns.length > 1) {
      set({ lastConversationHistory: turns });
      saveSessionData({
        evaluation: get().lastEvaluation,
        history: turns,
      });
    }
  },
  clearLastHistory: () => {
    set({ lastConversationHistory: null });
    saveSessionData({ evaluation: get().lastEvaluation, history: null });
  },
  evaluateConversation: async (turns: ConversationTurn[]) => {
    if (!turns.length) return;
    set({ isLoading: true });

    const transcript = turns
      .map(turn => `${turn.role === 'user' ? 'Aluno' : 'Tutor'}: ${turn.text}`)
      .join('\n');

    const prompt = `
      Você é um professor de inglês avaliando a transcrição de uma conversa entre um tutor de IA e um aluno falante de português.
      Sua tarefa é avaliar o desempenho do ALUNO.

      Transcrição da Conversa:
      ---
      ${transcript}
      ---

      Com base APENAS nas falas do "Aluno", por favor:
      1.  Avalie o nível geral de comunicação do aluno em uma de três categorias: 'Péssima', 'Média', ou 'Alta'.
      2.  Forneça um feedback construtivo e conciso em português. O feedback deve:
          - Ser encorajador.
          - Apontar 1-2 erros específicos de gramática, vocabulário ou pronúncia (inferida).
          - Mostrar a forma correta e explicar brevemente o porquê.
          - Sugerir como o aluno pode melhorar.
          - Usar markdown simples para negrito (**texto**).

      Responda estritamente no seguinte formato JSON:
    `;

    try {
      const userApiKey = useSettings.getState().geminiApiKey;
      const activeApiKey = userApiKey || SYSTEM_API_KEY;
      const ai = new GoogleGenAI({ apiKey: activeApiKey });

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rating: {
                type: Type.STRING,
                enum: ['Péssima', 'Média', 'Alta'],
              },
              feedback: {
                type: Type.STRING,
              },
            },
          },
        },
      });

      const jsonString = response.text;
      const result = JSON.parse(jsonString) as Evaluation;

      set({
        lastEvaluation: result,
        lastConversationHistory: turns, // Save the history that was just evaluated
        isLoading: false,
      });
      saveSessionData({ evaluation: result, history: turns });
    } catch (error) {
      console.error('Error evaluating conversation:', error);
      set({ isLoading: false });
    }
  },

  loadEvaluation: () => {
    const user = useAuthStore.getState().user;
    if (user?.email) {
      try {
        const saved = localStorage.getItem(
          `${EVALUATION_KEY_PREFIX}${user.email}`,
        );
        if (saved) {
          const { evaluation, history } = JSON.parse(saved);
          // Re-hydrate Date objects from ISO strings
          const hydratedHistory = history
            ? history.map((turn: ConversationTurn) => ({
                ...turn,
                timestamp: new Date(turn.timestamp),
              }))
            : null;
          set({
            lastEvaluation: evaluation,
            lastConversationHistory: hydratedHistory,
          });
        } else {
          set({ lastEvaluation: null, lastConversationHistory: null });
        }
      } catch (e) {
        console.error('Failed to load evaluation', e);
        set({ lastEvaluation: null, lastConversationHistory: null });
      }
    }
  },

  clearEvaluation: () => {
    set({
      lastEvaluation: null,
      lastConversationHistory: null,
      isLoading: false,
    });
  },
}));