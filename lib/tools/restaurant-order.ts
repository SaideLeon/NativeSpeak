/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionResponseScheduling } from '@google/genai';
import { FunctionCall } from '../state';

export const restaurantOrderTools: FunctionCall[] = [
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
    name: 'place_order',
    description: 'Faz um pedido de itens do menu para a cozinha.',
    parameters: {
      type: 'OBJECT',
      properties: {
        items: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              itemName: {
                type: 'STRING',
                description: 'O nome do item do menu a ser pedido.',
              },
              quantity: {
                type: 'NUMBER',
                description: 'A quantidade do item a ser pedida.',
              },
              specialRequests: {
                type: 'STRING',
                description:
                  'Quaisquer modificações ou pedidos especiais para o item (ex: "sem cebola").',
              },
            },
            required: ['itemName', 'quantity'],
          },
        },
      },
      required: ['items'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_menu_specials',
    description: 'Consulta as especialidades do dia ou promoções atuais.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'request_bill',
    description: 'Solicita a conta da mesa.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];
