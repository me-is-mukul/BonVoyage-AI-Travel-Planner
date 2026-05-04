import type { SurveyQuestion } from './types';

/**
 * Order must match `train_model.py` column rename mapping (Q1…Q12) and backend `answers` array.
 */
export const SURVEY_QUESTIONS: readonly SurveyQuestion[] = [
  { id: 'Q1', text: 'When traveling, I value excitement (thrill).' },
  {
    id: 'Q2',
    text: 'I like places that offer historical attractions / monuments.',
  },
  { id: 'Q3', text: 'I avoid typical tourist places whenever possible.' },
  {
    id: 'Q4',
    text: 'I like physically demanding travel experiences (trekking, rafting, long walks).',
  },
  { id: 'Q5', text: 'I usually make many new friends during my travels.' },
  {
    id: 'Q6',
    text: 'I prefer places that teach me something and broaden my knowledge than simply help me get mind off work and everyday life.',
  },
  {
    id: 'Q7',
    text: 'When traveling, I prefer to spend time with other people than alone.',
  },
  {
    id: 'Q8',
    text: 'I like visiting busy markets, festivals, and cultural events.',
  },
  { id: 'Q9', text: 'I prefer calm, quiet destinations over crowded ones.' },
  {
    id: 'Q10',
    text: 'I prefer destinations that push me out of my comfort zone.',
  },
  {
    id: 'Q11',
    text: 'I prefer destinations known for culture and heritage over purely scenic locations.',
  },
  {
    id: 'Q12',
    text: 'I travel mainly to relax my mind rather than seek excitement.',
  },
] as const;

export const SURVEY_QUESTION_COUNT = SURVEY_QUESTIONS.length;
