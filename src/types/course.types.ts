// src/types/course.types.ts
export interface Unit {
  id: number;
  number: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  theme_count: number;
}

export interface Theme {
  id: number;
  title: string;
  icon: string;
  order: number;
  topics: Topic[];
}

export interface GrammarExample {
  id: number;
  subject: string;
  verb_form: string;
  example_sentence: string;
  translation: string;
  order: number;
}

export interface GrammarContent {
  id: number;
  title: string;
  explanation: string;
  examples: GrammarExample[];
  order: number;
}

export interface DialogueLine {
  id: number;
  speaker: string;
  text: string;
  translation: string;
  audio: string | null;
  order: number;
}

export interface DialogueContent {
  id: number;
  title: string;
  context: string;
  lines: DialogueLine[];
  order: number;
}

export interface Topic {
  id: number;
  title: string;
  topic_type: string;
  topic_type_display: string;
  icon: string;
  description: string;
  order: number;
  vocabulary_items: VocabularyItem[];
  grammar_contents: GrammarContent[];
  dialogues: DialogueContent[];
  example_boxes: any[]; // Define this later if needed
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  title: string;
  exercise_type: string;
  exercise_type_display: string;
  instructions: string;
  order: number;
  points: number;
  questions: any[]; // Define this later if needed
  question_count: number;
}

export interface Question {
  id: number;
  question_text: string;
  hint: string;
  explanation: string;
  order: number;
  points: number;
  answers: any[]; // Define this later if needed
  fill_blank_answer: FillBlankAnswer | null;
}

export interface FillBlankAnswer {
  id: number;
  correct_answer: string;
  alternative_answers: string;
  case_sensitive: boolean;
}

export interface ExerciseDetail extends Exercise {
  questions: Question[];
}

export interface SubmissionResponse {
  question_id: number;
  is_correct: boolean;
  points_earned: number;
  explanation: string;
  correct_answer: string;
}

export interface SubmissionResult {
  success: boolean;
  submission_id: number;
  score: number;
  max_score: number;
  percentage: number;
  responses: SubmissionResponse[];
}

export interface VocabularyItem {
  id: number;
  word: string;
  translation: string;
  pronunciation: string;
  image: string | null;
  audio: string | null;
  example_sentence: string;
  order: number;
}

export interface UnitDetail extends Unit {
  themes: Theme[];
}
