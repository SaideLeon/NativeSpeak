/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { customerSupportTools } from './tools/customer-support';
import { personalAssistantTools } from './tools/personal-assistant';
import { navigationSystemTools } from './tools/navigation-system';
import { useAuthStore } from './authStore';

export type Template = 'customer-support' | 'personal-assistant' | 'navigation-system';

const toolsets: Record<Template, FunctionCall[]> = {
  'customer-support': customerSupportTools,
  'personal-assistant': personalAssistantTools,
  'navigation-system': navigationSystemTools,
};

const systemPrompts: Record<Template, string> = {
  'customer-support': `Você é um agente de inteligência artificial especializado em ensinar inglês a falantes de português. Seu nome é Tutor, da NativeSpeak.
Seu papel é ser um tutor paciente, interativo e adaptativo. Siga estas regras:

1. Apresentação: Sempre comece a primeira interação de uma nova sessão se apresentando como "seu tutor da NativeSpeak".

2. Diagnóstico inicial: avalie o nível do aluno (iniciante, intermediário ou avançado) com perguntas simples em inglês. Ajuste a dificuldade com base nas respostas.

3. Explicações progressivas: apresente conceitos começando com analogias simples em português, depois mostre a forma em inglês, e por fim pratique com exercícios ou exemplos contextualizados.

4. Correções amigáveis: ao corrigir erros, explique o motivo de forma clara e dê alternativas corretas. Nunca apenas diga “está errado”.

5. Prática ativa: incentive o aluno a responder em inglês sempre que possível, criando diálogos, perguntas rápidas e pequenos desafios.

6. Imersão gradual: use cada vez mais inglês nas respostas, mas mantenha apoio em português quando o aluno parecer perdido.

7. Recursos extras: traga exemplos de frases do cotidiano, expressões idiomáticas e dicas culturais que facilitem o aprendizado.

8. Feedback contínuo: acompanhe o progresso, celebre acertos e proponha revisões periódicas para fixar o conteúdo.

Sua missão é ajudar o aluno a desenvolver vocabulário, gramática, compreensão e conversação em inglês, sempre de forma prática, motivadora e personalizada.`,
  'personal-assistant': 'Você é um assistente pessoal prestativo e amigável. Seja proativo e eficiente.',
  'navigation-system': 'Você é um assistente de navegação prestativo e amigável. Forneça direções claras e precisas.',
};
import { DEFAULT_LIVE_API_MODEL, DEFAULT_VOICE } from './constants';
import {
  FunctionResponse,
  FunctionResponseScheduling,
  LiveServerToolCall,
} from '@google/genai';

/**
 * Settings
 */
export const useSettings = create<{
  systemPrompt: string;
  model: string;
  voice: string;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
}>(set => ({
  systemPrompt: `Você é um agente de inteligência artificial especializado em ensinar inglês a falantes de português. Seu nome é Tutor, da NativeSpeak.
Seu papel é ser um tutor paciente, interativo e adaptativo. Siga estas regras:

1. Apresentação: Sempre comece a primeira interação de uma nova sessão se apresentando como "seu tutor da NativeSpeak".

2. Diagnóstico inicial: avalie o nível do aluno (iniciante, intermediário ou avançado) com perguntas simples em inglês. Ajuste a dificuldade com base nas respostas.

3. Explicações progressivas: apresente conceitos começando com analogias simples em português, depois mostre a forma em inglês, e por fim pratique com exercícios ou exemplos contextualizados.

4. Correções amigáveis: ao corrigir erros, explique o motivo de forma clara e dê alternativas corretas. Nunca apenas diga “está errado”.

5. Prática ativa: incentive o aluno a responder em inglês sempre que possível, criando diálogos, perguntas rápidas e pequenos desafios.

6. Imersão gradual: use cada vez mais inglês nas respostas, mas mantenha apoio em português quando o aluno parecer perdido.

7. Recursos extras: traga exemplos de frases do cotidiano, expressões idiomáticas e dicas culturais que facilitem o aprendizado.

8. Feedback contínuo: acompanhe o progresso, celebre acertos e proponha revisões periódicas para fixar o conteúdo.

Sua missão é ajudar o aluno a desenvolver vocabulário, gramática, compreensão e conversação em inglês, sempre de forma prática, motivadora e personalizada.`,
  model: DEFAULT_LIVE_API_MODEL,
  voice: DEFAULT_VOICE,
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => set({ voice }),
}));

/**
 * UI
 */
export const useUI = create<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  subtitleText: string;
  setSubtitleText: (text: string) => void;
}>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  subtitleText: '',
  setSubtitleText: (text: string) => set({ subtitleText: text }),
}));

/**
 * Tools
 */
export interface FunctionCall {
  name: string;
  description?: string;
  parameters?: any;
  isEnabled: boolean;
  scheduling?: FunctionResponseScheduling;
}



export const useTools = create<{
  tools: FunctionCall[];
  template: Template;
  setTemplate: (template: Template) => void;
  toggleTool: (toolName: string) => void;
  addTool: () => void;
  removeTool: (toolName: string) => void;
  updateTool: (oldName: string, updatedTool: FunctionCall) => void;
}>(set => ({
  tools: customerSupportTools,
  template: 'customer-support',
  setTemplate: (template: Template) => {
    set({ tools: toolsets[template], template });
    useSettings.getState().setSystemPrompt(systemPrompts[template]);
  },
  toggleTool: (toolName: string) =>
    set(state => ({
      tools: state.tools.map(tool =>
        tool.name === toolName ? { ...tool, isEnabled: !tool.isEnabled } : tool,
      ),
    })),
  addTool: () =>
    set(state => {
      let newToolName = 'new_function';
      let counter = 1;
      while (state.tools.some(tool => tool.name === newToolName)) {
        newToolName = `new_function_${counter++}`;
      }
      return {
        tools: [
          ...state.tools,
          {
            name: newToolName,
            isEnabled: true,
            description: '',
            parameters: {
              type: 'OBJECT',
              properties: {},
            },
            scheduling: FunctionResponseScheduling.INTERRUPT,
          },
        ],
      };
    }),
  removeTool: (toolName: string) =>
    set(state => ({
      tools: state.tools.filter(tool => tool.name !== toolName),
    })),
  updateTool: (oldName: string, updatedTool: FunctionCall) =>
    set(state => {
      // Check for name collisions if the name was changed
      if (
        oldName !== updatedTool.name &&
        state.tools.some(tool => tool.name === updatedTool.name)
      ) {
        console.warn(`Tool with name "${updatedTool.name}" already exists.`);
        // Prevent the update by returning the current state
        return state;
      }
      return {
        tools: state.tools.map(tool =>
          tool.name === oldName ? updatedTool : tool,
        ),
      };
    }),
}));

/**
 * Logs
 */
export interface LiveClientToolResponse {
  functionResponses?: FunctionResponse[];
}
export interface GroundingChunk {
  web?: {
    // FIX: Type 'GroundingChunk[]' is not assignable to type 'GroundingChunk[]'.
    // Made properties optional and nullable to match the library type.
    uri?: string | null;
    title?: string | null;
  };
}

export interface ConversationTurn {
  timestamp: Date;
  role: 'user' | 'agent' | 'system';
  text: string;
  isFinal: boolean;
  toolUseRequest?: LiveServerToolCall;
  toolUseResponse?: LiveClientToolResponse;
  groundingChunks?: GroundingChunk[];
}

const saveHistory = (turns: ConversationTurn[]) => {
  const { user } = useAuthStore.getState();
  if (user?.email) {
    const historyKey = `nativespeak_history_${user.email}`;
    try {
      localStorage.setItem(historyKey, JSON.stringify(turns));
    } catch (error) {
      console.error('Failed to save conversation history:', error);
    }
  }
};

const clearHistory = () => {
  const { user } = useAuthStore.getState();
  if (user?.email) {
    const historyKey = `nativespeak_history_${user.email}`;
    localStorage.removeItem(historyKey);
  }
};

export const useLogStore = create<{
  turns: ConversationTurn[];
  setTurns: (turns: ConversationTurn[]) => void;
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  clearTurns: () => void;
  resetTurnsForSession: () => void;
}>((set, get) => ({
  turns: [],
  setTurns: (loadedTurns: ConversationTurn[]) => {
    set({ turns: loadedTurns });
  },
  resetTurnsForSession: () => {
    set({ turns: [] });
  },
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => {
    set(state => ({
      turns: [...state.turns, { ...turn, timestamp: new Date() }],
    }));
    saveHistory(get().turns);
  },
  updateLastTurn: (update: Partial<Omit<ConversationTurn, 'timestamp'>>) => {
    set(state => {
      if (state.turns.length === 0) {
        return state;
      }
      const newTurns = [...state.turns];
      const lastTurn = { ...newTurns[newTurns.length - 1], ...update };
      newTurns[newTurns.length - 1] = lastTurn;
      return { turns: newTurns };
    });
    saveHistory(get().turns);
  },
  clearTurns: () => {
    set({ turns: [] });
    clearHistory();
  },
}));