/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './WelcomeScreen.css';
import { useTools, Scenario } from '../../../lib/state';
import {
  useLearningStore,
  LessonTopic,
} from '../../../lib/learningStore';

// Re-themed content for English learning scenarios, but using existing template keys.
const conversationContent: Record<
  Scenario,
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
};

const guidedContent: Record<
  LessonTopic,
  { title: string; description: string; prompts: string[] }
> = {
  'ordering-food': {
    title: 'Pedindo Comida',
    description:
      'Aprenda vocabulário e frases essenciais para pedir em um restaurante.',
    prompts: [
      "I'd like to order...",
      'Could I have the check?',
      'Appetizer, Main Course, Dessert',
    ],
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
  },
};

const WelcomeScreen: React.FC = () => {
  const { template, setTemplate } = useTools();
  const { mode, lessonTopic, setMode, setLessonTopic } = useLearningStore();

  const isConversationMode = mode === 'conversation';

  const { title, description, prompts } = isConversationMode
    ? conversationContent[template]
    : guidedContent[lessonTopic];

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <span className="welcome-icon">mic</span>

        <div className="mode-selector">
          <button
            className={isConversationMode ? 'active' : ''}
            onClick={() => setMode('conversation')}
          >
            Prática de Conversa
          </button>
          <button
            className={!isConversationMode ? 'active' : ''}
            onClick={() => setMode('guided')}
          >
            Aula Guiada
          </button>
        </div>

        <div className="title-container">
          <div className="title-selector">
            {isConversationMode ? (
              <select
                value={template}
                onChange={e => setTemplate(e.target.value as Scenario)}
                aria-label="Selecione um cenário de prática"
              >
                <option value="customer-support">Conversa do Dia a Dia</option>
                <option value="personal-assistant">
                  Entrevista de Emprego
                </option>
                <option value="navigation-system">Viagens e Direções</option>
              </select>
            ) : (
              <select
                value={lessonTopic}
                onChange={e => setLessonTopic(e.target.value as LessonTopic)}
                aria-label="Selecione um tópico de aula"
              >
                <option value="ordering-food">Pedindo Comida</option>
                <option value="job-interview-basics">
                  Básico de Entrevista
                </option>
                <option value="travel-and-directions">
                  Viagens e Direções
                </option>
              </select>
            )}
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