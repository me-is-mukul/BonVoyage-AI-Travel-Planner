import type { LikertFiveIndex, ModelAnswer } from './types';

/** Left (0) = 5 (strong agree), right (4) = 1 (strong disagree) — matches training CSV scale. */
export function likertFiveIndexToModelAnswer(index: LikertFiveIndex): ModelAnswer {
  return (5 - index) as ModelAnswer;
}
