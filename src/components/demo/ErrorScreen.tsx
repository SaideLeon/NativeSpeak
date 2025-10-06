/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import React, { useEffect, useState } from 'react';

export interface ExtendedErrorType {
  code?: number;
  message?: string;
  status?: string;
}

export default function ErrorScreen() {
  const { client } = useLiveAPIContext();
  const [error, setError] = useState<{ message?: string } | null>(null);

  useEffect(() => {
    function onError(error: ErrorEvent) {
      console.error(error);
      setError(error);
    }

    client.on('error', onError);

    return () => {
      client.off('error', onError);
    };
  }, [client]);

  if (!error) {
    return null;
  }

  const quotaErrorMessage =
    'A API Gemini Live no AI Studio tem uma cota diária gratuita limitada. Volte amanhã para continuar.';

  const isQuotaError = error?.message?.includes('RESOURCE_EXHAUSTED');

  const errorMessage = isQuotaError ? quotaErrorMessage : 'Algo deu errado. Por favor, tente novamente.';
  const errorTitle = isQuotaError ? 'Cota Atingida' : 'Ocorreu um Erro';
  const errorIcon = isQuotaError ? 'hourglass_disabled' : 'error';
  const rawMessage = isQuotaError ? null : error?.message || null;
  const isCloseButtonDisabled = isQuotaError;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal-content">
        <div className="error-modal-header">
          <span className="icon">{errorIcon}</span>
          <h2>{errorTitle}</h2>
        </div>
        <p>{errorMessage}</p>
        {rawMessage && (
          <div className="error-raw-message-container">
            {rawMessage}
          </div>
        )}
        <div className="modal-actions">
          <button
            className="close-button"
            onClick={() => {
              setError(null);
            }}
            disabled={isCloseButtonDisabled}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
