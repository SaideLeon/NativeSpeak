/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useLogStore } from '../../../lib/state';

export default function TokenCounter() {
  const { inputTokens, outputTokens } = useLogStore(state => ({
    inputTokens: state.inputTokens,
    outputTokens: state.outputTokens,
  }));

  return (
    <div className="token-counter">
      <div
        className="token-display input-tokens"
        title="Tokens de Entrada (Estimado)"
      >
        <span className="icon">input</span>
        <span>{inputTokens}</span>
      </div>
      <div
        className="token-display output-tokens"
        title="Tokens de Saída (Estimado)"
      >
        <span className="icon">output</span>
        <span>{outputTokens}</span>
      </div>
    </div>
  );
}