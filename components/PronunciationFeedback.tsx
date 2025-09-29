import React from 'react';
import { PronunciationFeedback } from '../lib/state';
import './PronunciationFeedback.css';

interface PronunciationFeedbackProps {
  feedback: PronunciationFeedback | { error: string };
  originalText: string;
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = 'var(--success)';
  if (score < 80) strokeColor = 'var(--warning)';
  if (score < 50) strokeColor = 'var(--error)';

  return (
    <div className="score-gauge">
      <svg>
        <circle
          className="score-gauge-bg"
          cx="30"
          cy="30"
          r={radius}
        ></circle>
        <circle
          className="score-gauge-fg"
          cx="30"
          cy="30"
          r={radius}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        ></circle>
      </svg>
      <div className="score-text">{score}</div>
    </div>
  );
};

const PronunciationFeedbackDisplay: React.FC<PronunciationFeedbackProps> = ({
  feedback,
  originalText,
}) => {
  if ('error' in feedback) {
    return (
      <div className="pronunciation-feedback-container">
        <p className="feedback-error">{feedback.error}</p>
      </div>
    );
  }

  const getSummaryText = (score: number) => {
    if (score >= 90) return 'Excelente pronúncia!';
    if (score >= 75) return 'Muito bem! Continue praticando.';
    if (score >= 50) return 'Bom esforço. Alguns pontos a melhorar.';
    return 'Precisa de um pouco mais de prática. Continue tentando!';
  };

  // Create a map for quick lookup of feedback
  const feedbackMap = new Map(
    feedback.words.map(w => [w.word.toLowerCase().replace(/[.,?!]/g, ''), w])
  );

  return (
    <div className="pronunciation-feedback-container">
      <div className="feedback-header">
        <ScoreGauge score={feedback.overallScore} />
        <div className="feedback-summary">
          <h5>Feedback Geral</h5>
          <p>{getSummaryText(feedback.overallScore)}</p>
        </div>
      </div>
      <div className="feedback-words">
        {originalText.split(/(\s+)/).map((part, index) => {
          if (part.trim() === '') {
            return <span key={index}>{part}</span>; // Render whitespace
          }
          const cleanWord = part.toLowerCase().replace(/[.,?!]/g, '');
          // Fix: Add type assertion to resolve 'unknown' type from Map.get()
          const wordFeedback = feedbackMap.get(cleanWord) as PronunciationFeedback['words'][number] | undefined;

          if (wordFeedback && wordFeedback.accuracyScore < 85 && wordFeedback.feedback) {
            return (
              <span
                key={index}
                className="feedback-word mispronounced"
              >
                {part}
                <span className="tooltip">{wordFeedback.feedback}</span>
              </span>
            );
          }
          return (
            <span key={index} className="feedback-word">
              {part}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PronunciationFeedbackDisplay;
