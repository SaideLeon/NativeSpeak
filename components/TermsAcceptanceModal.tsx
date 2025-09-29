import React, { useState } from 'react';
import Modal from './Modal';
import { useAuthStore } from '../lib/authStore';
import LegalModal from './LegalModal';

const TermsAcceptanceModal: React.FC = () => {
  const { logout, acceptTerms, error } = useAuthStore();
  const [activeLegalDoc, setActiveLegalDoc] = useState<
    'privacy' | 'terms' | null
  >(null);

  const handleAccept = async () => {
    try {
      await acceptTerms();
      // No need to close, App.tsx will re-render and remove this component.
    } catch (e) {
      console.error('Failed to accept terms', e);
      // Error will be displayed via the store
    }
  };

  const handleDecline = () => {
    logout();
  };

  return (
    <>
      <Modal onClose={handleDecline}>
        {' '}
        {/* Declining is the default close action */}
        <div className="legal-modal-content">
          <h2>Termos e Condições Atualizados</h2>
          <p>
            Para continuar usando o NativeSpeak, por favor, revise e aceite
            nossos Termos de Uso e Política de Privacidade.
          </p>
          <p>
            Ao clicar em "Aceitar e Continuar", você confirma que leu e concorda
            com os nossos{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setActiveLegalDoc('terms');
              }}
            >
              Termos de Uso
            </a>{' '}
            e{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setActiveLegalDoc('privacy');
              }}
            >
              Política de Privacidade
            </a>
            . Se você não concordar, sua sessão será encerrada.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <div
            className="modal-actions"
            style={{
              justifyContent: 'space-between',
              marginTop: 'var(--space-lg)',
            }}
          >
            <button onClick={handleDecline} className="cancel-button">
              Recusar e Sair
            </button>
            <button onClick={handleAccept} className="save-button">
              Aceitar e Continuar
            </button>
          </div>
        </div>
      </Modal>
      {activeLegalDoc && (
        <LegalModal
          docType={activeLegalDoc}
          onClose={() => setActiveLegalDoc(null)}
        />
      )}
    </>
  );
};

export default TermsAcceptanceModal;
