import { useState } from 'react';
import { useExercise } from '../../hooks/useCourseData';
import { useAuthStore } from '../../lib/authStore';
import type { SubmissionResult } from '../../types/course.types';
import styles from './ExerciseView.module.css';
import cn from 'classnames';

interface ExerciseViewProps {
  exerciseId: number;
  onBack: () => void;
}

export function ExerciseView({ exerciseId, onBack }: ExerciseViewProps) {
  const { exercise, loading, error } = useExercise(exerciseId);
  const { token } = useAuthStore();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (!exercise) return;

    try {
      const response = await fetch(`https://nativespeak.cognick.qzz.io/api/exercises/${exerciseId}/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          exercise_id: exerciseId,
          answers: answers,
          time_spent: 0, // TODO: track time spent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      const data = await response.json();
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando exercício...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!exercise) {
    return <div className={styles.error}>Exercício não encontrado.</div>;
  }

  if (submitted && result) {
    return (
      <div className={styles.exerciseView}>
        <div className={styles.resultSummary}>
          <h2>Resultado do Exercício</h2>
          <p>Pontuação Final: {result.score} de {result.max_score} ({result.percentage}%)</p>
        </div>
        <div className={styles.questionsList}>
          {exercise.questions.map((question) => {
            const response = result.responses.find(r => r.question_id === question.id);
            const isCorrect = response?.is_correct || false;
            return (
              <div key={question.id} className={cn(styles.questionItem, styles.resultQuestion)}>
                <p className={styles.questionText}>{question.question_text}</p>
                <p className={styles.resultAnswer}>
                  Sua resposta: <span className={isCorrect ? styles.correct : styles.incorrect}>{answers[question.id] || 'Não respondido'}</span>
                </p>
                {!isCorrect && response && (
                  <p className={styles.resultAnswer}>
                    Resposta correta: <span className={styles.correct}>{response.correct_answer}</span>
                  </p>
                )}
                {response && <p>{response.explanation}</p>}
              </div>
            );
          })}
        </div>
        <button onClick={onBack} className={styles.backButton}>
          &larr; Voltar para a unidade
        </button>
      </div>
    );
  }

  return (
    <div className={styles.exerciseView}>
      <button onClick={onBack} className={styles.backButton}>&larr; Voltar para a unidade</button>
      <h1 className={styles.title}>{exercise.title}</h1>
      <p className={styles.instructions}>{exercise.instructions}</p>
      
      <div className={styles.questionsList}>
        {exercise.questions.map((question) => (
          <div key={question.id} className={styles.questionItem}>
            <p className={styles.questionText}>{question.question_text}</p>
            {question.fill_blank_answer && (
              <input
                type="text"
                className={styles.answerInput}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Digite sua resposta aqui..."
              />
            )}
            {/* Add other question types here */}
          </div>
        ))}
      </div>

      {submitError && <div className={styles.error}>{submitError}</div>}

      <button onClick={handleSubmit} className={styles.submitButton}>
        Verificar Respostas
      </button>
    </div>
  );
}