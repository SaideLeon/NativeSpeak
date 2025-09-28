import { create } from 'zustand';

interface Todo {
  id: number;
  text: string;
  status: 'todo' | 'inProgress' | 'completed';
  isHeader?: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: number) => void;
  cycleTodoStatus: (id: number) => void;
}

const TODO_STORAGE_KEY = 'native_speak_todos';

const getDefaultTodos = (): Todo[] => {
    const now = Date.now();
    return [
      { id: now + 1, text: 'Metas rápidas (diárias)', isHeader: true, status: 'todo' },
      { id: now + 2, text: 'Praticar 10 minutos de conversa com a IA.', status: 'todo' },
      { id: now + 3, text: 'Aprender 5 novas palavras e usá-las em frases.', status: 'todo' },
      { id: now + 4, text: 'Ouvir e repetir 3 frases completas para treinar pronúncia.', status: 'todo' },
      { id: now + 5, text: 'Fazer uma simulação de “small talk” (conversa casual).', status: 'todo' },
      { id: now + 6, text: 'Revisar o que aprendi ontem com um mini-teste próprio.', status: 'todo' },
    
      { id: now + 7, text: 'Metas intermediárias (semanais)', isHeader: true, status: 'todo' },
      { id: now + 8, text: 'Acumular 1 hora de prática falada no total.', status: 'todo' },
      { id: now + 9, text: 'Dominar 20 novas palavras/expressões.', status: 'todo' },
      { id: now + 10, text: 'Completar 2 cenários de prática (ex: viagem, entrevista).', status: 'todo' },
      { id: now + 11, text: 'Gravar minha voz e comparar evolução com semanas anteriores.', status: 'todo' },
      { id: now + 12, text: 'Assistir um vídeo curto em inglês e explicar para a IA o que entendi.', status: 'todo' },
    
      { id: now + 13, text: 'Metas de longo prazo (mensais)', isHeader: true, status: 'todo' },
      { id: now + 14, text: 'Completar 5 horas de conversação com a IA.', status: 'todo' },
      { id: now + 15, text: 'Conseguir conversar 10 minutos seguidos sem trocar para o português.', status: 'todo' },
      { id: now + 16, text: 'Escrever um pequeno texto (100–200 palavras) e revisar com a IA.', status: 'todo' },
      { id: now + 17, text: 'Revisar todas as metas concluídas e criar novas para o próximo mês.', status: 'todo' },
      { id: now + 18, text: 'Treinar um cenário avançado (ex: reunião de trabalho ou debate).', status: 'todo' },
    ];
};

const saveTodos = (todos: Todo[]) => {
    try {
        localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error("Error saving todos to localStorage", error);
    }
};

const getInitialTodos = (): Todo[] => {
    try {
        const item = localStorage.getItem(TODO_STORAGE_KEY);
        if (item) { // Key exists
            return JSON.parse(item);
        }
        // Key doesn't exist, it's a first load.
        const defaultTodos = getDefaultTodos();
        saveTodos(defaultTodos);
        return defaultTodos;
    } catch (error) {
        console.error("Error loading todos from localStorage", error);
        return getDefaultTodos();
    }
};


export const useTodoStore = create<TodoState>((set) => ({
  todos: getInitialTodos(),
  addTodo: (text: string) => {
    set((state) => {
      const newTodos = [
        ...state.todos,
        { id: Date.now(), text, status: 'todo' as const },
      ];
      saveTodos(newTodos);
      return { todos: newTodos };
    });
  },
  removeTodo: (id: number) => {
    set((state) => {
      const newTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodos(newTodos);
      return { todos: newTodos };
    });
  },
  cycleTodoStatus: (id: number) => {
    set((state) => {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === id && !todo.isHeader) {
          const newStatus =
            todo.status === 'todo'
              ? 'inProgress'
              : todo.status === 'inProgress'
              ? 'completed'
              : 'todo';
          return { ...todo, status: newStatus as 'todo' | 'inProgress' | 'completed' };
        }
        return todo;
      });
      saveTodos(newTodos);
      return { todos: newTodos };
    });
  },
}));