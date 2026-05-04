import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ItineraryPlan } from '../components/planTrip/ItineraryPlan';
import { sortDayKeys } from '../components/planTrip/itineraryPlanUtils';
import { getItinerary } from '../features/planTrip/api/getItinerary';
import type { ItineraryByDay } from '../features/planTrip/types';

export type ItineraryLocationState = {
  city?: string;
  personality?: string;
  /** Optional initial trip length (defaults to 5 on this page). */
  days?: number;
};

const DAY_PRESETS = [2, 3, 5, 7, 10, 14] as const;

export const Itinerary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fromNav = useMemo(
    () => (location.state ?? {}) as ItineraryLocationState,
    [location.state],
  );

  const city = fromNav.city?.trim() ?? '';
  const personality = fromNav.personality?.trim() ?? '';

  const [days, setDays] = useState(() => {
    const d = fromNav.days;
    if (typeof d === 'number' && Number.isFinite(d)) {
      return Math.min(21, Math.max(1, Math.round(d)));
    }
    return 5;
  });

  const [itinerary, setItinerary] = useState<ItineraryByDay | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ city: string; days: number; personality: string } | null>(
    null,
  );

  const abortRef = useRef<AbortController | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!city || !personality) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const controller = abortRef.current;

    setLoading(true);
    setError(null);

    const response = await getItinerary({
      city,
      days,
      personality,
      signal: controller.signal,
    });

    if (controller.signal.aborted) return;

    setLoading(false);

    if ('error' in response) {
      setItinerary(null);
      setMeta(null);
      setError(response.error);
      return;
    }

    setMeta({
      city: response.city,
      days: response.days,
      personality: response.personality,
    });
    setItinerary(response.itinerary);
  }, [city, days, personality]);

  useEffect(() => {
    if (!city || !personality) {
      setItinerary(null);
      setMeta(null);
      setError(null);
      return;
    }
    void fetchPlan();
    return () => {
      abortRef.current?.abort();
    };
  }, [city, personality, days, fetchPlan]);

  const totalStops = useMemo(() => {
    if (!itinerary) return 0;
    return sortDayKeys(Object.keys(itinerary)).reduce(
      (sum, key) => sum + (itinerary[key]?.length ?? 0),
      0,
    );
  }, [itinerary]);

  const invalidContext = !city || !personality;

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-x-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(56 189 248 / 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgb(167 139 250 / 0.12), transparent)',
        }}
      />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-14 sm:py-16 pb-28">
        <button
          type="button"
          onClick={() => navigate('/plan-trip')}
          className="mb-8 text-sm font-semibold text-slate-400 hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-2"
        >
          <span aria-hidden>&#8592;</span>
          <span>Back to personality &amp; cities</span>
        </button>

        {invalidContext ? (
          <div className="rounded-3xl border border-white/10 bg-[#121a2e]/90 backdrop-blur-xl px-8 py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_32px_64px_-32px_rgba(0,0,0,0.65)] text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase mb-4">
              Itinerary
            </p>
            <h1 className="text-2xl font-bold mb-3">Pick a destination first</h1>
            <p className="text-slate-400 text-sm mb-10 max-w-md mx-auto leading-relaxed">
              Start the travel personality quiz, choose a recommended city, and you will land
              here with a personalised day-by-day plan.
            </p>
            <button
              type="button"
              onClick={() => navigate('/plan-trip')}
              className="px-8 py-3 rounded-2xl font-semibold text-white bg-linear-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-900/40 transition-all cursor-pointer"
            >
              Go to quiz
            </button>
          </div>
        ) : (
          <>
            <header className="mb-10 rounded-3xl border border-white/10 bg-[#121a2e]/90 backdrop-blur-xl px-8 py-8 sm:py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_32px_64px_-32px_rgba(0,0,0,0.65)]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase mb-3">
                    Your itinerary
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
                    {city}
                  </h1>
                  <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                    Tailored stops for{' '}
                    <span className="text-teal-200/95 font-medium">{days} days</span> based on
                    your traveller profile:&nbsp;
                    <span className="text-white font-semibold">{personality}</span>
                  </p>
                  {meta !== null ? (
                    <p className="mt-6 text-xs text-slate-500">
                      Generated plan version ·{' '}
                      <span className="tabular-nums">{totalStops}</span>{' '}
                      {totalStops === 1 ? 'experience' : 'experiences'}{' '}
                      across <span className="tabular-nums">{meta.days}</span>{' '}
                      {meta.days === 1 ? 'day' : 'days'}.
                    </p>
                  ) : loading ? (
                    <p className="mt-6 text-xs text-slate-500 animate-pulse">Building schedule…</p>
                  ) : null}
                </div>

                <div className="shrink-0 w-full sm:max-w-xs flex flex-col gap-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Trip length
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DAY_PRESETS.map((d) => {
                      const selected = days === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          disabled={loading}
                          onClick={() => setDays(d)}
                          className={`min-w-[2.85rem] rounded-xl px-3 py-2 text-sm font-semibold tabular-nums transition-all disabled:opacity-55 cursor-pointer ${
                            selected
                              ? 'bg-linear-to-br from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-900/50 ring-1 ring-white/20'
                              : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/8 hover:border-white/20'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/2 px-4 py-3">
                    <label htmlFor="custom-days-input" className="block text-[11px] text-slate-500 mb-2">
                      Or type 1–21 days
                    </label>
                    <input
                      id="custom-days-input"
                      type="number"
                      min={1}
                      max={21}
                      value={days}
                      onChange={(e) =>
                        setDays(Math.min(21, Math.max(1, Number.parseInt(e.target.value, 10) || 1)))
                      }
                      disabled={loading}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-400/70 disabled:opacity-55"
                    />
                  </div>
                </div>
              </div>
            </header>

            {error ? (
              <div className="mb-8 rounded-2xl border border-red-400/35 bg-red-500/10 px-5 py-4 text-red-100 text-sm">
                {error}
              </div>
            ) : null}

            <div aria-busy={loading} className={loading ? 'opacity-85 pointer-events-none' : ''}>
              {loading && !itinerary ? (
                <div className="space-y-6 animate-pulse" aria-live="polite">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 rounded-2xl border border-white/5 bg-white/4" />
                  ))}
                </div>
              ) : itinerary ? (
                <ItineraryPlan itinerary={itinerary} />
              ) : !loading ? (
                <div className="rounded-3xl border border-white/10 bg-white/3 px-8 py-12 text-center text-slate-400 text-sm">
                  No itinerary to display yet.
                </div>
              ) : null}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
