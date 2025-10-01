/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import './LessonsPage.css';
import { englishLessons, Lesson } from '../lib/englishLessons';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { useSettings } from '../lib/state';
import cn from 'classnames';

const SYSTEM_API_KEY = process.env.API_KEY as string;

interface Exercise {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

const ExerciseGenerator: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswerIndex, setUserAnswerIndex] = useState<number | null>(null);
  const { geminiApiKey } = useSettings();

  const isAnswered = userAnswerIndex !== null;
  const isCorrect = isAnswered && userAnswerIndex === exercise?.correctAnswerIndex;

  const generateExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setExercise(null);
    setUserAnswerIndex(null);

    const prompt = `
      Based on the common English mistake of saying "${lesson.mistake}" instead of "${lesson.correction}", create a multiple-choice quiz question to test a user's understanding.
      The question should present a sentence with a blank (represented by "...") or a short scenario.
      The options must include both the incorrect and correct forms, plus one or two other plausible but incorrect distractors if possible.
      Ensure the options are distinct and relevant.
      The response must be in JSON format.
      The entire conversation must be in Brazilian Portuguese.

      Example for "${lesson.mistake}":
      - Question: "A: Is she coming to the party? B: I think ...."
      - Options: ["yes", "so", "is"]
      - Correct Answer Index: 1

      Now, generate a new question for the mistake: "${lesson.mistake}".
    `;

    try {
      const activeApiKey = geminiApiKey || SYSTEM_API_KEY;
      const ai = new GoogleGenAI({ apiKey: activeApiKey });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
            },
            required: ['question', 'options', 'correctAnswerIndex'],
          },
        },
      });

      const result = JSON.parse(response.text) as Exercise;
      setExercise(result);
    } catch (err) {
      console.error('Error generating exercise:', err);
      setError('Não foi possível gerar o exercício. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [lesson, geminiApiKey]);

  const handleAnswer = (index: number) => {
    if (!isAnswered) {
      setUserAnswerIndex(index);
    }
  };

  return (
    <div className="exercise-section">
      <div className="exercise-header">
        <h3><span className="icon">quiz</span> Pratique o que você aprendeu</h3>
        <button
          onClick={generateExercise}
          disabled={isLoading}
          className={cn('generate-exercise-button', { loading: isLoading })}
        >
          <span className="icon">refresh</span>
          {exercise ? 'Gerar Outro Exercício' : 'Gerar Exercício'}
        </button>
      </div>
      {error && <p className="exercise-feedback incorrect">{error}</p>}
      {isLoading && <p>Gerando exercício com IA...</p>}
      {exercise && (
        <div className="exercise-content">
          <p className="exercise-question">{exercise.question}</p>
          <div className="exercise-options">
            {exercise.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={cn('option-button', {
                  correct: isAnswered && index === exercise.correctAnswerIndex,
                  incorrect: isAnswered && index === userAnswerIndex && !isCorrect,
                })}
              >
                {option}
              </button>
            ))}
          </div>
          {isAnswered && (
            <div className={cn('exercise-feedback', { correct: isCorrect, incorrect: !isCorrect })}>
              {isCorrect ? 'Correto! Ótimo trabalho!' : `Não exatamente. A resposta correta é "${exercise.options[exercise.correctAnswerIndex]}".`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LessonsPage: React.FC = () => {
  return (
    <div className="lessons-page">
      <h1>Aulas e Exercícios</h1>
      <p>Aprenda a evitar erros comuns que muitos estudantes de inglês cometem e soe mais natural.</p>
      <div className="lessons-grid">
        {englishLessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <h2>{lesson.title}</h2>
            <div className="lesson-section">
              <h3>O erro comum</h3>
              <div className="mistake-correction-box">
                <div className="mistake-box">
                  <p>{lesson.mistake}</p>
                </div>
                <div className="correction-box">
                  <p>{lesson.correction}</p>
                </div>
              </div>
            </div>
            <div className="lesson-section">
              <h3>Por que isso acontece?</h3>
              <p>{lesson.explanation}</p>
            </div>
            <div className="lesson-section">
                <h3>Exemplos</h3>
                <div className="example-grid">
                    {lesson.examples.map((ex, index) => (
                        <React.Fragment key={index}>
                            <div className="example-wrong">{ex.wrong}</div>
                            <div className="example-right">{ex.right}</div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {lesson.extraNotes && (
                <div className="lesson-section">
                    <h3>Nota Extra</h3>
                    <p className="extra-notes">{lesson.extraNotes}</p>
                </div>
            )}
            <ExerciseGenerator lesson={lesson} />
          </div>
        ))}
      </div>
      <div className="lessons-attribution">
        <p>
          Parte do material e dos exemplos apresentados neste exercício foram
          adaptados a partir das aulas disponibilizadas no canal{' '}
          <a
            href="https://youtu.be/mOxeT2_0t2s?si=xQ035y93rUK1-cO5"
            target="_blank"
            rel="noopener noreferrer"
          >
            English with Lucy
          </a>
          , que oferece recursos valiosos para o aprendizado de inglês.
        </p>
      </div>
    </div>
  );
};

export default LessonsPage;