/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { LessonTopic, lessonSystemPrompts } from './state';

export interface LessonDetails {
  title: string;
  description: string;
  prompts: string[];
  systemPrompt: string;
}

export const lessons: Record<LessonTopic, LessonDetails> = {
  'ordering-food': {
    title: 'Pedindo Comida',
    description:
      'Aprenda vocabulário e frases essenciais para pedir em um restaurante.',
    prompts: [
      "I'd like to order...",
      'Could I have the check?',
      'Appetizer, Main Course, Dessert',
    ],
    systemPrompt: lessonSystemPrompts['ordering-food'],
  },
  'job-interview-basics': {
    title: 'Básico de Entrevista',
    description:
      'Prepare-se para a pergunta mais comum em entrevistas de emprego.',
    prompts: [
      'Tell me about yourself',
      'Strengths and Weaknesses',
      'My experience is...',
    ],
    systemPrompt: lessonSystemPrompts['job-interview-basics'],
  },
  'travel-and-directions': {
    title: 'Viagens e Direções',
    description:
      'Aprenda a pedir e dar informações para não se perder em sua viagem.',
    prompts: [
      'How do I get to...?',
      'Turn left/right',
      'Go straight ahead',
    ],
    systemPrompt: lessonSystemPrompts['travel-and-directions'],
  },
};