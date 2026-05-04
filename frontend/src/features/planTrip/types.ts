/**
 * Five UI positions left → right: strong agree … strong disagree.
 * Maps to model answers via `likertFiveIndexToModelAnswer` (5 … 1).
 */
export type LikertFiveIndex = 0 | 1 | 2 | 3 | 4;

/** Model / backend expects twelve integers in survey column order (1–5 each). */
export type ModelAnswer = 1 | 2 | 3 | 4 | 5;

export type QuestionId = `Q${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;

export type SurveyQuestion = {
  id: QuestionId;
  /** Display text only (no leading number — step indicator is separate). */
  text: string;
};

export type PredictPersonalityResponse =
  | { personality: string }
  | { error: string };
