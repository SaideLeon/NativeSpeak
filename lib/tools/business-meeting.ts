/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionResponseScheduling } from '@google/genai';
import { FunctionCall } from '../state';

export const businessMeetingTools: FunctionCall[] = [
  {
    name: 'get_current_time',
    description:
      'Obtém a hora atual exata para um local específico. Se nenhum local for fornecido, retorna a hora local.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: {
          type: 'STRING',
          description:
            'A cidade ou país para verificar a hora (ex: "Londres", "Japão").',
        },
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'schedule_follow_up',
    description: 'Agenda uma reunião de acompanhamento no calendário.',
    parameters: {
      type: 'OBJECT',
      properties: {
        topic: {
          type: 'STRING',
          description: 'O tópico ou assunto da reunião de acompanhamento.',
        },
        dateTime: {
          type: 'STRING',
          description: 'A data e hora da reunião no formato ISO 8601.',
        },
        attendees: {
          type: 'ARRAY',
          items: {
            type: 'STRING',
          },
          description: 'Uma lista de endereços de e-mail dos participantes.',
        },
      },
      required: ['topic', 'dateTime'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'assign_task',
    description: 'Atribui uma tarefa a um membro da equipe.',
    parameters: {
      type: 'OBJECT',
      properties: {
        assignee: {
          type: 'STRING',
          description: 'O nome ou e-mail da pessoa a quem a tarefa é atribuída.',
        },
        taskDescription: {
          type: 'STRING',
          description: 'Uma descrição clara da tarefa a ser concluída.',
        },
        dueDate: {
          type: 'STRING',
          description: 'A data de vencimento da tarefa no formato ISO 8601.',
        },
      },
      required: ['assignee', 'taskDescription'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];
