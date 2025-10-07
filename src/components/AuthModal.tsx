/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import Modal from './Modal';
import { useAuthStore } from '../lib/authStore';
import cn from 'classnames';
import LegalModal from './LegalModal';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<
    'privacy' | 'terms' | null
  >(null);

  const { login, register, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginView && !termsAccepted) {
      useAuthStore.setState({
        error: 'Você deve aceitar os termos para se registrar.',
      });
      return;
    }
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          useAuthStore.setState({ error: 'As senhas não coincidem.' });
          return;
        }
        await register(email, password, firstName, lastName);
      }
      onClose(); // Close modal on success
    } catch (e) {
      // Error is already set in the store, no need to do anything here
      console.error(e);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setTermsAccepted(false);
    useAuthStore.setState({ error: null });
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    resetForm();
  };

  return (
    <>
      <Modal onClose={onClose}>
        <div className="auth-modal">
          <div className="auth-tabs">
            <button
              className={cn({ active: isLoginView })}
              onClick={toggleView}
            >
              Login
            </button>
            <button
              className={cn({ active: !isLoginView })}
              onClick={toggleView}
            >
              Register
            </button>
          </div>
          <h2>{isLoginView ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="name-fields">
                <div className="form-field">
                  <label htmlFor="auth-firstname">Nome</label>
                  <input
                    id="auth-firstname"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="auth-lastname">Sobrenome</label>
                  <input
                    id="auth-lastname"
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="form-field">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="auth-password">Senha</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLoginView && (
              <>
                <div className="form-field">
                  <label htmlFor="auth-confirm-password">
                    Confirmar Senha
                  </label>
                  <input
                    id="auth-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field terms-field">
                  <input
                    id="auth-terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="auth-terms">
                    Eu li e aceito os{' '}
                    <a onClick={() => setActiveLegalDoc('terms')}>
                      Termos de Uso
                    </a>{' '}
                    e a{' '}
                    <a onClick={() => setActiveLegalDoc('privacy')}>
                      Política de Privacidade
                    </a>
                    .
                  </label>
                </div>
              </>
            )}
            {error && <p className="auth-error">{error}</p>}
            <div className="modal-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={!isLoginView && !termsAccepted}
              >
                {isLoginView ? 'Login' : 'Registrar'}
              </button>
            </div>
          </form>
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

export default AuthModal;