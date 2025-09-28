/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './WelcomeScreen.css';
import { useTools, Template } from '../../../lib/state';

// Re-themed content for English learning scenarios, but using existing template keys.
const welcomeContent: Record<
  Template,
  { title: string; description: string; prompts: string[] }
> = {
  'customer-support': {
    title: 'Everyday Conversation',
    description: 'Practice common social interactions and daily chats.',
    prompts: [
      'How was your weekend?',
      "Let's talk about our hobbies.",
      'What kind of music do you like?',
    ],
  },
  'personal-assistant': {
    title: 'Job Interview Practice',
    description:
      'Prepare for professional interviews and answer common questions.',
    prompts: [
      'Tell me about yourself.',
      'What are your biggest strengths?',
      'Do you have any questions for me?',
    ],
  },
  'navigation-system': {
    title: 'Travel & Directions',
    description: 'Practice asking for directions and navigating a new city.',
    prompts: [
      'How do I get to the museum?',
      'Excuse me, where is the nearest subway station?',
      "I'd like to book a table for two.",
    ],
  },
};

const WelcomeScreen: React.FC = () => {
  const { template, setTemplate } = useTools();
  const { title, description, prompts } = welcomeContent[template];
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="title-container">
          <span className="welcome-icon">mic</span>
          <div className="title-selector">
            <select
              value={template}
              onChange={e => setTemplate(e.target.value as Template)}
              aria-label="Select a practice scenario"
            >
              <option value="customer-support">Everyday Conversation</option>
              <option value="personal-assistant">Job Interview</option>
              <option value="navigation-system">Travel & Directions</option>
            </select>
            <span className="icon">arrow_drop_down</span>
          </div>
        </div>
        <p>{description}</p>
        <div className="example-prompts">
          {prompts.map((prompt, index) => (
            <div key={index} className="prompt">
              {prompt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;