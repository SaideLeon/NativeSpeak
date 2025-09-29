/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef, useState, useCallback } from 'react';
import WelcomeScreen from '../welcome-screen/WelcomeScreen';
import {
  LiveConnectConfig,
  Modality,
  LiveServerContent,
  GoogleGenAI,
  Type,
} from '@google/genai';

import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import {
  useSettings,
  useLogStore,
  useTools,
  ConversationTurn,
  useUI,
  PronunciationFeedback,
} from '@/lib/state';
import { useTodoStore } from '../../../lib/todoStore';
import { useAuthStore } from '../../../lib/authStore';
import { encodeWAV } from '@/lib/utils';
import PronunciationFeedbackDisplay from '@/components/PronunciationFeedback';

const formatTimestamp = (date: Date) => {
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const renderContent = (text: string) => {
  // Split by ```json...``` code blocks
  const parts = text.split(/(`{3}json\n[\s\S]*?\n`{3})/g);

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
      return boldPart;
    });
  });
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export default function StreamingConsole() {
  const { client, setConfig } = useLiveAPIContext();
  const { systemPrompt, voice } = useSettings();
  const { tools } = useTools();
  const { todos } = useTodoStore();
  const { user } = useAuthStore();
  const {
    turns,
    getAndClearAudioChunks,
    updateLastTurn,
    addTurn,
    updateTurn,
  } = useLogStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setSubtitleText } = useUI();
  const subtitleTimeoutRef = useRef<number | null>(null);

  // Effect to manage subtitles based on conversation turns
  useEffect(() => {
    const lastTurn = turns[turns.length - 1];

    if (subtitleTimeoutRef.current) {
      clearTimeout(subtitleTimeoutRef.current);
      subtitleTimeoutRef.current = null;
    }

    if (lastTurn && lastTurn.role === 'agent' && lastTurn.text) {
      setSubtitleText(lastTurn.text);

      if (lastTurn.isFinal) {
        subtitleTimeoutRef.current = window.setTimeout(() => {
          setSubtitleText('');
        }, 3000);
      }
    } else {
      setSubtitleText('');
    }
  }, [turns, setSubtitleText]);

  // Set the configuration for the Live API
  useEffect(() => {
    const enabledTools = tools
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
      context +=
        'Use as informações a seguir para personalizar a conversação, oferecer motivação e saudações contextuais.\n';

      if (hasTimeInfo) {
        const startDate = new Date(user!.studyStartDate);
        const now = new Date();
        const formattedStartDate = startDate.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const formattedCurrentDateTime = now.toLocaleString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        context += `\n- Data de início dos estudos: ${formattedStartDate}`;
        context += `\n- Data e hora atuais: ${formattedCurrentDateTime}\n`;
      }

      if (hasGoals) {
        if (inProgressTasks.length > 0) {
          context +=
            '\nMetas em progresso (foco atual):\n' +
            inProgressTasks.join('\n') +
            '\n';
        }
        if (completedTasks.length > 0) {
          context +=
            '\nMetas concluídas recentemente (celebre estas conquistas):\n' +
            completedTasks.join('\n') +
            '\n';
        }
      }

      context += '--- FIM DAS INFORMAÇÕES CONTEXTUAIS ---';
    }

    const fullSystemPrompt = systemPrompt + context;

    const config: LiveConnectConfig = {
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
      tools: enabledTools,
    };

    setConfig(config);
  }, [setConfig, systemPrompt, tools, voice, todos, user]);

  const handleCheckPronunciation = useCallback(
    async (turnIndex: number) => {
      const turn = turns[turnIndex];
      if (!turn || !turn.audioData || !turn.text) return;

      updateTurn(turnIndex, { isAnalyzing: true });

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/wav',
                  data: turn.audioData,
                },
              },
              {
                text: `Analise a pronúncia do áudio em inglês com base no texto fornecido. Texto: "${turn.text}". Forneça feedback apenas sobre a pronúncia, não sobre gramática ou tom.`,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallScore: {
                  type: Type.NUMBER,
                  description:
                    'Pontuação geral de pronúncia de 0 a 100, onde 100 é perfeito.',
                },
                words: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      accuracyScore: {
                        type: Type.NUMBER,
                        description:
                          'Pontuação de precisão para a palavra de 0 a 100.',
                      },
                      feedback: {
                        type: Type.STRING,
                        description:
                          'Feedback específico para esta palavra se for pronunciada incorretamente (por exemplo, qual fonema estava incorreto). Seja conciso.',
                      },
                    },
                    required: ['word', 'accuracyScore'],
                  },
                },
              },
              required: ['overallScore', 'words'],
            },
          },
        });

        const feedback = JSON.parse(
          response.text.trim()
        ) as PronunciationFeedback;
        updateTurn(turnIndex, {
          pronunciationFeedback: feedback,
          isAnalyzing: false,
        });
      } catch (error) {
        console.error('Error analyzing pronunciation:', error);
        updateTurn(turnIndex, {
          pronunciationFeedback: {
            error: 'Não foi possível analisar a pronúncia.',
          },
          isAnalyzing: false,
        });
      }
    },
    [turns, updateTurn]
  );

  useEffect(() => {
    const handleInputTranscription = async (text: string, isFinal: boolean) => {
      const currentTurns = useLogStore.getState().turns;
      const last = currentTurns[currentTurns.length - 1];
      const update: Partial<ConversationTurn> = {
        isFinal,
      };

      if (last && last.role === 'user' && !last.isFinal) {
        update.text = last.text + text;
      } else {
        update.text = text;
      }

      if (isFinal) {
        const audioChunks = getAndClearAudioChunks();
        if (audioChunks.length > 0) {
          const totalLength = audioChunks.reduce(
            (acc, val) => acc + val.byteLength,
            0
          );
          const concatenated = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of audioChunks) {
            concatenated.set(new Uint8Array(chunk), offset);
            offset += chunk.byteLength;
          }
          const pcm16Data = new Int16Array(concatenated.buffer);
          const wavBase64 = await encodeWAV(pcm16Data, 16000, 1);
          update.audioData = wavBase64;
        }
      }

      if (last && last.role === 'user' && !last.isFinal) {
        updateLastTurn(update);
      } else {
        addTurn({ role: 'user', ...update, text: update.text || '' });
      }
    };

    const handleOutputTranscription = (text: string, isFinal: boolean) => {
      const currentTurns = useLogStore.getState().turns;
      const last = currentTurns[currentTurns.length - 1];
      if (last && last.role === 'agent' && !last.isFinal) {
        updateLastTurn({
          text: last.text + text,
          isFinal,
        });
      } else {
        addTurn({ role: 'agent', text, isFinal });
      }
    };

    const handleContent = (serverContent: LiveServerContent) => {
      const text =
        serverContent.modelTurn?.parts
          ?.map((p: any) => p.text)
          .filter(Boolean)
          .join(' ') ?? '';
      const groundingChunks = serverContent.groundingMetadata?.groundingChunks;

      if (!text && !groundingChunks) return;
      const currentTurns = useLogStore.getState().turns;
      const last = currentTurns[currentTurns.length - 1];

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
      const currentTurns = useLogStore.getState().turns;
      const last = currentTurns[currentTurns.length - 1];
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
  }, [client, getAndClearAudioChunks, addTurn, updateLastTurn]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  return (
    <div className="transcription-container">
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
                {t.isGeneratingImage && (
                  <div className="image-loader">
                    <div className="spinner"></div>
                    <span className="loader-text">{t.text}</span>
                  </div>
                )}
                {t.imageUrl && (
                  <img
                    src={t.imageUrl}
                    alt="Conteúdo gerado por IA"
                    className="generated-image"
                  />
                )}
                {t.text && (
                  <div className="transcription-text-content">
                    {renderContent(t.text)}
                  </div>
                )}
                {t.groundingChunks && t.groundingChunks.length > 0 && (
                  <div className="grounding-chunks">
                    <strong>Fontes:</strong>
                    <ul>
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

              <div className="transcription-meta">
                <div className="transcription-timestamp">
                  {formatTimestamp(t.timestamp)}
                </div>
                {t.role === 'user' && t.isFinal && t.audioData && (
                  <button
                    className="pronunciation-button"
                    onClick={() => handleCheckPronunciation(i)}
                    disabled={t.isAnalyzing || !!t.pronunciationFeedback}
                    title="Analisar pronúncia"
                  >
                    <span className="icon">
                      {t.isAnalyzing ? 'progress_activity' : 'rule'}
                    </span>
                  </button>
                )}
              </div>
              {t.pronunciationFeedback && (
                <PronunciationFeedbackDisplay
                  feedback={t.pronunciationFeedback}
                  originalText={t.text}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}