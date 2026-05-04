import { useLocation, useNavigate } from 'react-router-dom';

type ItineraryState = {
  city?: string;
  personality?: string;
};

export const Itinerary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as ItineraryState;

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-x-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(56 189 248 / 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgb(167 139 250 / 0.12), transparent)',
        }}
      />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <button
          type="button"
          onClick={() => navigate('/plan-trip')}
          className="mb-8 text-sm font-semibold text-slate-400 hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-2"
        >
          <span aria-hidden>&#8592;</span>
          <span>Back to city selection</span>
        </button>

        <div className="rounded-3xl border border-white/10 bg-[#121a2e]/90 backdrop-blur-xl px-8 py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_32px_64px_-32px_rgba(0,0,0,0.65)]">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase mb-4">
            Itinerary Builder
          </p>
          <h1 className="text-3xl font-bold mb-3">
            {state.city ?? 'Selected City'}
          </h1>
          {state.personality ? (
            <p className="text-slate-400 text-sm mb-8">
              Personality: {state.personality}
            </p>
          ) : null}
          <p className="text-slate-200 text-lg">iterary will print here</p>
        </div>
      </main>
    </div>
  );
};
