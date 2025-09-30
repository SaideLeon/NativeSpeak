/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionResponseScheduling } from '@google/genai';
import { FunctionCall } from '../state';

export const customerSupportTools: FunctionCall[] = [
  {
    name: 'get_word_definition',
    description:
      'Busca a definição de uma palavra em inglês e a traduz para o português. Útil para quando o aluno não conhece uma palavra.',
    parameters: {
      type: 'OBJECT',
      properties: {
        word: {
          type: 'STRING',
          description: 'A palavra em inglês para definir.',
        },
      },
      required: ['word'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_usage_examples',
    description:
      'Fornece 2-3 frases de exemplo mostrando como uma palavra em inglês é usada em diferentes contextos.',
    parameters: {
      type: 'OBJECT',
      properties: {
        word: {
          type: 'STRING',
          description: 'A palavra em inglês para a qual obter exemplos.',
        },
      },
      required: ['word'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'translate_phrase',
    description:
      'Traduz uma frase curta do português para o inglês, ou do inglês para o português.',
    parameters: {
      type: 'OBJECT',
      properties: {
        phrase: {
          type: 'STRING',
          description: 'A frase a ser traduzida.',
        },
        targetLanguage: {
          type: 'STRING',
          description: "O idioma para o qual traduzir ('inglês' ou 'português').",
        },
      },
      required: ['phrase', 'targetLanguage'],
    },
    isEnabled: false, // Desabilitado por padrão para evitar confusão
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];