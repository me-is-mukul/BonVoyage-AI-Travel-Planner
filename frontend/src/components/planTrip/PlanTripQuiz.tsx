import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictPersonality } from '../../features/planTrip/api/predictPersonality';
import { likertFiveIndexToModelAnswer } from '../../features/planTrip/likertMap';
import {
  SURVEY_QUESTION_COUNT,
  SURVEY_QUESTIONS,
} from '../../features/planTrip/questions.data';
import type { LikertFiveIndex, ModelAnswer } from '../../features/planTrip/types';
import { LikertScale } from './LikertScale';
import { PersonalityReveal } from './PersonalityReveal';

type StepAnswers = Array<LikertFiveIndex | null>;

function buildModelAnswers(answers: StepAnswers): ModelAnswer[] | null {
  if (answers.some((a) => a === null)) return null;
  return answers.map((idx) => likertFiveIndexToModelAnswer(idx as LikertFiveIndex));
}

export function PlanTripQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<StepAnswers>(() =>
    Array.from({ length: SURVEY_QUESTION_COUNT }, () => null),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personality, setPersonality] = useState<string | null>(null);

  const question = SURVEY_QUESTIONS[step];
  const currentValue = answers[step];
  const isLast = step === SURVEY_QUESTION_COUNT - 1;
  const progressPercent = ((step + 1) / SURVEY_QUESTION_COUNT) * 100;

  const setCurrentAnswer = useCallback(
    (v: LikertFiveIndex) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = v;
        return next;
      });
      setSubmitError(null);
    },
    [step],
  );

  const goNext = useCallback(() => {
    if (currentValue === null) return;
    setStep((s) => Math.min(s + 1, SURVEY_QUESTION_COUNT - 1));
  }, [currentValue]);

  const goPrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    setSubmitError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const modelAnswers = buildModelAnswers(answers);
    if (!modelAnswers) {
      setSubmitError('Please answer every question before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await predictPersonality(modelAnswers);

    setIsSubmitting(false);

    if ('error' in result) {
      setSubmitError(result.error);
      return;
    }

    setPersonality(result.personality);
  }, [answers]);

  if (personality !== null) {
    return (
      <PersonalityReveal
        personality={personality}
        onRetake={() => {
          setPersonality(null);
          setStep(0);
          setAnswers(Array.from({ length: SURVEY_QUESTION_COUNT }, () => null));
          setSubmitError(null);
        }}
        onBackHome={() => navigate('/')}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-10">
        <div
          className="h-1 rounded-full bg-white/[0.08] overflow-hidden ring-1 ring-white/[0.06]"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={SURVEY_QUESTION_COUNT}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-teal-400 to-violet-400 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(45,212,191,0.35)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500 text-right tabular-nums">
          {step + 1} / {SURVEY_QUESTION_COUNT}
        </p>
      </div>

      <div
        className="rounded-3xl border border-white/[0.1] bg-[#121a2e]/90 backdrop-blur-xl px-6 py-10 sm:px-12 sm:py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_32px_64px_-32px_rgba(0,0,0,0.65)]"
      >
        <LikertScale
          statement={question.text}
          stepLabel={`Question ${step + 1} of ${SURVEY_QUESTION_COUNT}`}
          value={currentValue}
          onChange={setCurrentAnswer}
          disabled={isSubmitting}
        />

        {submitError ? (
          <p
            className="mt-8 text-sm text-red-200 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 0 || isSubmitting}
            className="px-5 py-3 rounded-xl font-semibold text-slate-300 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/15 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Previous
          </button>

          <div className="flex gap-3 sm:ml-auto">
            {!isLast ? (
              <button
                type="button"
                onClick={goNext}
                disabled={currentValue === null || isSubmitting}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-900/40 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || answers.some((a) => a === null)}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-900/40 disabled:opacity-50 transition-all cursor-pointer min-w-32"
              >
                {isSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
