/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionResponseScheduling } from '@google/genai';
import { FunctionCall } from '../state';

export const customerSupportTools: FunctionCall[] = [
  {
    name: 'generate_image_for_vocabulary',
    description:
      'Gera uma imagem para ajudar a ensinar um novo vocabulário. Use isso para substantivos visuais (frutas, animais, objetos).',
    parameters: {
      type: 'OBJECT',
      properties: {
        prompt: {
          type: 'STRING',
          description:
            'Um prompt descritivo em inglês para a imagem a ser gerada (ex: "a photograph of a pineapple", "an illustration of a friendly lion").',
        },
      },
      required: ['prompt'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
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
];