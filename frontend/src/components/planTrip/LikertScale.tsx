import type { LikertFiveIndex } from '../../features/planTrip/types';
import { LIKERT_CIRCLE_DIAMETERS_PX, LIKERT_COLORS } from './likertScaleTokens';

type LikertScaleProps = {
  /** Statement shown above the scale (bold). */
  statement: string;
  /** 1-based step label for context, e.g. "Question 3 of 12". */
  stepLabel: string;
  value: LikertFiveIndex | null;
  onChange: (value: LikertFiveIndex) => void;
  disabled?: boolean;
};

const INDICES: readonly LikertFiveIndex[] = [0, 1, 2, 3, 4];

const OPTION_ARIA_LABEL: Record<LikertFiveIndex, string> = {
  0: 'Strongly agree',
  1: 'Agree',
  2: 'Neutral',
  3: 'Disagree',
  4: 'Strongly disagree',
};

function ringColorForIndex(i: LikertFiveIndex): string {
  if (i <= 1) return LIKERT_COLORS.agree.ring;
  if (i >= 3) return LIKERT_COLORS.disagree.ring;
  return LIKERT_COLORS.neutral.ring;
}

function fillColorForIndex(i: LikertFiveIndex): string {
  if (i <= 1) return LIKERT_COLORS.agree.fill;
  if (i >= 3) return LIKERT_COLORS.disagree.fill;
  return LIKERT_COLORS.neutral.fill;
}

export function LikertScale({
  statement,
  stepLabel,
  value,
  onChange,
  disabled = false,
}: LikertScaleProps) {
  const groupId = 'travel-personality-likert';

  return (
    <fieldset
      disabled={disabled}
      className="border-0 p-0 m-0 min-w-0 w-full max-w-2xl"
    >
      <legend className="sr-only">
        {stepLabel}. {statement}
      </legend>

      <p
        className="text-sm font-medium tracking-wide text-slate-400 uppercase mb-3"
        aria-hidden
      >
        {stepLabel}
      </p>

      <p
        id={`${groupId}-statement`}
        className="text-lg sm:text-xl font-semibold text-white leading-snug tracking-tight mb-10 text-balance"
      >
        {statement}
      </p>

      <div
        className="flex flex-row items-center justify-between gap-3 sm:gap-6"
        role="radiogroup"
        aria-labelledby={`${groupId}-statement`}
      >
        <span
          className="text-sm font-semibold shrink-0 w-14 sm:w-16 text-right sm:text-left"
          style={{ color: LIKERT_COLORS.agree.label }}
        >
          Agree
        </span>

        <div className="flex flex-1 items-center justify-center gap-2 sm:gap-3 min-w-0">
          {INDICES.map((i) => {
            const selected = value === i;
            const d = LIKERT_CIRCLE_DIAMETERS_PX[i];
            const ring = ringColorForIndex(i);
            const fill = fillColorForIndex(i);

            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={OPTION_ARIA_LABEL[i]}
                disabled={disabled}
                onClick={() => onChange(i)}
                className="rounded-full shrink-0 flex items-center justify-center transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121a2e] disabled:opacity-50 disabled:pointer-events-none hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  width: d,
                  height: d,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: ring,
                  backgroundColor: selected ? fill : 'transparent',
                  boxShadow: selected
                    ? `0 0 0 1px ${ring}, 0 8px 28px -8px ${ring}`
                    : undefined,
                }}
              />
            );
          })}
        </div>

        <span
          className="text-sm font-semibold shrink-0 w-14 sm:w-16 text-left sm:text-right"
          style={{ color: LIKERT_COLORS.disagree.label }}
        >
          Disagree
        </span>
      </div>
    </fieldset>
  );
}
