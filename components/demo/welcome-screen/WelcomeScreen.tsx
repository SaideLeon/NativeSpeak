/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './WelcomeScreen.css';
import { useTools, Template } from '../../../lib/state';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';

// Conteúdo re-tematizado para cenários de aprendizado de inglês, mas usando as chaves de template existentes.
const welcomeContent: Record<
  Template,
  { title: string; description: string; prompts: string[] }
> = {
  'customer-support': {
    title: 'Conversa do Dia a Dia',
    description: 'Pratique interações sociais comuns e conversas diárias.',
    prompts: [
      'How was your weekend?',
      "Let's talk about our hobbies.",
      'What kind of music do you like?',
    ],
  },
  'personal-assistant': {
    title: 'Prática para Entrevista de Emprego',
    description:
      'Prepare-se para entrevistas profissionais e responda a perguntas comuns.',
    prompts: [
      'Tell me about yourself.',
      'What are your biggest strengths?',
      'Do you have any questions for me?',
    ],
  },
  'navigation-system': {
    title: 'Viagens e Direções',
    description: 'Pratique pedir informações e se locomover em uma cidade nova.',
    prompts: [
      'How do I get to the museum?',
      'Excuse me, where is the nearest subway station?',
      "I'd like to book a table for two.",
    ],
  },
  'business-meeting': {
    title: 'Reunião de Negócios',
    description: 'Simule uma reunião de negócios, discuta projetos e negocie.',
    prompts: [
      "Let's start the meeting.",
      'What are your thoughts on the quarterly report?',
      "I'd like to propose a new strategy.",
    ],
  },
  'restaurant-order': {
    title: 'Pedir Comida em Restaurante',
    description:
      'Pratique como pedir comida, fazer perguntas sobre o menu e pagar a conta.',
    prompts: [
      'A table for two, please.',
      'What do you recommend?',
      'Can I have the check, please?',
    ],
  },
};

const WelcomeScreen: React.FC = () => {
  const { template, setTemplate } = useTools();
  const { connected } = useLiveAPIContext();
  const { description, prompts } = welcomeContent[template];
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="title-container">
          <span className="welcome-icon">mic</span>
          <div className="title-selector">
            <select
              value={template}
              onChange={e => setTemplate(e.target.value as Template)}
              aria-label="Selecione um cenário de prática"
              disabled={connected}
              title={
                connected
                  ? 'Desconecte para alterar o cenário'
                  : 'Selecione um cenário de prática'
              }
            >
              {Object.entries(welcomeContent).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.title}
                </option>
              ))}
            </select>
            <span className="icon">arrow_drop_down</span>
          </div>
        </div>
        <p>{description}</p>
        <div className="example-prompts">
          {prompts.map((prompt, index) => (
            <div key={index} className="prompt">
              {prompt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;