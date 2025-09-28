/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import Modal from './Modal';
import { useAuthStore } from '../lib/authStore';
import cn from 'classnames';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { login, register, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
            // This should be handled by the store, but a local check is faster.
            useAuthStore.setState({ error: "Passwords do not match." });
            return;
        }
        await register(email, password);
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
    useAuthStore.setState({ error: null });
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    resetForm();
  }

  return (
    <Modal onClose={onClose}>
      <div className="auth-modal">
        <div className="auth-tabs">
          <button className={cn({ active: isLoginView })} onClick={toggleView}>Login</button>
          <button className={cn({ active: !isLoginView })} onClick={toggleView}>Register</button>
        </div>
        <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLoginView && (
            <div className="form-field">
              <label htmlFor="auth-confirm-password">Confirm Password</label>
              <input
                id="auth-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          {error && <p className="auth-error">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="submit-button">
              {isLoginView ? 'Login' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AuthModal;