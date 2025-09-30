/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef } from 'react';
import WelcomeScreen from '../welcome-screen/WelcomeScreen';
// FIX: Import LiveServerContent to correctly type the content handler.
import { LiveConnectConfig, Modality, LiveServerContent } from '@google/genai';
import cn from 'classnames';

import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import {
  useSettings,
  useLogStore,
  useTools,
  ConversationTurn,
} from '@/lib/state';
import { useTodoStore } from '../../../lib/todoStore';
import { useAuthStore } from '../../../lib/authStore';
import { useLearningStore } from '../../../lib/learningStore';
import { getCurrentLessonState } from '../../../lib/lessons';

const formatTimestamp = (date: Date) => {
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const renderContent = (text: string) => {
  // Remove the auto-advance command before rendering
  const cleanText = text.replace(/\[PROXIMO_PASSO\]/g, '');

  // Split by ```json...``` code blocks
  const parts = cleanText.split(/(`{3}json\n[\s\S]*?\n`{3})/g);

  return parts.map((part, index) => {
    if (part.startsWith('```json')) {
      const jsonContent = part.replace(/^`{3}json\n|`{3}$/g, '');
      return (
        <pre key={index}>
          <code>{jsonContent}</code>
        </pre>
      );
    }

    // Split by **bold** text
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((boldPart, boldIndex) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        return <strong key={boldIndex}>{boldPart.slice(2, -2)}</strong>;
      }
      // Split by lists
      const listParts = boldPart.split(/(\n\s*\d+\.\s.*)/g);
      return listParts.map((listPart, listIndex) => {
        if (listPart.match(/^\n\s*\d+\.\s/)) {
            return <div key={listIndex} style={{paddingLeft: '20px'}}>{listPart.trim()}</div>
        }
        return listPart;
      });
    });
  });
};


export default function StreamingConsole() {
  const { client, setConfig } = useLiveAPIContext();
  const { systemPrompt, voice, useWebSearch } = useSettings();
  const { tools } = useTools();
  const { todos } = useTodoStore();
  const { user } = useAuthStore();
  const turns = useLogStore(state => state.turns);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    mode,
    lessonTopic,
    progress,
    goToStep,
    continuationPrompt,
    clearContinuationPrompt,
  } = useLearningStore();
  const currentStep = progress[lessonTopic]?.currentStep ?? 1;
  const lastProcessedTurnRef = useRef<string | null>(null);


  // Effect to automatically advance to the next step in guided lessons
  useEffect(() => {
    const lastTurn = turns[turns.length - 1];

    // Check when the agent's turn is fully complete
    if (
      mode === 'guided' &&
      lastTurn &&
      lastTurn.role === 'agent' &&
      lastTurn.isFinal
    ) {
      const turnId = lastTurn.timestamp.toISOString();
      // Ensure we only process each final turn once
      if (lastProcessedTurnRef.current !== turnId) {
        if (lastTurn.text.includes('[PROXIMO_PASSO]')) {
          lastProcessedTurnRef.current = turnId; // Mark as processed immediately
          // A small delay gives the user time to read the last message
          const timer = setTimeout(() => {
            goToStep(currentStep + 1);
          }, 1200); // 1.2-second delay for better UX
          return () => clearTimeout(timer);
        }
      }
    }
  }, [turns, mode, goToStep, currentStep]);


  // Set the configuration for the Live API
  useEffect(() => {
    let finalTools: any; // Use `any` to accommodate both tool types

    if (useWebSearch) {
      finalTools = [{ googleSearch: {} }];
    } else {
      finalTools = tools
        .filter(tool => tool.isEnabled)
        .map(tool => ({
          functionDeclarations: [
            {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters,
            },
          ],
        }));
    }

    let context = '';
    const inProgressTasks = todos
      .filter(t => t.status === 'inProgress' && !t.isHeader)
      .map(t => `- ${t.text}`);
    const completedTasks = todos
      .filter(t => t.status === 'completed' && !t.isHeader)
      .map(t => `- ${t.text}`);

    const hasGoals = inProgressTasks.length > 0 || completedTasks.length > 0;
    const hasTimeInfo = user && user.studyStartDate;

    if (hasGoals || hasTimeInfo) {
        context += '\n\n--- INFORMAÇÕES CONTEXTUAIS DO ALUNO ---\n';
        context += 'Use as informações a seguir para personalizar a conversação, oferecer motivação e saudações contextuais.\n';

        if (hasTimeInfo) {
            const startDate = new Date(user!.studyStartDate);
            const now = new Date();
            const formattedStartDate = startDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
            const formattedCurrentDateTime = now.toLocaleString('pt-BR', {
                year: 'numeric', month: 'long', day: 'numeric', 
                hour: '2-digit', minute: '2-digit',
            });
            context += `\n- Data de início dos estudos: ${formattedStartDate}`;
            context += `\n- Data e hora atuais: ${formattedCurrentDateTime}\n`;
        }

        if (hasGoals) {
            if (inProgressTasks.length > 0) {
                context += '\nMetas em progresso (foco atual):\n' + inProgressTasks.join('\n') + '\n';
            }
            if (completedTasks.length > 0) {
                context += '\nMetas concluídas recentemente (celebre estas conquistas):\n' + completedTasks.join('\n') + '\n';
            }
        }

        context += '--- FIM DAS INFORMAÇÕES CONTEXTUAIS ---';
    }
    
    let activeSystemPrompt: string;

    if (mode === 'guided') {
      const lessonState = getCurrentLessonState(lessonTopic, currentStep);
      activeSystemPrompt = lessonState.systemPrompt;
    } else {
      activeSystemPrompt = systemPrompt;
    }


    let fullSystemPrompt = activeSystemPrompt;

    if (continuationPrompt) {
      fullSystemPrompt = `${continuationPrompt}\n\n---\n\n${activeSystemPrompt}`;
      clearContinuationPrompt();
    }
    
    fullSystemPrompt += context;


    // Using `any` for config to accommodate `speechConfig`, which is not in the
    // current TS definitions but is used in the working reference example.
    const config: any = {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice,
          },
        },
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      systemInstruction: {
        parts: [
          {
            text: fullSystemPrompt,
          },
        ],
      },
      tools: finalTools,
    };

    setConfig(config);
  }, [setConfig, systemPrompt, tools, voice, todos, user, mode, lessonTopic, currentStep, useWebSearch, continuationPrompt, clearContinuationPrompt]);

  useEffect(() => {
    const { addTurn, updateLastTurn } = useLogStore.getState();

    const handleInputTranscription = (text: string, isFinal: boolean) => {
      const turns = useLogStore.getState().turns;
      const last = turns[turns.length - 1];
      if (last && last.role === 'user' && !last.isFinal) {
        updateLastTurn({
          text: last.text + text,
          isFinal,
        });
      } else {
        addTurn({ role: 'user', text, isFinal });
      }
    };

    const handleOutputTranscription = (text: string, isFinal: boolean) => {
      const turns = useLogStore.getState().turns;
      const last = turns[turns.length - 1];
      if (last && last.role === 'agent' && !last.isFinal) {
        updateLastTurn({
          text: last.text + text,
          isFinal,
        });
      } else {
        addTurn({ role: 'agent', text, isFinal });
      }
    };

    // FIX: The 'content' event provides a single LiveServerContent object.
    // The function signature is updated to accept one argument, and groundingMetadata is extracted from it.
    const handleContent = (serverContent: LiveServerContent) => {
      const text =
        serverContent.modelTurn?.parts
          ?.map((p: any) => p.text)
          .filter(Boolean)
          .join(' ') ?? '';
      const groundingChunks = serverContent.groundingMetadata?.groundingChunks;

      if (!text && !groundingChunks) return;

      const turns = useLogStore.getState().turns;
      // FIX: Property 'at' does not exist on type 'ConversationTurn[]'. Replaced with bracket notation.
      const last = turns[turns.length - 1];

      if (last?.role === 'agent' && !last.isFinal) {
        const updatedTurn: Partial<ConversationTurn> = {
          text: last.text + text,
        };
        if (groundingChunks) {
          updatedTurn.groundingChunks = [
            ...(last.groundingChunks || []),
            ...groundingChunks,
          ];
        }
        updateLastTurn(updatedTurn);
      } else {
        addTurn({ role: 'agent', text, isFinal: false, groundingChunks });
      }
    };

    const handleTurnComplete = () => {
      const turns = useLogStore.getState().turns;
      // FIX: Property 'at' does not exist on type 'ConversationTurn[]'. Replaced with bracket notation.
      const last = turns[turns.length - 1];
      if (last && !last.isFinal) {
        updateLastTurn({ isFinal: true });
      }
    };

    client.on('inputTranscription', handleInputTranscription);
    client.on('outputTranscription', handleOutputTranscription);
    client.on('content', handleContent);
    client.on('turncomplete', handleTurnComplete);

    return () => {
      client.off('inputTranscription', handleInputTranscription);
      client.off('outputTranscription', handleOutputTranscription);
      client.off('content', handleContent);
      client.off('turncomplete', handleTurnComplete);
    };
  }, [client]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  return (
    <>
      <div
        className={cn('transcription-container', {
          'is-welcome': turns.length === 0,
        })}
      >
        {turns.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="transcription-view" ref={scrollRef}>
            {turns.map((t, i) => (
              <div
                key={i}
                className={`transcription-entry ${t.role} ${
                  !t.isFinal ? 'interim' : ''
                }`}
              >
                <div className="transcription-source">
                  {t.role === 'user'
                    ? 'Você'
                    : t.role === 'agent'
                    ? 'Tutor'
                    : 'Sistema'}
                </div>
                <div className="message-bubble">
                  <div className="transcription-text-content">
                    {renderContent(t.text)}
                  </div>
                  {t.groundingChunks && t.groundingChunks.length > 0 && (
                    <div className="grounding-chunks">
                      <strong>Fontes:</strong>
                      <ul>
                        {/* FIX: Filter for chunks that have a web property with a valid URI. */}
                        {t.groundingChunks
                          .filter(chunk => chunk.web && chunk.web.uri)
                          .map((chunk, index) => (
                            <li key={index}>
                              <a
                                href={chunk.web!.uri!}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {chunk.web!.title || chunk.web!.uri}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="transcription-timestamp">
                  {formatTimestamp(t.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {mode === 'guided' && (
        <div className="guided-nav">
          <button
            className="nav-button"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep <= 1}
            title="Passo Anterior"
          >
            <span className="icon">arrow_back</span>
            <span className="nav-button-text">Anterior</span>
          </button>
          <span className="step-indicator">Passo {currentStep} / 5</span>
          <button
            className="nav-button"
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep >= 5}
            title="Próximo Passo"
          >
            <span className="nav-button-text">Próximo</span>
            <span className="icon">arrow_forward</span>
          </button>
        </div>
      )}
    </>
  );
}