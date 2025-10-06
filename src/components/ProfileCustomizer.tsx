import React from 'react';
import { useAuthStore } from '../lib/authStore';
import { AVATARS, THEMES } from '../lib/customization';
import cn from 'classnames';
import './ProfileCustomizer.css';

const ProfileCustomizer: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  return (
    <div className="profile-customizer">
      <div className="customizer-section">
        <h4>Avatar</h4>
        <div className="avatar-grid">
          {AVATARS.map((avatar) => (
            <button
              key={avatar}
              className={cn('avatar-option', { active: user?.avatar === avatar })}
              onClick={() => updateProfile({ avatar })}
              title={avatar.replace(/_/g, ' ')}
            >
              <span className="icon">{avatar}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="customizer-section">
        <h4>Tema</h4>
        <div className="theme-grid">
          {Object.entries(THEMES).map(([key, theme]) => (
            <button
              key={key}
              className={cn('theme-option', { active: user?.theme === key })}
              onClick={() => updateProfile({ theme: key })}
            >
              <div className="theme-swatch">
                <div className="swatch" style={{ background: theme.colors['--bg-secondary'] }}></div>
                <div className="swatch" style={{ background: theme.colors['--primary-light'] }}></div>
                <div className="swatch" style={{ background: theme.colors['--accent-green'] }}></div>
              </div>
              <span className="theme-name">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomizer;
