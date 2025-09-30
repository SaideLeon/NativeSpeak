/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { memo } from 'react';

interface MarkdownRendererProps {
  text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  // A simple renderer for bold (**text**) and newlines.
  const renderText = (inputText: string) => {
    return inputText.split('\n').map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return <div>{renderText(text)}</div>;
};

export default memo(MarkdownRenderer);
