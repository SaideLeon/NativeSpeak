/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionResponseScheduling } from '@google/genai';
import { FunctionCall } from './state';

export const AVAILABLE_TOOLS: FunctionCall[] = [
  {
    name: 'start_return',
    description: 'Inicia o processo de devolução de um item, coletando os detalhes necessários do usuário.',
    parameters: {
      type: 'OBJECT',
      properties: {
        orderId: {
          type: 'STRING',
          description: 'O ID do pedido que contém o item a ser devolvido.',
        },
        itemName: {
          type: 'STRING',
          description: 'O nome do item que o usuário deseja devolver.',
        },
        reason: {
          type: 'STRING',
          description: 'O motivo pelo qual o usuário está devolvendo o item.',
        },
      },
      required: ['orderId', 'itemName', 'reason'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_order_status',
    description: 'Fornece o status atual do pedido de um usuário, pesquisando pelo ID do pedido ou detalhes do cliente.',
    parameters: {
      type: 'OBJECT',
      properties: {
        orderId: {
          type: 'STRING',
          description: 'O ID do pedido a ser verificado. Peça por isso primeiro.',
        },
        customerName: {
          type: 'STRING',
          description: 'O nome do cliente, se o ID do pedido não estiver disponível.',
        },
        customerEmail: {
          type: 'STRING',
          description: 'O e-mail do cliente, se o ID do pedido não estiver disponível.',
        },
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'speak_to_representative',
    description: 'Escalona a conversa para um representante de suporte humano.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reason: {
          type: 'STRING',
          description: 'Um breve resumo do problema do usuário para o representante.',
        },
      },
      required: ['reason'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];
