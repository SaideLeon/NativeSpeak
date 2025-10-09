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
  | 'navigation-system'
  | 'soccer'
  | 'technology'
  | 'artificial-intelligence'
  | 'digital-marketing'
  | 'robotic-automation'
  | 'meditation'
  | 'religion'
  | 'holy-bible'
  | 'quran'
  | 'grammar'
  | 'verbs'
  | 'movies-and-tv-shows'
  | 'cooking-and-gastronomy'
  | 'music'
  | 'environment'
  | 'health-and-wellness'
  | 'personal-finance'
  | 'world-history'
  | 'science-and-space'
  | 'literature-and-books'
  | 'fashion-and-style';

const toolsets: Record<Scenario, FunctionCall[]> = {
  'customer-support': customerSupportTools,
  'personal-assistant': personalAssistantTools,
  'navigation-system': navigationSystemTools,
  'soccer': customerSupportTools,
  'technology': customerSupportTools,
  'artificial-intelligence': customerSupportTools,
  'digital-marketing': customerSupportTools,
  'robotic-automation': customerSupportTools,
  'meditation': customerSupportTools,
  'religion': customerSupportTools,
  'holy-bible': customerSupportTools,
  'quran': customerSupportTools,
  'grammar': customerSupportTools,
  'verbs': customerSupportTools,
  'movies-and-tv-shows': customerSupportTools,
  'cooking-and-gastronomy': customerSupportTools,
  'music': customerSupportTools,
  'environment': customerSupportTools,
  'health-and-wellness': customerSupportTools,
  'personal-finance': customerSupportTools,
  'world-history': customerSupportTools,
  'science-and-space': customerSupportTools,
  'literature-and-books': customerSupportTools,
  'fashion-and-style': customerSupportTools,
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

9. Análise de Metas: Revise a lista de 'Metas em progresso' do aluno. Se, durante a conversa, você concluir que uma meta foi alcançada, use a função \`mark_goal_as_completed\` para marcá-la como concluída.

Sua missão é ajudar o aluno a desenvolver vocabulário, gramática, compreensão e conversação em inglês, sempre de forma prática, motivadora e personalizada.`,
  'personal-assistant':
    'Você é um assistente pessoal prestativo e amigável. Seja proativo e eficiente.',
  'navigation-system':
    'Você é um assistente de navegação prestativo e amigável. Forneça direções claras e precisas.',
  'soccer': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre futebol. Inicie uma conversa sobre times, jogadores, campeonatos e momentos memoráveis do esporte. Use vocabulário relacionado a futebol (ex: goal, match, championship, player, coach). Seja um fã entusiasmado do esporte. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'technology': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre tecnologia. Inicie uma discussão sobre smartphones, gadgets, o futuro da tecnologia e como ela impacta nossas vidas. Use vocabulário técnico de forma acessível (ex: innovation, software, hardware, device). Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'artificial-intelligence': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Inteligência Artificial. Discuta os avanços recentes, ética em IA, e o futuro do trabalho. Use termos como 'machine learning', 'neural network', e 'algorithm' de forma simples. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'digital-marketing': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Marketing Digital. Converse sobre estratégias como SEO, mídias sociais, e email marketing. Use vocabulário da área (ex: engagement, conversion, content strategy, target audience). Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'robotic-automation': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Automação Robótica. Fale sobre como robôs e automação estão mudando as indústrias e o dia a dia. Use termos como 'automation', 'robotics', 'efficiency', e 'workforce'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'meditation': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Meditação. Inicie uma conversa calma sobre os benefícios da meditação, técnicas de mindfulness e bem-estar. Use vocabulário como 'mindfulness', 'breathing', 'stress relief', e 'inner peace'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'religion': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Religião de forma geral. Conduza uma conversa respeitosa sobre diferentes crenças, práticas e o papel da religião na sociedade. Use vocabulário como 'faith', 'belief', 'worship', 'spirituality'. Mantenha uma postura neutra e aberta. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'holy-bible': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre a Bíblia Sagrada. Inicie uma conversa respeitosa sobre histórias, personagens e ensinamentos da Bíblia. Use vocabulário como 'scripture', 'testament', 'prophet', 'parable'. Mantenha uma postura informativa e respeitosa. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'quran': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre o Alcorão. Inicie uma conversa respeitosa sobre os ensinamentos, histórias e a importância do Alcorão no Islam. Use vocabulário como 'verse', 'surah', 'prophet', 'revelation'. Mantenha uma postura informativa e respeitosa. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'grammar': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação especificamente sobre gramática inglesa. Escolha um tópico gramatical (ex: present perfect, conditionals, prepositions) e crie um diálogo onde o aluno precise usar essa estrutura. Explique e corrija de forma clara.`,
  'verbs': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação focada em verbos, especialmente 'phrasal verbs' ou tempos verbais. Crie um diálogo que incentive o uso de diferentes verbos e tempos. Explique as nuances e corrija quando necessário.`,
  'movies-and-tv-shows': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre filmes e séries. Pergunte sobre seus gêneros, filmes e séries favoritos, e discuta personagens e enredos. Use vocabulário como 'genre', 'plot', 'character', 'binge-watch'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'cooking-and-gastronomy': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Culinária. Converse sobre pratos favoritos, receitas, e diferentes cozinhas do mundo. Use vocabulário como 'recipe', 'ingredients', 'to bake', 'to fry', 'delicious'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'music': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Música. Pergunte sobre seus artistas e gêneros musicais preferidos. Converse sobre shows, letras de música e o impacto da música. Use vocabulário como 'genre', 'lyrics', 'artist', 'concert'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'environment': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Meio Ambiente. Discuta temas como reciclagem, mudanças climáticas e sustentabilidade. Use vocabulário como 'sustainability', 'recycling', 'climate change', 'pollution'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'health-and-wellness': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Saúde e Bem-estar. Converse sobre exercícios, alimentação saudável, saúde mental e hábitos de vida. Use vocabulário como 'exercise', 'healthy diet', 'mental health', 'well-being'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'personal-finance': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Finanças Pessoais. Fale sobre orçamento, investimentos, e como economizar dinheiro. Use vocabulário como 'budget', 'savings', 'investment', 'debt'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'world-history': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre História Mundial. Escolha um período ou evento histórico interessante e discuta sobre ele. Use vocabulário como 'ancient', 'empire', 'revolution', 'historical event'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'science-and-space': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Ciência e Espaço. Converse sobre descobertas científicas, exploração espacial e o universo. Use vocabulário como 'planet', 'galaxy', 'discovery', 'space exploration'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'literature-and-books': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Literatura e Livros. Pergunte sobre seus livros e autores favoritos e discuta diferentes gêneros literários. Use vocabulário como 'author', 'novel', 'genre', 'plot'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
  'fashion-and-style': `Você é um tutor de inglês da NativeSpeak. O aluno quer praticar conversação sobre Moda e Estilo. Fale sobre tendências, estilistas e a importância da moda. Use vocabulário como 'trend', 'style', 'designer', 'outfit'. Lembre-se de manter o foco em ajudar o aluno a praticar inglês.`,
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
  geminiApiKey: string;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
  setUseWebSearch: (use: boolean) => void;
  setGeminiApiKey: (key: string) => void;
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

9. Análise de Metas: Revise a lista de 'Metas em progresso' do aluno. Se, durante a conversa, você concluir que uma meta foi alcançada, use a função \`mark_goal_as_completed\` para marcá-la como concluída.

Sua missão é ajudar o aluno a desenvolver vocabulário, gramática, compreensão e conversação em inglês, sempre de forma prática, motivadora e personalizada.`,
  model: DEFAULT_LIVE_API_MODEL,
  voice: DEFAULT_VOICE,
  useWebSearch: true,
  geminiApiKey: localStorage.getItem('gemini_api_key') || '',
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => set({ voice }),
  setUseWebSearch: use => set({ useWebSearch: use }),
  setGeminiApiKey: key => {
    localStorage.setItem('gemini_api_key', key);
    set({ geminiApiKey: key });
  },
}));

/**
 * UI
 */
export type AppView = 'console' | 'lessons' | 'courses';

export const useUI = create<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  currentView: AppView;
  setView: (view: AppView) => void;
}>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  isLeftSidebarOpen: false,
  toggleLeftSidebar: () =>
    set(state => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
  currentView: 'console',
  setView: (view) => set({ currentView: view, isLeftSidebarOpen: false }),
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

export interface FunctionCallLog {
  timestamp: Date;
  name: string;
  args: any;
  id?: string;
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

const loadHistory = (): ConversationTurn[] => {
  const { user } = useAuthStore.getState();
  if (user?.email) {
    const historyKey = `nativespeak_history_${user.email}`;
    try {
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        return parsedHistory.map((turn: any) => ({
          ...turn,
          timestamp: new Date(turn.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  }
  return [];
};

export const useLogStore = create<{
  turns: ConversationTurn[];
  functionCallHistory: FunctionCallLog[];
  inputTokens: number;
  outputTokens: number;
  setTurns: (turns: ConversationTurn[]) => void;
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  addFunctionCall: (call: Omit<FunctionCallLog, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  clearTurns: () => void;
  resetTurnsForSession: () => void;
}>((set, get) => ({
  turns: loadHistory(),
  functionCallHistory: [],
  inputTokens: 0,
  outputTokens: 0,
  setTurns: (loadedTurns: ConversationTurn[]) => {
    set({ turns: loadedTurns });
  },
  resetTurnsForSession: () => {
    set({ turns: [], functionCallHistory: [], inputTokens: 0, outputTokens: 0 });
  },
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => {
    set(state => ({
      turns: [...state.turns, { ...turn, timestamp: new Date() }],
    }));
    saveHistory(get().turns);
  },
  addFunctionCall: (call: Omit<FunctionCallLog, 'timestamp'>) => {
    set(state => ({
      functionCallHistory: [
        ...state.functionCallHistory,
        { ...call, timestamp: new Date() },
      ],
    }));
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
    set({ turns: [], functionCallHistory: [], inputTokens: 0, outputTokens: 0 });
    clearHistory();
  },
}));