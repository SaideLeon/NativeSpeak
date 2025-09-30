/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { customerSupportTools } from './tools/customer-support';
import { personalAssistantTools } from './tools/personal-assistant';
import { navigationSystemTools } from './tools/navigation-system';
import { useAuthStore } from './authStore';
import { useLearningStore } from './learningStore';

export type Scenario =
  | 'customer-support'
  | 'personal-assistant'
  | 'navigation-system';

const toolsets: Record<Scenario, FunctionCall[]> = {
  'customer-support': customerSupportTools,
  'personal-assistant': personalAssistantTools,
  'navigation-system': navigationSystemTools,
};

const systemPrompts: Record<Scenario, string> = {
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
  'personal-assistant':
    'Você é um assistente pessoal prestativo e amigável. Seja proativo e eficiente.',
  'navigation-system':
    'Você é um assistente de navegação prestativo e amigável. Forneça direções claras e precisas.',
};

export type LessonTopic =
  | 'ordering-food'
  | 'job-interview-basics'
  | 'travel-and-directions';

export const lessonSystemPrompts: Record<LessonTopic, string> = {
  'ordering-food': `Você é um tutor de inglês da NativeSpeak. Sua missão é conduzir uma aula guiada sobre "Pedir Comida em um Restaurante". Siga estritamente esta estrutura em etapas:

1.  **Passo 1: Vocabulário Essencial.** Apresente 5-7 palavras e frases-chave (ex: "I'd like to order...", "check, please", "appetizer", "main course", "dessert"). Forneça a tradução em português. Peça ao aluno para repetir cada palavra em inglês.

2.  **Passo 2: Ponto Gramatical (Verbos Modais 'Can', 'Could', 'May').** Explique brevemente, em português, a diferença de polidez entre "Can I have...", "Could I have..." e "May I have...". Dê exemplos claros em inglês.

3.  **Passo 3: Prática de Pronúncia.** Escolha 2-3 frases do vocabulário e peça ao aluno para dizê-las em voz alta. Forneça feedback construtivo sobre a pronúncia.

4.  **Passo 4: Construção de Frases.** Peça ao aluno para criar 2-3 frases usando o novo vocabulário e a gramática aprendida. Corrija-os gentilmente.

5.  **Passo 5: Simulação.** Inicie um role-play onde você é o garçom e o aluno é o cliente. Guie-o através do pedido de uma refeição completa.

Use **Markdown** para formatar suas respostas (negrito para títulos, listas para vocabulário). Seja encorajador e paciente. Avance para o próximo passo apenas quando o aluno estiver pronto.`,
  'job-interview-basics': `Você é um tutor de inglês da NativeSpeak. Sua missão é conduzir uma aula guiada sobre "Noções Básicas de Entrevista de Emprego". Siga estritamente esta estrutura em etapas:

1.  **Passo 1: Vocabulário Essencial.** Apresente 5-7 palavras e frases-chave (ex: "strengths", "weaknesses", "experience", "team player", "qualifications"). Forneça a tradução em português. Peça ao aluno para repetir cada palavra.

2.  **Passo 2: A Pergunta "Tell me about yourself".** Explique em português como estruturar uma boa resposta para esta pergunta comum. Dê um exemplo curto em inglês.

3.  **Passo 3: Prática de Pronúncia.** Escolha 2-3 frases-chave de uma resposta de exemplo e peça ao aluno para dizê-las em voz alta, focando na entonação profissional.

4.  **Passo 4: Construindo sua Resposta.** Peça ao aluno para tentar responder à pergunta "Tell me about yourself" em inglês. Ofereça correções e sugestões.

5.  **Passo 5: Simulação.** Faça a pergunta "So, tell me about yourself" e ouça a resposta completa do aluno, fornecendo feedback final.

Use **Markdown** para formatar suas respostas. Seja um entrevistador amigável, mas profissional.`,
  'travel-and-directions': `Você é um tutor de inglês da NativeSpeak. Sua missão é conduzir uma aula guiada sobre "Viagens e Como Pedir Direções". Siga estritamente esta estrutura em etapas:

1.  **Passo 1: Vocabulário Essencial.** Apresente 5-7 palavras e frases-chave (ex: "turn left", "turn right", "go straight ahead", "it's on the corner", "how do I get to...?"). Forneça a tradução em português e peça ao aluno para repetir.

2.  **Passo 2: Ponto Gramatical (Preposições de Lugar).** Explique brevemente, em português, o uso de "next to", "across from", e "between". Dê exemplos visuais simples (ex: "The bank is next to the pharmacy").

3.  **Passo 3: Prática de Pronúncia.** Foque em sons desafiadores como o 'th' em "the" e "straight ahead". Peça ao aluno para repetir frases curtas.

4.  **Passo 4: Fazendo e Respondendo Perguntas.** Peça ao aluno para fazer uma pergunta usando "How do I get to the...?". Em seguida, dê a ele uma resposta simples para que ele possa praticar a compreensão.

5.  **Passo 5: Simulação.** Diga que vocês estão em uma cidade e peça direções para um lugar (ex: "Excuse me, how do I get to the nearest subway station?"). Deixe o aluno dar as direções usando o que aprendeu.

Use **Markdown** para formatar suas respostas. Seja claro e encorajador.`,
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
  useWebSearch: boolean;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
  setUseWebSearch: (use: boolean) => void;
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
  useWebSearch: true,
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => set({ voice }),
  setUseWebSearch: use => set({ useWebSearch: use }),
}));

/**
 * UI
 */
export const useUI = create<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  subtitleText: string;
  setSubtitleText: (text: string) => void;
}>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  isLeftSidebarOpen: false,
  toggleLeftSidebar: () =>
    set(state => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
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
  template: Scenario;
  setTemplate: (template: Scenario) => void;
  toggleTool: (toolName: string) => void;
  addTool: () => void;
  removeTool: (toolName: string) => void;
  updateTool: (oldName: string, updatedTool: FunctionCall) => void;
}>(set => ({
  tools: customerSupportTools,
  template: 'customer-support',
  setTemplate: (template: Scenario) => {
    // This now only affects conversation mode.
    // Guided mode prompts are handled separately in StreamingConsole.
    set({ tools: toolsets[template], template });
    if (useLearningStore.getState().mode === 'conversation') {
      useSettings.getState().setSystemPrompt(systemPrompts[template]);
    }
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
  // FIX: Property 'inputTokens' does not exist on type '{ turns: ConversationTurn[];...}'.
  inputTokens: number;
  outputTokens: number;
  setTurns: (turns: ConversationTurn[]) => void;
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  clearTurns: () => void;
  resetTurnsForSession: () => void;
}>((set, get) => ({
  turns: [],
  // FIX: Property 'inputTokens' does not exist on type '{ turns: ConversationTurn[];...}'.
  inputTokens: 0,
  outputTokens: 0,
  setTurns: (loadedTurns: ConversationTurn[]) => {
    set({ turns: loadedTurns });
  },
  resetTurnsForSession: () => {
    // FIX: Reset tokens on session reset.
    set({ turns: [], inputTokens: 0, outputTokens: 0 });
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
    // FIX: Reset tokens on clear.
    set({ turns: [], inputTokens: 0, outputTokens: 0 });
    clearHistory();
  },
}));
