/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useUnits, useUnitDetail } from '../../hooks/useCourseData';
import type { Unit, UnitDetail } from '../../types/course.types';

/**
 * Fetches all available learning units.
 * @returns A list of all units with their ID, title, and description.
 */
export async function getAllUnits(): Promise<Pick<Unit, 'id' | 'title' | 'description'>[]> {
  const { units } = useUnits();
  return units.map(({ id, title, description }) => ({ id, title, description }));
}

/**
 * Searches for a specific topic, theme, example, or dialogue within a given unit.
 * @param unitId The ID of the unit to search within.
 * @param query The search query string.
 * @returns A list of matching items found within the unit.
 */
export async function searchUnit(unitId: number, query: string): Promise<any[]> {
  const { unit } = useUnitDetail(unitId);
  if (!unit) {
    return [];
  }

  const results: any[] = [];
  const lowerCaseQuery = query.toLowerCase();

  unit.themes.forEach(theme => {
    if (theme.title.toLowerCase().includes(lowerCaseQuery)) {
      results.push({ type: 'theme', ...theme });
    }

    theme.topics.forEach(topic => {
      if (topic.title.toLowerCase().includes(lowerCaseQuery)) {
        results.push({ type: 'topic', ...topic });
      }

      topic.vocabulary_items.forEach(item => {
        if (
          item.word.toLowerCase().includes(lowerCaseQuery) ||
          item.translation.toLowerCase().includes(lowerCaseQuery) ||
          item.example_sentence.toLowerCase().includes(lowerCaseQuery)
        ) {
          results.push({ type: 'vocabulary', ...item });
        }
      });

      topic.grammar_contents.forEach(content => {
        if (content.title.toLowerCase().includes(lowerCaseQuery)) {
          results.push({ type: 'grammar', ...content });
        }
        content.examples.forEach(example => {
          if (example.example_sentence.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ type: 'grammar_example', ...example });
          }
        });
      });

      topic.dialogues.forEach(dialogue => {
        if (dialogue.title.toLowerCase().includes(lowerCaseQuery)) {
          results.push({ type: 'dialogue', ...dialogue });
        }
        dialogue.lines.forEach(line => {
          if (line.text.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ type: 'dialogue_line', ...line });
          }
        });
      });
    });
  });

  return results;
}
