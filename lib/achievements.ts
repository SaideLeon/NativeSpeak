/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_session',
    name: 'Quebrando o Gelo',
    description: 'Complete sua primeira sessão de conversação.',
    icon: 'celebration',
  },
  {
    id: 'convo_10_minutes',
    name: 'Conversador Casual',
    description: 'Acumule 10 minutos de tempo de conversação.',
    icon: 'chat_bubble',
  },
  {
    id: 'convo_60_minutes',
    name: 'Fluente em Formação',
    description: 'Acumule 1 hora de tempo de conversação.',
    icon: 'groups',
  },
  {
    id: 'complete_5_goals',
    name: 'Mestre das Metas',
    description: 'Conclua 5 metas de estudo.',
    icon: 'task_alt',
  },
  {
    id: 'complete_1_lesson',
    name: 'Primeira Lição',
    description: 'Complete sua primeira aula guiada.',
    icon: 'school',
  },
  {
    id: 'complete_5_lessons',
    name: 'Estudante Dedicado',
    description: 'Complete 5 aulas guiadas.',
    icon: 'history_edu',
  },
];
