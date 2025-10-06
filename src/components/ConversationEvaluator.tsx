/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useEvaluationStore } from '../lib/evaluationStore';
import { useLogStore } from '../lib/state';
import MarkdownRenderer from './MarkdownRenderer';
import cn from 'classnames';

const ConversationEvaluator: React.FC = () => {
  const {
    isLoading,
    lastEvaluation,
    evaluateConversation,
  } = useEvaluationStore();
  const { turns } = useLogStore();

  const handleEvaluate = () => {
    evaluateConversation(turns);
  };

  const ratingColorClass = {
    'Péssima': 'rating-poor',
    'Média': 'rating-medium',
    'Alta': 'rating-high',
  };

  return (
    <div className="conversation-evaluator">
      <h4 className="sidebar-section-title">Avaliação da Conversa</h4>
      <button
        onClick={handleEvaluate}
        disabled={isLoading || turns.length === 0}
        className="evaluate-button"
      >
        {isLoading ? (
          <span className="loader"></span>
        ) : (
          <>
            <span className="icon">rate_review</span>
            Avaliar Última Conversa
          </>
        )}
      </button>

      {lastEvaluation && (
        <div className="evaluation-result">
          <div className="evaluation-header">
            <span className="evaluation-title">Última Avaliação:</span>
            <span
              className={cn(
                'evaluation-rating',
                ratingColorClass[lastEvaluation.rating],
              )}
            >
              {lastEvaluation.rating}
            </span>
          </div>
          <div className="evaluation-feedback">
            <MarkdownRenderer text={lastEvaluation.feedback} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationEvaluator;
