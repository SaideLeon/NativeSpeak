/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const navigationSystemTools: FunctionCall[] = [
  {
    name: 'find_route',
    description: 'Encontra uma rota para um destino especificado.',
    parameters: {
      type: 'OBJECT',
      properties: {
        destination: {
          type: 'STRING',
          description: 'O endereço ou ponto de referência de destino.',
        },
        modeOfTransport: {
          type: 'STRING',
          description: 'O modo de transporte (ex: dirigir, caminhar, pedalar).',
        },
      },
      required: ['destination'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'find_nearby_places',
    description: 'Encontra lugares próximos de um determinado tipo.',
    parameters: {
      type: 'OBJECT',
      properties: {
        placeType: {
          type: 'STRING',
          description: 'O tipo de lugar a ser procurado (ex: restaurante, posto de gasolina, parque).',
        },
        radius: {
          type: 'NUMBER',
          description: 'O raio de busca em quilômetros.',
        },
      },
      required: ['placeType'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_traffic_info',
    description: 'Obtém informações de trânsito em tempo real para um local especificado.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: {
          type: 'STRING',
          description: 'O local para obter informações de trânsito.',
        },
      },
      required: ['location'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];
