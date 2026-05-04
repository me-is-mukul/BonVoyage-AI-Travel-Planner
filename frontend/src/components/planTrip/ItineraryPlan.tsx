import type { ItineraryByDay } from '../../features/planTrip/types';
import { sortDayKeys } from './itineraryPlanUtils';

type ItineraryPlanProps = {
  itinerary: ItineraryByDay;
};

export function ItineraryPlan({ itinerary }: ItineraryPlanProps) {
  const dayKeys = sortDayKeys(Object.keys(itinerary));

  return (
    <div className="space-y-8">
      {dayKeys.map((dayKey) => {
        const stops = itinerary[dayKey];

        return (
          <section
            key={dayKey}
            className="rounded-2xl border border-white/10 bg-white/3 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-white">{dayKey}</h2>
              <p className="text-xs font-medium text-slate-500 tabular-nums">
                {stops?.length ?? 0} {stops?.length === 1 ? 'stop' : 'stops'}
              </p>
            </div>

            {stops?.length ? (
              <ol className="relative space-y-0">
                {stops.map((stop, idx) => {
                  const last = idx === stops.length - 1;
                  return (
                    <li key={`${stop.time}-${stop.name}-${idx}`} className="relative flex gap-5">
                      <div className="flex flex-col items-center shrink-0 w-28 sm:w-32">
                        <time className="text-sm font-semibold tabular-nums text-teal-300">
                          {stop.time}
                        </time>
                        <div
                          className="mt-2 flex h-full flex-col items-center"
                          aria-hidden
                        >
                          <span className="h-3 w-3 rounded-full bg-linear-to-br from-teal-400 to-sky-500 shadow-[0_0_16px_-2px_rgba(56,189,248,0.7)] ring-4 ring-teal-500/25" />
                          {!last ? (
                            <span className="my-1 w-px grow min-h-11 bg-linear-to-b from-white/35 to-white/10" />
                          ) : null}
                        </div>
                      </div>
                      <div className={`pb-8 ${last ? 'pb-0' : ''} min-w-0 flex-1`}>
                        <p className="text-lg font-semibold text-white leading-snug">{stop.name}</p>
                        <p className="mt-1.5 text-sm text-slate-400">{stop.place}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-slate-500 text-sm">
                Nothing scheduled — add more attraction data or try a shorter trip span.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
