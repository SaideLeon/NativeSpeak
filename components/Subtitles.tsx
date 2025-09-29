/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useUI } from '../lib/state';
import cn from 'classnames';

const Subtitles: React.FC = () => {
  const { subtitleText } = useUI();

  return (
    <div className={cn('subtitles-container', { visible: !!subtitleText })}>
      <p className="subtitle-text">{subtitleText}</p>
    </div>
  );
};

export default Subtitles;
