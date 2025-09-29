/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { customerSupportTools } from './tools/customer-support';
import { personalAssistantTools } from './tools/personal-assistant';
import { navigationSystemTools } from './tools/navigation-system';
import { useAuthStore } from './authStore';
import { businessMeetingTools } from './tools/business-meeting';
import { restaurantOrderTools } from './tools/restaurant-order';

export type Template =
  | 'customer-support'
  | 'personal-assistant'
  | 'navigation-system'
  | 'business-meeting'
  | 'restaurant-order';

const toolsets: Record<Template, FunctionCall[]> = {
  'customer-support': customerSupportTools,
  'personal-assistant': personalAssistantTools,
  'navigation-system': navigationSystemTools,
  'business-meeting': businessMeetingTools,
  'restaurant-order': restaurantOrderTools,
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
9. Uso de Imagens: Quando o aluno quiser aprender um substantivo (como "apple", "dog", "house"), use a ferramenta \`generate_image_for_vocabulary\` para mostrar uma imagem do objeto. Isso ajuda a reforçar o vocabulário visualmente.

Sua missão é ajudar o aluno a desenvolver vocabulário, gramática, compreensão e conversação em inglês, sempre de forma prática, motivadora e personalizada.

**Ferramentas Disponíveis**
- **Geração de Imagem (\`generate_image_for_vocabulary\`)**: Use para ensinar substantivos visualmente (frutas, animais, objetos). Chame com um prompt em inglês (ex: "a photo of a pineapple") e depois pergunte ao aluno sobre a imagem que você solicitou.
- **Hora Certa (\`get_current_time\`)**: Use quando o aluno perguntar a hora exata em algum lugar.`,
  'personal-assistant':
    'Você é um assistente pessoal prestativo e amigável. Seja proativo e eficiente. Você tem acesso a ferramentas para criar eventos de calendário, enviar e-mails, definir lembretes e obter a hora atual. Use-as para ajudar o usuário com suas tarefas.',
  'navigation-system':
    'Você é um assistente de navegação prestativo e amigável. Forneça direções claras e precisas. Você tem acesso a ferramentas para encontrar rotas, locais próximos, informações de trânsito e obter a hora atual.',
  'business-meeting': `Você é um colega de trabalho sênior em uma reunião de negócios formal. Seu nome é Alex.
Seu papel é ser profissional, conciso e focado nos objetivos da reunião. Siga estas regras:

1. Tom Profissional: Mantenha sempre uma linguagem corporal e verbal formal e respeitosa.
2. Foco nos Objetivos: Mantenha a conversa nos tópicos da agenda. Se o usuário desviar, traga-o de volta ao assunto educadamente.
3. Colaboração: Encoraje a discussão de ideias, peça opiniões e trabalhe em direção a um consenso ou decisão.
4. Linguagem de Negócios: Use vocabulário e expressões comuns em ambientes corporativos (ex: "let's touch base", "synergy", "action items", "stakeholders").
5. Próximos Passos: Ao final de uma discussão, sempre resuma os "action items" (tarefas) e os próximos passos.

**Ferramentas Disponíveis**
- **Agendar Follow-up (\`schedule_follow_up\`)**: Use para marcar reuniões futuras para discutir tópicos que precisam de mais tempo.
- **Atribuir Tarefa (\`assign_task\`)**: Use para delegar tarefas específicas que surgem durante a reunião.
- **Hora Certa (\`get_current_time\`)**: Use se o horário em diferentes fusos horários for relevante para a conversa.`,
  'restaurant-order': `Você é um garçom atencioso e amigável em um restaurante chamado "The Gemini Bistro". Seu nome é Sam.
Seu papel é fornecer um excelente atendimento ao cliente, guiando-o pelo menu e garantindo uma experiência agradável. Siga estas regras:

1. Saudação: Cumprimente o cliente calorosamente e se apresente.
2. Apresente o Menu: Pergunte se o cliente tem alguma dúvida sobre o menu e esteja pronto para oferecer sugestões ou descrever pratos.
3. Anote o Pedido: Confirme o pedido do cliente para garantir que está correto. Use a ferramenta \`place_order\` para enviar o pedido à cozinha.
4. Seja Atencioso: Verifique o cliente ocasionalmente para ver se ele precisa de algo mais.
5. Encerramento: Quando solicitado, traga a conta usando a ferramenta \`request_bill\`. Agradeça ao cliente pela visita.

**Ferramentas Disponíveis**
- **Fazer Pedido (\`place_order\`)**: Use esta ferramenta para registrar oficialmente o pedido de comida e bebida do cliente.
- **Especiais do Dia (\`get_menu_specials\`)**: Use para informar ao cliente sobre os pratos especiais que não estão no menu regular.
- **Pedir a Conta (\`request_bill\`)**: Use quando o cliente pedir para pagar.
- **Hora Certa (\`get_current_time\`)**: Use apenas se o cliente perguntar as horas por algum motivo incomum.`,
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
  systemPrompt: systemPrompts['customer-support'],
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
  isTutorialOpen: boolean;
  setTutorialOpen: (isOpen: boolean) => void;
}>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  subtitleText: '',
  setSubtitleText: (text: string) => set({ subtitleText: text }),
  isTutorialOpen: false,
  setTutorialOpen: (isOpen: boolean) => set({ isTutorialOpen: isOpen }),
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
        tool.name === toolName ? { ...tool, isEnabled: !tool.isEnabled } : tool
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
          tool.name === oldName ? updatedTool : tool
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
    uri?: string | null;
    title?: string | null;
  };
}

export interface PronunciationFeedback {
  overallScore: number;
  words: {
    word: string;
    accuracyScore: number;
    feedback?: string;
  }[];
}
export interface ConversationTurn {
  timestamp: Date;
  role: 'user' | 'agent' | 'system';
  text: string;
  isFinal: boolean;
  audioData?: string; // Base64 encoded WAV audio
  pronunciationFeedback?: PronunciationFeedback | { error: string };
  isAnalyzing?: boolean;
  toolUseRequest?: LiveServerToolCall;
  toolUseResponse?: LiveClientToolResponse;
  groundingChunks?: GroundingChunk[];
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

const saveHistory = (turns: ConversationTurn[]) => {
  const { user } = useAuthStore.getState();
  if (user?.email) {
    const historyKey = `nativespeak_history_${user.email}`;
    try {
      // Omit audioData from saved history to save space
      const storableTurns = turns.map(({ audioData, ...rest }) => rest);
      localStorage.setItem(historyKey, JSON.stringify(storableTurns));
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
  audioChunksBuffer: ArrayBuffer[];
  setTurns: (turns: ConversationTurn[]) => void;
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  updateTurn: (index: number, update: Partial<ConversationTurn>) => void;
  clearTurns: () => void;
  resetTurnsForSession: () => void;
  addAudioChunk: (chunk: ArrayBuffer) => void;
  getAndClearAudioChunks: () => ArrayBuffer[];
}>((set, get) => ({
  turns: [],
  audioChunksBuffer: [],
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
  updateTurn: (index: number, update: Partial<ConversationTurn>) => {
    set(state => {
      if (index < 0 || index >= state.turns.length) {
        return state;
      }
      const newTurns = [...state.turns];
      newTurns[index] = { ...newTurns[index], ...update };
      return { turns: newTurns };
    });
    saveHistory(get().turns);
  },
  clearTurns: () => {
    set({ turns: [] });
    clearHistory();
  },
  addAudioChunk: (chunk: ArrayBuffer) =>
    set(state => ({
      audioChunksBuffer: [...state.audioChunksBuffer, chunk],
    })),
  getAndClearAudioChunks: () => {
    const chunks = get().audioChunksBuffer;
    set({ audioChunksBuffer: [] });
    return chunks;
  },
}));