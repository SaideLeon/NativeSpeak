/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import './WelcomeScreen.css';
import { useTools, Scenario, useLogStore } from '../../../lib/state';
import { useLearningStore, LessonTopic } from '../../../lib/learningStore';
import { lessons } from '../../../lib/lessons';
import { useEvaluationStore } from '../../../lib/evaluationStore';
import MarkdownRenderer from '../../MarkdownRenderer';

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
  'soccer': {
    title: 'Futebol',
    description: 'Discuta sobre seu time favorito, jogadores e as últimas partidas.',
    prompts: ["What's your favorite team?", "Who is the best player?", "Let's talk about the World Cup."],
  },
  'technology': {
    title: 'Tecnologia',
    description: 'Fale sobre os últimos gadgets, inovações e o futuro da tecnologia.',
    prompts: ["What's your favorite gadget?", "Let's talk about AI.", "What technology excites you?"],
  },
  'artificial-intelligence': {
    title: 'Inteligência Artificial',
    description: 'Converse sobre os avanços, ética e o futuro da IA.',
    prompts: ["Is AI dangerous?", "How will AI change our jobs?", "What are neural networks?"],
  },
  'digital-marketing': {
    title: 'Marketing Digital',
    description: 'Pratique vocabulário de SEO, mídias sociais e estratégias de conteúdo.',
    prompts: ["What is SEO?", "Let's discuss a social media strategy.", "How to increase engagement?"],
  },
  'robotic-automation': {
    title: 'Automação Robótica',
    description: 'Fale sobre como robôs e automação estão mudando as indústrias.',
    prompts: ["Are robots taking our jobs?", "What is industrial automation?", "Let's talk about robotics."],
  },
  'meditation': {
    title: 'Meditação',
    description: 'Converse sobre os benefícios da meditação e técnicas de mindfulness.',
    prompts: ["Do you practice mindfulness?", "What are the benefits of meditation?", "How to start meditating?"],
  },
  'religion': {
    title: 'Religião',
    description: 'Conduza uma conversa respeitosa sobre diferentes crenças e espiritualidade.',
    prompts: ["What is the role of faith?", "Let's talk about different beliefs.", "What is spirituality?"],
  },
  'holy-bible': {
    title: 'Bíblia Sagrada',
    description: 'Converse sobre histórias, personagens e ensinamentos da Bíblia.',
    prompts: ["Tell me a parable.", "Who is your favorite character?", "What is the Old Testament?"],
  },
  'quran': {
    title: 'Alcorão',
    description: 'Discuta os ensinamentos, histórias e a importância do Alcorão.',
    prompts: ["What is a surah?", "Tell me about the Prophet.", "What are the pillars of Islam?"],
  },
  'grammar': {
    title: 'Gramática',
    description: 'Tire dúvidas e pratique tópicos gramaticais específicos em inglês.',
    prompts: ["Explain the present perfect.", "When to use 'in', 'on', and 'at'?", "What are conditionals?"],
  },
  'verbs': {
    title: 'Verbos',
    description: 'Pratique o uso de "phrasal verbs" e diferentes tempos verbais.',
    prompts: ["What are phrasal verbs?", "Let's practice the past tense.", "Can you give examples of modal verbs?"],
  },
  'movies-and-tv-shows': {
    title: 'Cinema e Séries',
    description: 'Fale sobre seus filmes e séries favoritos, atores e diretores.',
    prompts: ["What's your favorite movie?", "Have you seen the latest episode?", "Who is the best director?"],
  },
  'cooking-and-gastronomy': {
    title: 'Culinária e Gastronomia',
    description: 'Converse sobre pratos favoritos, receitas, e diferentes cozinhas do mundo.',
    prompts: ["What's your favorite food?", "Can you share a recipe?", "Let's talk about Italian cuisine."],
  },
  'music': {
    title: 'Música',
    description: 'Converse sobre seus artistas, bandas e gêneros musicais favoritos.',
    prompts: ["Who is your favorite artist?", "What kind of music do you like?", "Let's go to a concert."],
  },
  'environment': {
    title: 'Meio Ambiente',
    description: 'Discuta temas como reciclagem, mudanças climáticas e sustentabilidade.',
    prompts: ["What is climate change?", "How can we be more sustainable?", "Let's talk about recycling."],
  },
  'health-and-wellness': {
    title: 'Saúde e Bem-estar',
    description: 'Converse sobre exercícios, alimentação saudável e saúde mental.',
    prompts: ["What's a healthy diet?", "How to reduce stress?", "Let's talk about mental health."],
  },
  'personal-finance': {
    title: 'Finanças Pessoais',
    description: 'Pratique falar sobre orçamento, investimentos e como economizar dinheiro.',
    prompts: ["How to create a budget?", "What are good investments?", "Let's talk about saving money."],
  },
  'world-history': {
    title: 'História Mundial',
    description: 'Discuta sobre seus períodos e eventos históricos favoritos.',
    prompts: ["Let's talk about Ancient Rome.", "What caused World War I?", "Who was a great leader?"],
  },
  'science-and-space': {
    title: 'Ciência e Espaço',
    description: 'Converse sobre descobertas científicas e exploração espacial.',
    prompts: ["Is there life on other planets?", "Let's talk about black holes.", "What's the latest scientific discovery?"],
  },
  'literature-and-books': {
    title: 'Literatura e Livros',
    description: 'Fale sobre seus livros, autores e gêneros literários favoritos.',
    prompts: ["Who is your favorite author?", "What book are you reading?", "Let's discuss classic literature."],
  },
  'fashion-and-style': {
    title: 'Moda e Estilo',
    description: 'Converse sobre tendências, estilistas e a importância da moda.',
    prompts: ["What are the latest trends?", "Who is your favorite designer?", "How to describe your style?"],
  }
};

const formatTimestamp = (date: Date) => {
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${hours}:${minutes}`;
};

const WelcomeScreen: React.FC = () => {
  const { template, setTemplate } = useTools();
  const { mode, lessonTopic, setMode, setLessonTopic, progress } =
    useLearningStore();
  const { lastEvaluation, lastConversationHistory, clearLastHistory } =
    useEvaluationStore();
  const { setTurns } = useLogStore();
  const [showRetryView, setShowRetryView] = useState(
    lastEvaluation?.rating === 'Péssima',
  );

  const handleLoadHistory = () => {
    if (lastConversationHistory) {
      setTurns(lastConversationHistory);
      clearLastHistory();
    }
  };

  if (showRetryView && lastEvaluation && lastConversationHistory) {
    return (
      <div className="welcome-screen retry-view">
        <div className="retry-content">
          <span className="welcome-icon">history</span>
          <h2>Revise e Tente Novamente</h2>
          <p>
            Sua última conversa foi avaliada como "Péssima". Use o feedback
            abaixo para melhorar e pratique o mesmo cenário novamente.
          </p>

          <div className="feedback-section">
            <h4>Feedback do Tutor</h4>
            <div className="feedback-text">
              <MarkdownRenderer text={lastEvaluation.feedback} />
            </div>
          </div>

          <div className="history-section">
            <h4>Histórico da Conversa Anterior</h4>
            <div className="conversation-history-display">
              {lastConversationHistory.map((t, i) => (
                <div key={i} className={`history-entry ${t.role}`}>
                  <span className="history-role">
                    {t.role === 'user' ? 'Você' : 'Tutor'}:
                  </span>
                  <span className="history-text">{t.text}</span>
                  <span className="history-timestamp">
                    {formatTimestamp(t.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="retry-actions">
            <button
              className="start-new-button"
              onClick={() => setShowRetryView(false)}
            >
              Entendido, Começar Nova Prática
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isConversationMode = mode === 'conversation';
  const { title, description, prompts } = isConversationMode
    ? conversationContent[template]
    : lessons[lessonTopic];

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <span className="welcome-icon">mic</span>

        {lastConversationHistory && (
          <div className="load-history-container">
            <button className="load-history-button" onClick={handleLoadHistory}>
              <span className="icon">history</span>
              Carregar última conversa
            </button>
          </div>
        )}

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
                {Object.entries(conversationContent).map(
                  ([scenarioKey, content]) => (
                    <option key={scenarioKey} value={scenarioKey}>
                      {content.title}
                    </option>
                  ),
                )}
              </select>
            ) : (
              <select
                value={lessonTopic}
                onChange={e => setLessonTopic(e.target.value as LessonTopic)}
                aria-label="Selecione um tópico de aula"
              >
                {Object.entries(lessons).map(([topic, details]) => {
                  const lessonProgress = progress[topic as LessonTopic];
                  const progressText = lessonProgress
                    ? ` (Passo ${lessonProgress.currentStep})`
                    : '';
                  return (
                    <option key={topic} value={topic}>
                      {details.title}
                      {progressText}
                    </option>
                  );
                })}
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
