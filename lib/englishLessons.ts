/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Lesson {
  id: string;
  title: string;
  mistake: string;
  correction: string;
  explanation: string;
  examples: { wrong: string; right: string }[];
  extraNotes?: string;
}

export const englishLessons: Lesson[] = [
  {
    id: 'think-yes',
    title: "1. I think yes.",
    mistake: "'I think yes'",
    correction: "'I think so'",
    explanation: "This is often a direct translation from other languages, but it's not natural in English. We use 'I think so' to express affirmative belief or opinion.",
    examples: [
        { wrong: 'A: Is Katherine coming today? B: I think yes.', right: 'A: Is Katherine coming today? B: I think so.' }
    ],
    extraNotes: "Similarly, we don't say 'I think no'. The correct phrase is 'I don't think so'.",
  },
  {
    id: 'how-is-it-called',
    title: '2. How is it called?',
    mistake: "'How is it called?'",
    correction: "'What is it called?'",
    explanation: "In English, we use 'what' (not 'how') to ask for the name of something or someone. 'How' is used to ask about the manner or way something is done.",
    examples: [
        { wrong: 'How is this device called?', right: 'What is this device called?' },
        { wrong: 'How do you call this?', right: 'What do you call this?' }
    ],
    extraNotes: 'A very informal word you might hear is "whatchamacallit", used when you can\'t remember the name of something.',
  },
  {
    id: 'married-with',
    title: '3. Married with',
    mistake: "'I'm married with Will'",
    correction: "'I'm married to Will'",
    explanation: "When identifying a spouse, the correct preposition in English is 'to'. The structure is 'to be married to somebody'.",
    examples: [
        { wrong: "He's been married with Alice for 50 years.", right: "He's been married to Alice for 50 years." },
    ],
    extraNotes: "The phrase 'married with children' is correct, but it means a person is married and also has children. It doesn't identify the spouse.",
  },
  {
    id: 'explain-me',
    title: '4. Explain me',
    mistake: "'She explained me the rules'",
    correction: "'She explained the rules to me'",
    explanation: "The verb 'explain' is not followed directly by a person (an indirect object). You must explain *something* (the direct object) *to someone*.",
    examples: [
        { wrong: 'Can you explain me how this works?', right: 'Can you explain to me how this works?' },
        { wrong: 'He explained John the rules.', right: 'He explained the rules to John.' }
    ],
    extraNotes: "The structure is always 'explain + [thing] + to + [person]' or 'explain + to + [person] + [thing]'.",
  },
  {
    id: 'word-order',
    title: "5. I don't know where is it",
    mistake: "'I don't know where is Diego'",
    correction: "'I don't know where Diego is'",
    explanation: "This is a common mistake with indirect or embedded questions. After an introductory phrase like 'I don't know...', 'Could you tell me...', or 'I wonder...', the word order should be a statement (subject + verb), not a question (verb + subject).",
    examples: [
        { wrong: "I don't know what time is it.", right: "I don't know what time it is." },
        { wrong: 'Do you know where is the station?', right: 'Do you know where the station is?' }
    ],
    extraNotes: "Direct question: Where is Diego? | Indirect question: I don't know where Diego is.",
  },
];