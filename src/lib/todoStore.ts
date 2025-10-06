import { create } from 'zustand';
import { useAchievementStore } from './achievementStore';
import { useAuthStore } from './authStore';
import { useNotificationStore } from './notificationStore';

interface Todo {
  id: number;
  text: string;
  status: 'todo' | 'inProgress' | 'completed';
  isHeader?: boolean;
  duration?: number; // duration in seconds
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: number) => void;
  cycleTodoStatus: (id: number) => void;
  completeTaskByText: (searchText: string) => void;
}

const TODO_STORAGE_KEY = 'native_speak_todos';

const getDefaultTodos = (): Todo[] => {
    const now = Date.now();
    return [
      // Daily Goals
      { id: now + 1, text: 'Metas rápidas (diárias)', isHeader: true, status: 'todo' },
      { id: now + 2, text: 'Falar por 2 minutos seguidos.', status: 'todo', duration: 120 },
      { id: now + 3, text: 'Praticar 10 minutos de conversa com a IA.', status: 'todo', duration: 600 },
      { id: now + 4, text: 'Aprender 5 novas palavras e usá-las em frases.', status: 'todo', duration: 0 },
      { id: now + 5, text: 'Ouvir e repetir 3 frases completas para treinar pronúncia.', status: 'todo', duration: 0 },
      { id: now + 6, text: 'Fazer uma simulação de “small talk” (conversa casual).', status: 'todo', duration: 0 },
      { id: now + 7, text: 'Revisar o que aprendi ontem com um mini-teste próprio.', status: 'todo', duration: 0 },
      { id: now + 8, text: 'Pedir para a IA corrigir uma frase que você formulou.', status: 'todo', duration: 0 },
      { id: now + 9, text: 'Descrever uma imagem ou o seu dia para a IA.', status: 'todo', duration: 0 },

      // Weekly Goals
      { id: now + 10, text: 'Metas intermediárias (semanais)', isHeader: true, status: 'todo' },
      { id: now + 11, text: 'Acumular 1 hora de prática falada no total.', status: 'todo', duration: 3600 },
      { id: now + 12, text: 'Dominar 20 novas palavras/expressões.', status: 'todo', duration: 0 },
      { id: now + 13, text: 'Completar 2 cenários de prática (ex: viagem, entrevista).', status: 'todo', duration: 0 },
      { id: now + 14, text: 'Gravar minha voz e comparar evolução com semanas anteriores.', status: 'todo', duration: 0 },
      { id: now + 15, text: 'Assistir um vídeo curto em inglês e explicar para a IA o que entendi.', status: 'todo', duration: 0 },
      { id: now + 16, text: 'Explicar um tópico complexo do seu interesse para a IA.', status: 'todo', duration: 0 },
      { id: now + 17, text: 'Manter uma conversa de 5 minutos sobre um único tema.', status: 'todo', duration: 300 },
    
      // Monthly Goals
      { id: now + 18, text: 'Metas de longo prazo (mensais)', isHeader: true, status: 'todo' },
      { id: now + 19, text: 'Completar 5 horas de conversação com a IA.', status: 'todo', duration: 18000 },
      { id: now + 20, text: 'Conseguir conversar 10 minutos seguidos sem trocar para o português.', status: 'todo', duration: 600 },
      { id: now + 21, text: 'Escrever um pequeno texto (100–200 palavras) e revisar com a IA.', status: 'todo', duration: 0 },
      { id: now + 22, text: 'Revisar todas as metas concluídas e criar novas para o próximo mês.', status: 'todo', duration: 0 },
      { id: now + 23, text: 'Treinar um cenário avançado (ex: reunião de trabalho ou debate).', status: 'todo', duration: 0 },
      { id: now + 24, text: 'Sentir-se confiante para iniciar uma conversa básica em inglês.', status: 'todo', duration: 0 },
      { id: now + 25, text: 'Entender 80% das respostas da IA sem precisar de tradução.', status: 'todo', duration: 0 },
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
        { id: Date.now(), text, status: 'todo' as const, duration: 0 },
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
      let justCompleted = false;
      let completedTodo: Todo | null = null;
      const newTodos = state.todos.map((todo) => {
        if (todo.id === id && !todo.isHeader) {
          const newStatus =
            todo.status === 'todo'
              ? 'inProgress'
              : todo.status === 'inProgress'
              ? 'completed'
              : 'todo';
          
          if(newStatus === 'completed' && todo.status !== 'completed') {
            justCompleted = true;
            completedTodo = { ...todo, status: newStatus };
          }

          return { ...todo, status: newStatus as 'todo' | 'inProgress' | 'completed' };
        }
        return todo;
      });
      saveTodos(newTodos);

      // Trigger notification
      if (completedTodo) {
        useNotificationStore.getState().addNotification({
          title: 'Meta Concluída!',
          message: completedTodo.text,
          type: 'goal',
          icon: 'task_alt',
        });
      }

      // Check for achievement unlock after state update
      if (justCompleted) {
        const completedCount = newTodos.filter(
          (t) => !t.isHeader && t.status === 'completed'
        ).length;
        
        const user = useAuthStore.getState().user;

        if (completedCount >= 5 && user) {
            useAchievementStore.getState().unlockAchievement('complete_5_goals', user.email);
        }
      }

      return { todos: newTodos };
    });
  },
  completeTaskByText: (searchText: string) => {
    set((state) => {
      const taskToComplete = state.todos.find(
        (t) =>
          !t.isHeader &&
          t.status !== 'completed' &&
          t.text.toLowerCase().includes(searchText.toLowerCase())
      );
  
      if (!taskToComplete) {
        return state; // No task found or already completed
      }
  
      let taskCompleted = false;
      let completedTodo: Todo | null = null;
      const newTodos = state.todos.map((todo) => {
        if (todo.id === taskToComplete.id) {
          taskCompleted = true;
          completedTodo = { ...todo, status: 'completed' as const };
          return completedTodo;
        }
        return todo;
      });
  
      if (taskCompleted) {
        // Find the next task that is not a header and has 'todo' status
        const nextTaskIndex = newTodos.findIndex(
          (t) => !t.isHeader && t.status === 'todo'
        );
  
        if (nextTaskIndex !== -1) {
          newTodos[nextTaskIndex] = {
            ...newTodos[nextTaskIndex],
            status: 'inProgress' as const,
          };
        }
      }
  
      saveTodos(newTodos);
  
      // Trigger notification
      if (completedTodo) {
        useNotificationStore.getState().addNotification({
          title: 'Meta Concluída!',
          message: completedTodo.text,
          type: 'goal',
          icon: 'task_alt',
        });
      }

      // Check for achievement unlock
      const completedCount = newTodos.filter(
        (t) => !t.isHeader && t.status === 'completed'
      ).length;
  
      const user = useAuthStore.getState().user;
      if (completedCount >= 5 && user) {
        useAchievementStore.getState().unlockAchievement('complete_5_goals', user.email);
      }
  
      return { todos: newTodos };
    });
  },
}));